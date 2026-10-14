#!/usr/bin/env node
import path from "node:path";
import fs from "node:fs/promises";
import { experiments, getExperiment } from "./config/experiments.js";
import { manualConfig } from "./config/manual-config.js";
import { collectSource } from "./collectors/sourceCollector.mjs";
import { startExperimentRuntime } from "./collectors/runtimeCollector.mjs";
import { collectTests } from "./collectors/testCollector.mjs";
import { collectScreenshots } from "./collectors/screenshotCollector.mjs";
import { generateHtmlManual } from "./generators/htmlGenerator.mjs";
import { generatePdf } from "./generators/pdfGenerator.mjs";
import { validateEvidence } from "./validators/evidenceValidator.mjs";
import { validateScreenshots } from "./validators/screenshotValidator.mjs";
import { validateContent } from "./validators/contentValidator.mjs";
import { validatePdf } from "./validators/pdfValidator.mjs";
import { ensureDir, exists, fromRoot, relative, writeJson, writeText } from "./utils/files.mjs";

const argument = process.argv[process.argv.indexOf("--experiment") + 1];
if (!argument || !["all", ...experiments.map((item) => String(item.id))].includes(argument)) {
  console.error("Usage: node scripts/manual-agent/run-manual-agent.mjs --experiment <1-10|all>");
  process.exit(1);
}

async function writeReport(evidenceDir, { problem, command, error, affected, action }) {
  await writeText(path.join(evidenceDir, "agent-report.md"), `# Manual Agent Report\n\n## Problem\n${problem}\n\n## Command\n\`${command}\`\n\n## Error\n${error}\n\n## Affected section\n${affected}\n\n## Required human action\n${action}\n`);
}

