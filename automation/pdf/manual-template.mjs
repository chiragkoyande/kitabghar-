/**
 * Kitab Ghar · Academic Practical Manual Template (Black & White, Reference-Identical)
 * 
 * Modeled after the reference manual (WT_All_Experiments_KunalSoyane_3564.pdf).
 * - Starts immediately with Experiment No. X (NO separate cover page)
 * - Pure Black and White typography (no colored highlights, no badges)
 * - Standard academic spacing and font styling (Times New Roman, 12pt body, 1.45 line-height)
 * - Clear bold section titles and clean code/figure/table layout
 */

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// These additions deliberately describe the work performed in each individual
// practical.  They are kept separate from the data file so that the standard
// manual structure remains consistent while the academic narrative is specific.
const experimentNarrative = {
  1: {
    procedure: "The Kitab Ghar reader registration module was tested through a sequence of invalid and valid input states before the final responsive verification. Blank submission was checked first, followed by invalid email, mobile number, date of birth, pincode, password, and password-confirmation values. The completed registration form was then submitted with valid reader details to verify the successful validation state and confirmation modal. The interface was additionally checked at desktop and mobile viewport sizes to confirm that the Bootstrap grid changes from a two-column arrangement to a stacked single-column layout.",
    result: "",
    conclusion: ""
  },
  2: {
    procedure: "The Kitab Ghar ES6 demonstration suite was tested feature-by-feature using the book catalogue dataset. The execution started with arrow-function based formatting and array processing, followed by anonymous callback execution, higher-order array methods, DOM event handling, and browser popup interactions. Each section was triggered independently in the browser and its visible output was checked. The non-DOM ES6 logic was also executed through the Node.js companion script to confirm that the core JavaScript operations produced the expected results outside the browser environment.",
    result: "",
    conclusion: ""
  },
  3: {
    procedure: "The Kitab Ghar React application was examined through its component hierarchy and then tested through the browser to verify functional components, JSX rendering, props, and state management. The testing focused on the reusable BookCard component, the BooksPage state variables, the GenieHero component, and the catalogue interactions. Search, category filtering, book selection, and empty-state behaviour were used to observe how changes in React state triggered re-rendering of the interface.",
    result: "",
    conclusion: ""
  },
  4: {
    procedure: "The Kitab Ghar React Router application was first inspected to verify its route hierarchy, shared layout, protected routes, and dynamic book-detail route. The running Vite application was then tested by navigating between public pages, opening the Book Genie flow, loading the catalogue, and resolving a dynamic /books/:id path. Hook-driven state and lifecycle behaviour were observed through controlled search and filter interactions, route changes, and authentication redirection. The browser Network panel and Back/Forward controls were also checked to confirm client-side navigation without unnecessary document reloads.",
    result: "",
    conclusion: ""
  },
  5: {
    procedure: "The database connection and collections were inspected before a uniquely labelled temporary book document was inserted. That same document was read by identifier, updated, verified, deleted, and checked again to confirm cleanup; the live catalogue was then opened through the client.",
    result: "",
    conclusion: ""
  },
  6: {
    procedure: "The Kitab Ghar backend was first inspected from the server/ directory to understand how Express initializes the application, connects to MongoDB through Mongoose, applies middleware, and mounts modular routes. The backend was then executed and tested through its health, catalogue, book-detail, authentication, and protected-reader workflows. This allowed the relationship between the Express request pipeline, Mongoose models, controllers, routes, and MongoDB data to be observed as a complete backend flow.",
    result: "",
    conclusion: ""
  },
  7: {
    procedure: "The Kitab Ghar Node.js core-module demonstrations were executed independently so that each required runtime capability could be observed without depending on the Express application developed in the previous experiment. The tests covered interactive REPL evaluation, raw HTTP request handling, synchronous and asynchronous file operations, binary buffer manipulation, chunked stream processing, and asynchronous Event Loop scheduling. Temporary files and server processes were cleaned up after verification.",
    result: "",
    conclusion: ""
  },
  8: {
    procedure: "The Kitab Ghar REST API was first inspected to identify the book resource routes, controller functions, and authentication middleware. The Express server was then started and the public endpoints were tested before attempting protected operations. The testing sequence intentionally included both successful requests and an unauthorized write request so that HTTP methods, response codes, JSON responses, and JWT-based route protection could be verified. The same sequence was then executed through the automated curl test script, with the Postman collection available for graphical inspection and request reproduction.",
    result: "",
    conclusion: ""
  },
  9: {
    procedure: "The complete Kitab Ghar MERN application was tested by running the React client, Express backend, and MongoDB service together. The workflow was followed from frontend actions through the centralized Fetch API client, Express routes and controllers, Mongoose queries and MongoDB documents, and finally back to React state and UI rendering. Network requests were inspected during catalogue loading, search, book details, and authentication to verify the complete client-server data flow.",
    result: "",
    conclusion: ""
  },
  10: {
    procedure: "The Kitab Ghar production configuration was first reviewed to verify the Vite build process, Vercel SPA rewrite configuration, and MongoDB Atlas connection settings. The frontend was then compiled into optimized production assets and deployed using the Vercel CLI. After deployment, the custom domain and client-side routes were tested directly from the production environment. MongoDB Atlas connectivity was also verified through the configured Mongoose connection so that the deployed application could access persistent Kitab Ghar data.",
    result: "",
    conclusion: ""
  }
};

