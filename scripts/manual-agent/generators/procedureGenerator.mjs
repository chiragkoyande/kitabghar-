export function methodologyFor(experiment) {
  if (experiment.id === 1) return "Requirement Analysis → Responsive Form Design → Bootstrap and JavaScript Implementation → Browser-based Validation Tests → Evidence Capture → HTML Manual → PDF Validation";
  if (experiment.id === 2) return "Catalogue Data Review → ES6 Array and Event Implementation → Browser Interaction Tests → Screenshot Evidence Capture → HTML Manual → PDF Validation";
  if (experiment.id === 3) return "React Source Review → Functional Component and State Inspection → Vite Runtime → Browser Interaction Tests → Screenshot Evidence Capture → HTML Manual → PDF Validation";
  if (experiment.id === 4) return "Requirement Analysis → React Router SPA Architecture → Route Hierarchy & Dynamic Routing Implementation → React Hooks & Lifecycle Behaviour → Browser Interaction & Route Guard Testing → Screenshot Evidence Capture → HTML Manual → PDF Validation";
  if (experiment.id === 6) return "Requirement Analysis → Database Schema & Mongoose Model Design → Express REST API Routing & Middleware → Controller CRUD Implementation → End-to-End API and UI Testing → Screenshot Evidence Capture → HTML Manual → PDF Validation";
  if (experiment.id === 9) return "MERN Source Review → MongoDB and Express Runtime → React Vite Client → API and Browser Workflow Testing → Screenshot Evidence Capture → HTML Manual → PDF Validation";
  return ["EVIDENCE MISSING"].join(" → ");
}