async function runExperiment(experiment) {
  const evidenceDir = fromRoot(manualConfig.evidenceRoot, `exp${experiment.id}`);
  await ensureDir(evidenceDir);
  const sourceFiles = [...new Set([
    ...["README.md", "TEST_CASES.md", "package.json", "index.html", "styles.css", "script.js"].map((file) => `${experiment.path}/${file}`),
    ...(experiment.snippets || []).map((snippet) => snippet.file)
  ])];
  const filesUsed = [];
  for (const file of sourceFiles) if (await exists(fromRoot(file))) filesUsed.push(file);
  const evidence = {
    experiment: experiment.id,
    title: experiment.title,
    requirements: experiment.requirements,
    implemented: [],
    missing: [],
    files_used: filesUsed,
    screenshots_required: experiment.screenshotTarget
  };
  if (![1, 2, 3, 4, 6, 9].includes(experiment.id)) {
    evidence.missing.push(`Automation for Experiment ${experiment.id} has not been implemented yet; no runtime evidence, manual or PDF was generated.`);
    await writeJson(path.join(evidenceDir, "evidence.json"), evidence);
    await writeReport(evidenceDir, { problem: `Experiment pipeline is not implemented for Experiment ${experiment.id}.`, command: `node scripts/manual-agent/run-manual-agent.mjs --experiment ${experiment.id}`, error: "No collector configuration exists for this experiment.", affected: "Runtime test, screenshot, manual and PDF generation", action: "Implement collectors and test scenarios for this experiment before generating documentation." });
    return { experiment, status: "BLOCKED", tests: "0/0", screenshots: 0, snippets: 0, manual: "not generated", pdf: "not generated", validation: "BLOCKED" };
  }
  let runtime;
  try {
    const snippets = await collectSource(experiment, evidenceDir);
    evidence.implemented = experiment.id === 1 ? [
      "Current main React RegisterPage renders reader, delivery, password confirmation and reader-terms controls with visible client-side feedback.",
      "Current main CSS uses a two-column form grid on desktop and a responsive one-column mobile form grid.",
      "Current AuthContext and the shared apiRequest helper wire the form to the real /auth/register endpoint."
    ] : experiment.id === 9 ? [
      "Integrated three-tier MERN stack architecture connecting React 18 SPA, Node.js runtime, Express REST API, and MongoDB with Mongoose ODM.",
      "Unified client-side fetch service with automatic JWT Bearer token attachment and centralized JSON parsing.",
      "Asynchronous data flow synchronizing React Hooks (useState, useEffect, useContext) with backend REST endpoints for catalogue, membership, and rental operations.",
      "Secure end-to-end user authentication with bcrypt password hashing in MongoDB, signed JWT tokens, and React protected route guards."
    ] : experiment.id === 6 ? [
      "Node.js and Express server initialization with security middleware (Helmet, CORS, rate limiting, JSON parser, and centralized error handling).",
      "Mongoose ODM integration with typed schemas, field validators, default values, timestamps, and compound text indexing for MongoDB collections.",
      "RESTful API CRUD endpoints for books, categories, plans, and user authentication with JWT security middleware and role-based access control.",
      "Full end-to-end integration verified with the live Kitab Ghar React client on localhost."
    ] : experiment.id === 4 ? [
      "React Router v6 creates a Single Page Application with declarative BrowserRouter, Routes, Route, NavLink, Link, and Outlet layout.",
      "Dynamic routing with useParams() extracts book ID parameters and useEffect() manages async lifecycle data fetching and title synchronization.",
      "Custom React Hooks (useState, useEffect, useContext, useMemo, useNavigate, useLocation) control search, filtering, auth sessions, and protected route guarding."
    ] : experiment.id === 3 ? [
      "Current React functional components render the Kitab Ghar layout, home page, hero, Book Genie, live Books page and reusable BookCard list.",
      "Current JSX passes live book objects to BookCard and passes live books, loading state and callbacks to BookGenieWizard as props.",
      "Current useState values control the Books-page search, category, availability and sort choices as well as Book Genie loading and popup state."
    ] : experiment.id === 2 ? [
      "The actual main Book Genie uses ES6 arrays, arrow functions, anonymous handlers and self-managed popup state.",
      "The current Book Genie recommendation engine processes the live catalogue with array methods and callback functions.",
      "The real current Books page uses ES6 state, URLSearchParams, search, availability filtering and alphabetical sorting with the API-backed catalogue."
    ] : [
      "Semantic registration form with reader, membership, password and terms controls.",
      "Bootstrap responsive grid and form validation classes.",
      "JavaScript field validation, age limits, password meter, confirmation check and Bootstrap modal."
    ];
    runtime = await startExperimentRuntime(experiment);
    const testReport = await collectTests(experiment, runtime);
    const logoCheck = testReport.runtimeChecks.find((item) => item.name === "Brand identity");
    const bootstrapCheck = testReport.runtimeChecks.find((item) => item.name === "Bootstrap dependency in current main UI");
    if (logoCheck?.status !== "PASS") evidence.missing.push(`The branding asset referenced by ${logoCheck.source} did not load in the actual local run (naturalWidth: ${logoCheck.naturalWidth}).`);
    if (experiment.id === 1 && bootstrapCheck?.status !== "PASS") evidence.missing.push("EVIDENCE MISSING: the current main React registration page does not load Bootstrap or a Bootstrap confirmation modal. Equivalent visible client-side validation is implemented with the current React component and stylesheet.");
    const figures = await collectScreenshots(experiment, runtime, evidenceDir);
    await writeJson(path.join(evidenceDir, "test-results.json"), testReport);
    await writeJson(path.join(evidenceDir, "figure-manifest.json"), figures);
    await writeJson(path.join(evidenceDir, "evidence.json"), evidence);
    const htmlPath = await generateHtmlManual({ experiment, snippets, figures, testReport, evidence });
    const pdfPath = await generatePdf(experiment, htmlPath);
    const validations = {
      evidence: validateEvidence({ experiment, snippets, figures, testReport, evidence }),
      screenshots: await validateScreenshots(figures, evidenceDir),
      content: await validateContent(htmlPath),
      pdf: await validatePdf(pdfPath)
    };
    await writeJson(path.join(evidenceDir, "validation.json"), validations);
    const failures = Object.values(validations).filter((result) => result.status === "FAIL");
    if (logoCheck?.status !== "PASS" || failures.length) await writeReport(evidenceDir, { problem: failures.length ? `Experiment ${experiment.id} has failed validation and runtime evidence gaps.` : "The Kitab Ghar branding image does not load in the executed page.", command: runtime.command, error: `Brand check: type=${logoCheck?.type}, complete=${logoCheck?.complete}, naturalWidth=${logoCheck?.naturalWidth}, source=${logoCheck?.source}\nBootstrap check: available=${bootstrapCheck?.available}\nValidation failures: ${JSON.stringify(failures, null, 2)}`, affected: failures.length ? "Evidence, screenshot, HTML or PDF validation" : "Overview and responsive output screenshots; branding evidence", action: failures.length ? "Resolve the listed test or validation failures, then rerun the manual agent." : "Place the approved logo at client/src/assets/kitab-ghar-logo.png or correct the experiment image path, then rerun the manual agent." });
    else await fs.rm(path.join(evidenceDir, "agent-report.md"), { force: true });
    const passed = testReport.tests.filter((test) => test.status === "PASS").length;
    return { experiment, status: failures.length ? "FAIL" : (evidence.missing.length ? "PASS WITH EVIDENCE MISSING" : "PASS"), tests: `${passed}/${testReport.tests.length}`, screenshots: figures.length, snippets: snippets.length, manual: relative(htmlPath), pdf: relative(pdfPath), validation: failures.length ? "FAIL" : "PASS" };
  } catch (error) {
    await writeJson(path.join(evidenceDir, "evidence.json"), evidence);
    await writeReport(evidenceDir, { problem: "Manual-agent run stopped before completion.", command: `node scripts/manual-agent/run-manual-agent.mjs --experiment ${experiment.id}`, error: error.stack || error.message, affected: "Experiment evidence collection", action: "Review the error, ensure the required runtime is available, then rerun the command." });
    return { experiment, status: "FAIL", tests: "0/0", screenshots: 0, snippets: 0, manual: "not generated", pdf: "not generated", validation: "FAIL" };
  } finally { if (runtime) await runtime.close(); }
}

const requested = argument === "all" ? experiments : [getExperiment(argument)];
const outcomes = [];
for (const experiment of requested) outcomes.push(await runExperiment(experiment));
for (const outcome of outcomes) {
  console.log(`\nExperiment ${outcome.experiment.id}\nStatus: ${outcome.status}\nImplementation: ${outcome.experiment.path}\nTests: ${outcome.tests}\nScreenshots: ${outcome.screenshots}\nCode snippets: ${outcome.snippets}\nManual: ${outcome.manual}\nPDF: ${outcome.pdf}\nValidation: ${outcome.validation}`);
}
process.exitCode = outcomes.some((outcome) => outcome.status === "FAIL") ? 1 : 0;