export function buildHtmlManual(exp, targetDir = "manuals") {
  const relPrefix = targetDir === "manuals" ? "../" : "../../";
  const narrative = experimentNarrative[exp.number];

  const codeBlocksHtml = exp.codeBlocks.map((cb, idx) => `
    <div class="code-block">
      <p class="code-label"><strong>Code Block ${exp.number}.${idx + 1}: ${esc(cb.title)}</strong></p>
      <p class="code-meta">File: <code>${esc(cb.file)}</code> (Lines ${cb.lines}) — ${esc(cb.purpose)}</p>
      <pre><code>${esc(cb.code.trim())}</code></pre>
    </div>
  `).join("\n");

  const figuresHtml = exp.figures.map((fig) => {
    const cleanRel = fig.imagePath.replace(/^(\.\.\/)+/, "");
    const imgPath = relPrefix + cleanRel;
    const figLinkHtml = fig.link
      ? `<p class="fig-link"><strong>Production link:</strong> <a href="${esc(fig.link)}">${esc(fig.link)}</a></p>`
      : "";
    return `
    <div class="figure-block">
      <div class="fig-img-wrap">
        <img src="${esc(imgPath)}" alt="${esc(fig.title)}">
      </div>
      <p class="fig-title"><strong>${esc(fig.label)}: ${esc(fig.title)}</strong></p>
      <p class="fig-desc">${esc(fig.explanation)}</p>
      ${figLinkHtml}
    </div>
  `;}).join("\n");

  const toolsHtml = exp.tools.map((t) => `<li>${esc(t)}</li>`).join("");
  const functionsHtml = exp.functions.map((f) => `<li>${esc(f)}</li>`).join("");
  const procedureHtml = exp.procedure.map((p) => {
    const clean = p.replace(/^\d+[\.\)]\s*/, "");
    return `<li>${esc(clean)}</li>`;
  }).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Experiment No. ${exp.number} — Kitab Ghar</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 18mm 16mm 18mm 16mm;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      color: #000000;
      background: #ffffff;
      font-family: "Times New Roman", Times, Georgia, serif;
      font-size: 12pt;
      line-height: 1.4;
      text-align: left;
    }
    .exp-no {
      font-size: 13pt;
      font-weight: bold;
      color: #000000;
      margin: 0 0 3pt;
      text-align: left;
      page-break-after: avoid !important;
      break-after: avoid !important;
    }
    .exp-title {
      font-size: 11.5pt;
      font-weight: bold;
      color: #000000;
      margin: 0 0 8pt;
      line-height: 1.3;
      text-align: left;
      page-break-after: avoid !important;
      break-after: avoid !important;
    }
    .section-head {
      font-size: 11pt;
      font-weight: bold;
      color: #000000;
      margin: 8pt 0 2pt;
      text-align: left;
      page-break-after: avoid !important;
      break-after: avoid !important;
    }
    p {
      margin: 0 0 4pt;
      color: #000000;
      text-align: left;
    }
    ul, ol {
      margin: 0 0 6pt 18pt;
      padding: 0;
    }
    li {
      margin-bottom: 2pt;
      color: #000000;
      text-align: left;
    }
    .methodology-flow {
      border: 1px solid #000000;
      padding: 5pt 8pt;
      margin: 4pt 0 6pt;
      font-size: 9.5pt;
      font-weight: bold;
      text-align: center;
      background: #fafafa;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .code-block {
      margin: 4pt 0 6pt;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .code-label {
      font-size: 9.5pt;
      font-weight: bold;
      margin: 0 0 1.5pt;
      page-break-after: avoid !important;
      break-after: avoid !important;
    }
    .code-meta {
      font-size: 8.5pt;
      font-style: italic;
      margin: 0 0 2pt;
      page-break-after: avoid !important;
      break-after: avoid !important;
    }
    pre {
      margin: 2pt 0 4pt;
      padding: 4pt 6pt;
      border: 1px solid #000000;
      background: #fafafa;
      color: #000000;
      font-family: "Courier New", Courier, monospace;
      font-size: 7.5pt;
      line-height: 1.2;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }
    .figure-block {
      margin: 5pt 0 6pt;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .fig-img-wrap {
      text-align: center;
      margin: 2pt 0 2pt;
    }
    .fig-img-wrap img {
      max-width: 92%;
      max-height: 82mm;
      width: auto;
      height: auto;
      border: 1px solid #000000;
      display: block;
      margin: 0 auto;
      object-fit: contain;
    }
    .fig-title {
      font-size: 10pt;
      font-weight: bold;
      color: #000000;
      margin: 3pt 0 2pt;
      text-align: center;
      page-break-before: avoid !important;
      break-before: avoid !important;
      page-break-after: avoid !important;
      break-after: avoid !important;
    }
    .fig-desc {
      font-size: 12pt;
      color: #000000;
      line-height: 1.3;
      margin: 1pt 0 3pt;
      text-align: left;
    }
    .fig-link {
      font-size: 12pt;
      color: #000000;
      margin: 1pt 0 3pt;
      overflow-wrap: anywhere;
    }
    .fig-link a {
      color: #000000;
      text-decoration: underline;
    }
    .result-conclusion-block {
      page-break-inside: avoid;
      break-inside: avoid;
      margin-top: 4pt;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8pt;
      margin: 3pt 0 4pt;
      page-break-inside: auto;
      break-inside: auto;
    }
    tr {
      page-break-inside: avoid;
      break-inside: avoid;
    }
    th, td {
      border: 1px solid #000000;
      padding: 2.5pt 4pt;
      text-align: left;
      vertical-align: top;
      color: #000000;
      line-height: 1.22;
    }
    th {
      background: #f0f0f0;
      font-weight: bold;
    }
  </style>
</head>
<body>

  <!-- Starts immediately on Page 1 -->
  <div class="exp-no">Experiment No. ${exp.number}</div>
  <div class="exp-title">Title: ${esc(exp.title)}</div>

  <div class="section-head">Aim:</div>
  <p>${esc(exp.aim)}</p>

  <div class="section-head">Tools Used:</div>
  <ul>${toolsHtml}</ul>

  <div class="section-head">Methodology:</div>
  <div class="methodology-flow">${esc(exp.methodologyFlow)}</div>
  <p>${esc(exp.methodologyText)}</p>

  <div class="section-head">Theory:</div>
  ${exp.theoryParagraphs.map((p) => `<p>${esc(p)}</p>`).join("\n")}

  <div class="section-head">Case Study Context:</div>
  <p>${esc(exp.caseStudy)}</p>
  ${exp.scopeNote ? `<p>${esc(exp.scopeNote)}</p>` : ""}

  <div class="section-head">Functions / Methods / Technologies Used:</div>
  <ul>${functionsHtml}</ul>

  <div class="section-head">Procedure:</div>
  <p>${esc(narrative.procedure)}</p>
  <ol>${procedureHtml}</ol>

  <div class="section-head">Code:</div>
  ${codeBlocksHtml}

  <div class="section-head">Output:</div>
  ${figuresHtml}

  <div class="result-conclusion-block">
    <div class="section-head">Result:</div>
    <p>${esc(exp.result)}</p>
    ${narrative.result ? `<p>${esc(narrative.result)}</p>` : ""}

    <div class="section-head">Conclusion:</div>
    ${exp.conclusionParagraphs.map((p) => `<p>${esc(p)}</p>`).join("\n")}
    ${narrative.conclusion ? `<p>${esc(narrative.conclusion)}</p>` : ""}
  </div>

</body>
</html>`;
}