export function procedureFor(experiment) {
  if (experiment.id === 9) return [
    "Inspected the current main Kitab Ghar React client, Express server, Mongoose book model, book controller, authentication context and shared API helper.",
    "Mapped the actual MongoDB, Express, React and Node.js implementation to the Experiment 9 MERN requirements.",
    "Started an isolated local Express and MongoDB-connected API on port 5003 and the current Vite React client on port 5178.",
    "Called the live health and books endpoints from the running browser to verify Express and MongoDB responses.",
    "Opened the current main home page, live 77-title catalogue, controlled search and dynamic book-details route in Chrome.",
    "Opened the membership route, authenticated a seeded reader through the real login API, and verified the protected dashboard route.",
    "Cleared the local browser token and confirmed that the current ProtectedRoute redirected an unauthenticated dashboard request to login.",
    "Tested the current MERN home page at 320 px and captured the observed responsive layout.",
    "Extracted focused snippets from the actual main client and server source files, then saved test results, figure metadata and screenshots.",
    "Generated the A4 HTML manual, rendered the PDF and validated its text, figures, page border and page numbering."
  ];
  if (experiment.id === 6) return [
    "Inspected the actual Kitab Ghar backend architecture and source code in server/ including server.js, config/db.js, models/, controllers/, middleware/, and routes/.",
    "Defined Mongoose schemas for Book, User, Plan, Category, Order, and Rental models with typed attributes, validation constraints, and text indexes.",
    "Configured the Mongoose connection manager in db.js to connect securely to the MongoDB database with strictQuery enabled.",
    "Built the Express application in server.js with security and utility middleware (Helmet, CORS, rate limiting, JSON body parsing, and centralized error handling).",
    "Implemented RESTful CRUD controller functions in bookController.js leveraging Mongoose find, text search, findById, create, findByIdAndUpdate, and soft delete.",
    "Implemented JWT-based authentication in authController.js and protect / requireRole authorization middleware in middleware/auth.js.",
    "Mounted modular REST routes for /api/health, /api/books, /api/categories, /api/plans, /api/auth, and /api/users.",
    "Started the live Express API server on port 5003 and the Vite client development server on port 5178 connected to MongoDB.",
    "Executed automated API and browser tests verifying endpoint status, Mongoose JSON payloads, text searching, and JWT token protection.",
    "Captured live screenshot evidence of both API endpoints and the connected main Kitab Ghar user interface.",
    "Extracted focused code snippets directly from the actual server source files and validated the HTML and PDF lab manual."
  ];
  if (experiment.id === 4) return [
    "Inspected the actual Kitab Ghar client and server source files including App.jsx, Layout.jsx, Pages.jsx, AuthContext.jsx, and ProtectedRoute.jsx.",
    "Reviewed the React Router v6 route hierarchy, NavLink navigation, dynamic parameter routing, and protected route guards in the running codebase.",
    "Started the actual Kitab Ghar Express API backend and Vite client development servers locally.",
    "Opened the running application in Google Chrome and verified the main homepage, Book Genie hero, and active NavLink indicators.",
    "Launched the interactive Book Genie recommendation wizard and observed the multi-step question flow and progress indicator.",
    "Navigated to the live Books catalogue at /books and verified controlled search, category pills, availability filters, and sorting.",
    "Opened a dynamic parameter route /books/:id and verified that useParams and useApiData loaded the targeted book record.",
    "Tested reader membership plans at /membership and verified protected route redirection on /dashboard.",
    "Tested mobile responsiveness at a 320 px viewport to verify the fluid single-page layout.",
    "Extracted focused code snippets directly from the actual client source files and validated the HTML and PDF practical manual."
  ];
  if (experiment.id === 3) return [
    "Inspected the current main React client entry point, App composition, BooksPage, BookCard, GenieHero, BookGenieWizard and AuthProvider source files.",
    "Mapped the prescribed functional-component, JSX, props and state requirements to those current main-client components.",
    "Started an isolated local instance of the current Express API on port 5002 and the same current Vite main client on port 5177, using the MongoDB-backed application data.",
    "Opened the actual main Kitab Ghar home page in Chrome and confirmed the current Hero and Book Genie components rendered.",
    "Tested Book Genie popup state and its first question output, then opened the current live Books page and confirmed the 77-title rendered BookCard list.",
    "Tested controlled search, availability state, A–Z sort state and the conditional no-books-found JSX branch on the live Books page.",
    "Tested the current main React layout at a 320 px viewport and confirmed that it remained within the browser width.",
    "Extracted focused React component, JSX, props and state snippets from the current main source files.",
    "Saved real screenshots, test results and figure metadata before generating and validating the HTML and PDF manual."
  ];
  if (experiment.id === 2) return [
    "Inspected the current main client Book Genie, recommendation engine, home hero, Books page, API service and supporting server configuration.",
    "Reviewed the ES6 arrow functions, arrays, map, filter, sort, some, spread syntax, anonymous event handlers and self-managed popup state in the actual main source files.",
    "Started the configured Express API and MongoDB connection, then started the actual Vite client application.",
    "Opened the running main Kitab Ghar home page in Chrome and confirmed that the current Book Genie hero and logo rendered.",
    "Opened the Book Genie popup and tested the start action, question-option event handling, changing question flow and generated recommendation results.",
    "Opened the current Books page and tested the live 77-title API catalogue, author search, availability filtering and A–Z sorting.",
    "Recorded the API-backed Book Genie and catalogue outputs exactly as they appeared in the main application.",
    "Extracted focused ES6 array, event, recommendation, popup and catalogue snippets from the current main source files.",
    "Saved real screenshots, test results and figure metadata before generating and validating the HTML and PDF manual."
  ];
  if (experiment.id !== 1) return ["EVIDENCE MISSING: no procedure was run." ];
  return [
    "Inspected the current main client RegisterPage, AuthContext, API helper and responsive stylesheet instead of the obsolete standalone registration prototype.",
    "Mapped the current registration controls, visible field-validation feedback and responsive CSS to the Experiment 1 requirements, recording only the absent Bootstrap dependency as an evidence gap.",
    "Started an isolated current Kitab Ghar Express API on port 5005 and the current Vite main client on port 5180.",
    "Opened the actual running /register route in Chrome at desktop and 320 px mobile viewports.",
    "Tested empty submission, invalid email and mobile, underage date, short pincode, weak password, mismatched confirmation, unchecked terms and a complete valid reader profile in the visible current UI.",
    "Inspected the current registration request path through AuthContext and the common API helper without creating a persistent test reader account.",
    "Verified the current desktop two-column form grid and mobile one-column form grid; recorded that only Bootstrap and a Bootstrap confirmation modal are absent, without reusing an old prototype.",
    "Extracted focused snippets directly from the current main client source files and saved real screenshots, test results and figure metadata in docs/evidence/exp1.",
    "Generated this A4 HTML manual, rendered it to PDF and checked the output for headings, figures, extracted text, page border and page numbering."
  ];
}
