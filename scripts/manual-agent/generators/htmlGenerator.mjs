import path from "node:path";
import { manualConfig } from "../config/manual-config.js";
import { fromRoot, readText, writeText, escapeHtml } from "../utils/files.mjs";
import { theoryFor } from "./theoryGenerator.mjs";
import { methodologyFor, procedureFor } from "./procedureGenerator.mjs";
import { codeSection } from "./codeGenerator.mjs";
import { figureSection } from "./figureGenerator.mjs";
import { conclusionFor } from "./conclusionGenerator.mjs";

const paragraphList = (items) => `<ol>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>`;
const bulletList = (items) => `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;

export async function generateHtmlManual({ experiment, snippets, figures, testReport, evidence }) {
  const template = await readText(fromRoot(manualConfig.template));
  const tests = testReport.tests;
  const logoStatus = testReport.runtimeChecks.find((item) => item.name === "Brand identity")?.status || "FAIL";
  const implementation = evidence.implemented.length ? evidence.implemented : ["EVIDENCE MISSING"];
  const missing = evidence.missing.length ? `<p class="evidence-missing"><strong>EVIDENCE MISSING:</strong> ${escapeHtml(evidence.missing.join(" "))}</p>` : "";
  const aim = experiment.id === 6
    ? "To build and test a backend RESTful application using Node.js, Express.js, Mongoose ODM and MongoDB for the Kitab Ghar library platform, and integrate it with the live client user interface."
    : experiment.id === 4
    ? "To develop an interactive Single Page Application (SPA) using React Router v6, custom Hooks and component lifecycle behaviour for the Kitab Ghar library platform."
    : experiment.id === 3
    ? "To create an interactive Kitab Ghar React application using functional components, JSX, props and state."
    : experiment.id === 2
    ? "To demonstrate ES6 JavaScript features, arrays, events and popup boxes in the actual Kitab Ghar main application."
    : experiment.id === 9
    ? "To develop and test the current Kitab Ghar full-stack MERN application using React, Express, Node.js, MongoDB and the shared Fetch API service."
    : "To inspect and test the responsive current Kitab Ghar registration form, its browser-based client-side constraints and its real registration API wiring.";
  const methods = experiment.id === 6
    ? [
        "express() application initialization and app.use() middleware pipeline composition",
        "mongoose.connect() with MONGO_URI and strictQuery mode for database connectivity",
        "mongoose.Schema() and mongoose.model() defining structured collections (Book, User, Plan, Category, Order, Rental)",
        "Mongoose query methods: find(), findById(), findOne(), create(), findByIdAndUpdate(), and aggregate()",
        "Compound text indexing (title, author, category) for full-text MongoDB search queries",
        "bcrypt.hash() and bcrypt.compare() for salt-hashed password security",
        "jwt.sign() and jwt.verify() for JSON Web Token creation and request authorization",
        "protect and requireRole middleware for role-based endpoint security",
        "express.json() body parsing, Helmet HTTP security headers, CORS origin filtering, and express-rate-limit",
        "Centralized error handling middleware with async handler wrappers and structured JSON error responses"
      ]
    : experiment.id === 4
    ? [
        "BrowserRouter, Routes and Route for declarative client-side SPA routing",
        "NavLink and Link for seamless zero-reload navigation with active link styling",
        "useParams() for dynamic route parameter extraction (/books/:id)",
        "useEffect() for component lifecycle coordination, simulated data loading and document title synchronization",
        "useState() for controlled form inputs, filter selections and feedback notifications",
        "useMemo() for derived catalogue memoization, category extraction and sorting",
        "useContext() and custom useAuth() for reader session and rental state management",
        "ProtectedRoute and Navigate for client-side route guarding",
        "useNavigate() and useLocation() for programmatic workflow redirection and return tracking"
      ]
    : experiment.id === 3
    ? ["React functional components for the current page, hero, Book Genie and book-card UI", "JSX for declarative component composition and conditional rendering", "useState() for current search, category, availability, sort and popup state", "Props for current book data and Book Genie values and callbacks", "map(), filter() and sort() for derived live catalogue output", "React Context Provider children prop for shared current authentication state"]
    : experiment.id === 2
    ? ["const and let for Book Genie and catalogue state", "Arrow functions for option construction, API results and recommendation matching", "map(), filter(), sort(), some() and spread syntax for live-book processing", "Anonymous onClick and onChange event handlers in the current React UI", "URLSearchParams for live catalogue request construction", "Self-managed Book Genie popup state and local preference storage"]
    : experiment.id === 9
    ? ["express() middleware and router mounting for the Node.js REST service", "mongoose.Schema(), mongoose.model(), find(), findById() and query filters for MongoDB documents", "React useState(), useEffect(), Context and React Router for current client views", "fetch() in apiRequest() for shared React-to-Express JSON requests", "URLSearchParams for catalogue searches and filtered API queries", "JWT Bearer token storage and ProtectedRoute for the reader session"]
    : ["React useState() for the current controlled registration form, touched fields and submission state", "Regular expressions and date comparisons for email, mobile, age, pincode, password strength and confirmation validation", "Array map() to render the current reader field labels and controls", "CSS Grid form-grid two-column layout with a 680 px single-column mobile override", "AuthContext register() for the real current /auth/register request", "Shared apiRequest() for JSON serialization, HTTP response parsing and real server error handling", "EVIDENCE MISSING: Bootstrap validation classes and Bootstrap confirmation modal are not loaded by the current main implementation"];
  const content = `
    <section class="cover"><h1>Kitab Ghar Web Lab Practical Manual</h1><h2>Experiment ${String(experiment.id).padStart(2, "0")}</h2><p>${escapeHtml(experiment.title)}</p><p class="meta">Case Study: Kitab Ghar, Badlapur</p></section>
    <main>
      <h1>Experiment Number</h1><p>Experiment ${experiment.id}</p>
      <h1>Experiment Title</h1><p>${escapeHtml(experiment.title)}</p>
      <h1>Aim</h1><p>${escapeHtml(aim)}</p>
      <h1>Case Study</h1><p>${escapeHtml(manualConfig.caseStudy)} ${experiment.id === 9 ? "In this experiment, the current MERN application carries a Badlapur reader's browser request from React to the Express API, through Mongoose to MongoDB, and back to the visible catalogue, membership and protected dashboard workflows." : experiment.id === 6 ? "In this experiment, Node.js, Express.js, Mongoose and MongoDB constitute the server-side REST API architecture for Kitab Ghar Badlapur, delivering live book catalogue retrieval, full-text search, reader authentication, subscription plans, and secure rental tracking." : experiment.id === 4 ? "In this experiment, React Router creates a multi-view Single Page Application encompassing the homepage, catalogue, dynamic book details, membership plans, reader authentication, and protected dashboard for Badlapur book readers." : experiment.id === 3 ? "In this experiment, the actual current React home page, Book Genie and API-backed Books page demonstrate reusable components, JSX, props and state in the main Kitab Ghar client." : experiment.id === 2 ? "In this experiment, the actual Book Genie and live Books page demonstrate reader discovery, popup interaction, recommendations and API-backed catalogue handling in the current main application." : "In this experiment, the current main reader-registration route gathers the Badlapur delivery and account details needed by the real authentication workflow."}</p>
      <h1>Tools Used</h1>${bulletList([...experiment.technologies, (experiment.id === 1 || experiment.id === 2 || experiment.id === 3 || experiment.id === 4 || experiment.id === 6 || experiment.id === 9) ? "Node.js Express API + Vite Client" : "Python static HTTP server", "Headless Google Chrome for browser tests and evidence capture"])}
      <h1>Methodology</h1><p class="flow">${escapeHtml(methodologyFor(experiment))}</p><p>${experiment.id === 9 ? "The current client and server source files were inspected, then an isolated MongoDB-connected Express API and the current Vite React client were executed together, exercised through API and browser workflows, and recorded before manual generation." : experiment.id === 6 ? "The server-side Node.js and Express architecture, Mongoose schemas, REST routers, authentication middleware and controllers were inspected and executed alongside the live Vite frontend, exercised in a browser and recorded before manual generation." : experiment.id === 4 ? "The React Router source files, custom hooks, context providers and dynamic route components were inspected, then the Vite SPA was served locally on port 5178, exercised across all routes in a browser and recorded before manual generation." : experiment.id === 3 ? "The actual React source files were inspected, then the Vite application was served locally, exercised in a browser and recorded before manual generation." : experiment.id === 2 ? "The actual main client and API source files were inspected, then the configured application was served locally, exercised in a browser and recorded before manual generation." : "The current main RegisterPage, responsive stylesheet, authentication context and API helper were inspected, then the real Vite application was served locally and exercised in a browser before manual generation."}</p>
      <h1>Theory</h1><p>${escapeHtml(theoryFor(experiment))}</p>
      <h1>Functions / Methods Used</h1>${bulletList(methods)}
      <h1>Procedure</h1>${paragraphList(procedureFor(experiment))}
      <h1>Code</h1>${codeSection(snippets)}
      <h1>Output</h1>${missing}${figureSection(figures, experiment.id)}
      <h1>Test Cases</h1><table><thead><tr><th>Test Case</th><th>Input</th><th>Expected</th><th>Actual</th><th>Status</th></tr></thead><tbody>${tests.map((test) => `<tr><td>${escapeHtml(test.id)}</td><td>${escapeHtml(test.input)}</td><td>${escapeHtml(test.expected)}</td><td>${escapeHtml(test.actual)}</td><td>${escapeHtml(test.status)}</td></tr>`).join("")}</tbody></table>
      <h1>Result</h1><p>${experiment.id === 9 ? "The current Kitab Ghar MERN application was executed locally across the React client, Node.js and Express API, Mongoose models and MongoDB database." : experiment.id === 6 ? "The local Kitab Ghar Node.js Express server and connected MongoDB database were executed and verified across all REST endpoints and client views." : experiment.id === 4 ? "The local Kitab Ghar React Router SPA was served and verified across all routes." : experiment.id === 3 ? "The current Kitab Ghar main client and API were run and tested in a browser." : experiment.id === 2 ? "The actual Kitab Ghar main client and API were run and tested in a browser." : "The current main Kitab Ghar registration route was run and tested in a browser."} ${tests.filter((test) => test.status === "PASS").length}/${tests.length} recorded functional checks passed. ${experiment.id === 9 ? "The health endpoint, MongoDB catalogue, React search, dynamic book route, membership plans, JWT reader session, protected route and mobile main UI were verified through the same real application." : experiment.id === 1 ? "Visible empty-form, email, mobile, age, pincode, password-strength, password-confirmation and reader-terms states, a complete valid reader form, responsive grids, and AuthContext/API registration wiring were verified. Bootstrap and a Bootstrap confirmation modal are EVIDENCE MISSING in the current main UI." : experiment.id === 6 ? "Node.js Express server initialization, MongoDB Mongoose schema models, REST CRUD operations, text indexing, JWT authentication middleware, and frontend client integration were verified." : experiment.id === 4 ? "Client-side SPA navigation, controlled search hooks, category filters, useParams dynamic routing, useEffect lifecycle synchronization, membership selection, route guards, demo login redirects, and 404 error fallbacks were observed." : experiment.id === 3 ? "The current React home page, Book Genie popup, live BookCard components, controlled search and conditional no-books-found JSX were observed." : "The current Book Genie popup, question flow, live recommendations, API-backed catalogue search, availability filtering and sorting were observed."} ${logoStatus === "PASS" ? "The Kitab Ghar branding identity was visible during the run." : "The branding identity was not available; this is documented as EVIDENCE MISSING rather than being treated as successful output."}</p>
      <h1>Conclusion</h1>${conclusionFor(experiment, tests, logoStatus).map((line) => `<p>${escapeHtml(line)}</p>`).join("")}
    </main>`;
  const output = fromRoot(manualConfig.outputHtml, `experiment-${String(experiment.id).padStart(2, "0")}.html`);
  await writeText(output, template.replace("{{TITLE}}", `Experiment ${experiment.id} — Kitab Ghar`).replace("{{CONTENT}}", content));
  return output;
}
