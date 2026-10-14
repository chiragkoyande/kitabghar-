import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL(".", import.meta.url).pathname);
const output = path.join(root, "generated");
fs.mkdirSync(output, { recursive: true });

const esc = (value) => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");
const list = (items) => `<ul>${items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`;
const code = (value) => `<pre><code>${esc(value)}</code></pre>`;

const commonFigures = (items) => items.map((item, index) => ({ number: index + 1, ...item }));

const experiments = [
  {
    number: 1,
    title: "Design a Responsive Registration Form using Bootstrap and Perform Client-Side Validation using JavaScript",
    aim: "To design a responsive Kitab Ghar membership registration form using Bootstrap and validate the entered data on the client side using JavaScript.",
    methodology: "The standalone Experiment 1 module was developed first with semantic HTML5 form controls, Bootstrap's responsive grid and validation classes, then enhanced with custom Kitab Ghar styling. JavaScript event listeners validate each field as the user types, on blur, and on form submission. The form deliberately remains standalone so the practical can be demonstrated independently from the MERN backend.",
    theory: "Client-side validation checks user input before it is submitted. HTML constraints such as required, minlength, pattern and type=email provide the first validation layer. JavaScript adds business rules that HTML cannot express directly, such as a 13-year minimum age, Indian mobile-number format, password strength and matching confirmation. Bootstrap classes is-valid and is-invalid provide immediate visual feedback. In the Kitab Ghar case study, the form collects a Badlapur reader's profile, address, membership plan and favourite category.",
    functions: ["Bootstrap responsive grid, form-control, form-select, modal and validation classes", "addEventListener for blur, input, change and submit events", "checkValidity(), classList.add() and classList.remove()", "Regular expressions for mobile, pincode and password checks", "Date calculations for minimum and maximum registration age", "DOM updates for password meter, alerts and confirmation summary"],
    procedure: ["Open a terminal in experiments/exp1 and start a static server using python3 -m http.server 4173.", "Open http://localhost:4173 in a browser and inspect the responsive registration layout.", "Enter an invalid email, mobile number, pincode and password to observe field-level errors.", "Enter a date of birth for a user below 13 years and verify the age rule.", "Leave required fields empty and submit the form to observe Bootstrap invalid states.", "Enter a strong password and matching confirmation; observe the password meter and valid states.", "Select Badlapur, a membership plan and a book category, then accept the prototype terms.", "Submit valid data and verify the Bootstrap confirmation modal and summary text.", "Resize the browser to approximately 320 px width and verify that the form remains usable."],
    code: `const strongEnough = value.length >= 8 && /[a-z]/.test(value) && /[A-Z]/.test(value) && /\\d/.test(value);\n\nform.addEventListener("submit", (event) => {\n  event.preventDefault();\n  const allValid = [...form.querySelectorAll("input, select, textarea")]\n    .map(validateField).every(Boolean) && form.checkValidity();\n  form.classList.add("was-validated");\n  if (!allValid) return showError("Please review the highlighted fields.");\n  registrationModal.show();\n});`,
    files: ["experiments/exp1/index.html", "experiments/exp1/styles.css", "experiments/exp1/script.js"],
    figures: commonFigures([
      { title: "Desktop registration form", detail: "Capture the complete form at desktop width showing the Kitab Ghar branding, Bootstrap grid and all form sections.", action: "Open experiments/exp1 at 1440 px width." },
      { title: "Responsive mobile form", detail: "Capture the same form at approximately 320–375 px and show the stacked responsive layout.", action: "Use browser responsive mode at 320 px." },
      { title: "Required-field validation", detail: "This screenshot proves that empty mandatory fields are highlighted before submission.", action: "Submit the empty form." },
      { title: "Email and mobile validation", detail: "This screenshot depicts regular-expression validation for an invalid email and Indian mobile number.", action: "Enter invalid values and blur the fields." },
      { title: "Age and pincode validation", detail: "This screenshot shows the six-digit pincode rule and 13-year minimum age rule.", action: "Enter an invalid date and pincode." },
      { title: "Password strength and confirmation", detail: "This screenshot explains the password meter and mismatch message.", action: "Enter a weak password and different confirmation." },
      { title: "Valid Bootstrap state", detail: "This screenshot shows all required controls with valid styling before final submission.", action: "Complete the form with valid test data." },
      { title: "Confirmation modal", detail: "This screenshot proves that successful validation opens the prototype registration confirmation modal.", action: "Submit the completed form." },
    ]),
    result: "A responsive Kitab Ghar registration form was created successfully. The form adapts to desktop and mobile widths. Bootstrap validation states clearly communicate errors and successful input. JavaScript validates age, contact details, password strength, password confirmation and terms acceptance. The form prevents invalid submission and focuses the first invalid field. A valid submission opens a confirmation modal containing the selected reader details. The implementation demonstrates the required HTML5, CSS3, Bootstrap and JavaScript concepts in one consistent local-business case study.",
  },
  {
    number: 2,
    title: "Develop JavaScript Programs using ES6 Features, Arrays, Events and Popup Boxes",
    aim: "To implement an interactive Kitab Ghar book catalogue using ES6 JavaScript, array methods, DOM events and popup boxes.",
    methodology: "A catalogue array is treated as the single source for the standalone practical. Anonymous event handlers respond to search, filter and sort controls. Arrow functions and array methods derive the visible list without reloading the page. The selected book is displayed in a Bootstrap modal and the rental confirmation is handled as a popup interaction.",
    theory: "ECMAScript 6 introduced concise syntax and collection operations that make browser programs easier to maintain. const and let define block-scoped variables; arrow functions reduce callback syntax; template literals create HTML strings; map transforms data into cards; filter selects matching books; find locates a selected record; and sort orders the catalogue. In Kitab Ghar, these features model a real browsing experience while keeping the practical independent from the backend.",
    functions: ["Arrow functions and anonymous functions", "map(), filter(), find(), sort() and some()", "addEventListener and event delegation", "Template literals for catalogue cards", "String includes() for title, author and category search", "Bootstrap modal and window.confirm popup behaviour"],
    procedure: ["Open experiments/exp2 and start python3 -m http.server 4174.", "Open the catalogue page and verify that the books array renders as cards.", "Type a title, author or category into the search field and observe live filtering.", "Choose a category filter and verify that only matching books remain.", "Change the availability filter and sort mode.", "Select a book card to open its details popup.", "Attempt to rent an available and unavailable book and compare the popup messages.", "Use the slash keyboard shortcut to focus the search field.", "Capture the no-results state and clear the search to restore the catalogue."],
    code: `const visibleBooks = books\n  .filter((book) => book.title.toLowerCase().includes(query.toLowerCase()))\n  .filter((book) => !category || book.category === category)\n  .sort((a, b) => sortMode === "az" ? a.title.localeCompare(b.title) : b.popularity - a.popularity);\n\nbookGrid.innerHTML = visibleBooks.map((book) =>\n  \`<button class="book-card" data-book-id="\${book.id}">\${book.title}</button>\`\n).join("");`,
    files: ["experiments/exp2/index.html", "experiments/exp2/styles.css", "experiments/exp2/script.js"],
    figures: commonFigures([
      { title: "Catalogue loaded from the books array", detail: "Shows the initial cards rendered from the JavaScript array.", action: "Open the standalone catalogue." },
      { title: "Search interaction", detail: "Shows title, author or category search reducing the visible cards.", action: "Search for Atomic Habits or another catalogue title." },
      { title: "Category filter", detail: "Shows the category event and filtered result set.", action: "Choose Technology, Fiction or Mystery." },
      { title: "Availability filter", detail: "Shows available and unavailable rental states.", action: "Switch the availability control." },
      { title: "Sort controls", detail: "Shows A–Z, recent and popular sorting.", action: "Change the sort selection." },
      { title: "Book details popup", detail: "Shows the selected book detail modal created with DOM data.", action: "Select a catalogue card." },
      { title: "Rental confirmation popup", detail: "Shows the availability-aware confirmation interaction.", action: "Click the rental action." },
      { title: "No-results and clear state", detail: "Shows the user-friendly no-results message and recovery control.", action: "Search for xyz, then clear the query." },
    ]),
    result: "The standalone ES6 catalogue was implemented successfully. The same Kitab Ghar book domain demonstrates arrays, arrow functions, anonymous functions, events, DOM manipulation and popup boxes. Search and filters update without a page refresh. Sorting provides multiple catalogue views and the details popup presents selected records. Availability-aware rental feedback demonstrates conditional logic. The practical therefore connects the required ES6 syntax with a realistic neighbourhood book-rental use case.",
  },
  {
    number: 3,
    title: "Create a React Application using Functional Components, JSX, Props and State",
    aim: "To build the Kitab Ghar catalogue interface in React using functional components, JSX, props and state.",
    methodology: "The interface is decomposed into small functional components. Book and membership data are passed through props, while interactive values such as search text, selected category, selected book and selected plan are stored with useState. JSX combines data and markup, and conditional rendering handles availability and empty states.",
    theory: "React is a component-based library for building user interfaces. A functional component is a JavaScript function that returns JSX. Props provide one-way data flow from a parent to a child, while state stores values that change during interaction and triggers a re-render. The Kitab Ghar catalogue is a suitable case study because cards, filters and membership plans repeat the same UI pattern with different data.",
    functions: ["Functional React components", "JSX expressions and conditional rendering", "Props for BookCard, MembershipCard and filters", "useState for search, category and selection", "Derived arrays using filter and map", "Event handlers for controlled inputs and buttons"],
    procedure: ["Open experiments/exp3 and install dependencies with npm install.", "Run npm run dev and open the local React URL.", "Inspect the App component and identify Navbar, Hero, BookList, BookCard and Footer.", "Verify that the books array is passed to BookList through props.", "Type in the search field and observe the state-driven card update.", "Select a category and verify the filtered list.", "Select a book to demonstrate selected-book state and conditional detail output.", "Choose a membership plan and observe the selected prop on MembershipCard.", "Capture the empty state after entering a query with no matching book."],
    code: `function BookCard({ book, onSelect }) {\n  return (\n    <article onClick={() => onSelect(book)}>\n      <h2>{book.title}</h2>\n      <p>{book.author}</p>\n    </article>\n  );\n}\n\nconst [query, setQuery] = useState("");\nconst visibleBooks = books.filter((book) =>\n  book.title.toLowerCase().includes(query.toLowerCase())\n);`,
    files: ["experiments/exp3/src/App.jsx", "experiments/exp3/src/styles.css", "experiments/exp3/src/main.jsx"],
    figures: commonFigures([
      { title: "React application initial render", detail: "Shows the React component tree rendered in the browser.", action: "Open the Exp 3 development server." },
      { title: "JSX hero and navigation", detail: "Shows JSX-generated navigation and hero content.", action: "Capture the top of the page." },
      { title: "BookList and BookCard props", detail: "Shows repeated book cards rendered from props.", action: "Scroll to the catalogue." },
      { title: "Controlled search state", detail: "Shows the search input and filtered cards after typing.", action: "Search for a book." },
      { title: "Category filter state", detail: "Shows category selection updating derived state.", action: "Choose a category." },
      { title: "Selected book state", detail: "Shows a selected book detail or active card state.", action: "Select a card." },
      { title: "MembershipCard props and selected plan", detail: "Shows plans rendered from reusable props.", action: "Select Standard or Premium." },
      { title: "React empty state", detail: "Shows conditional rendering when no catalogue item matches.", action: "Search for a non-existent title." },
    ]),
    result: "A functional React catalogue was created successfully. JSX is used to express the Kitab Ghar interface declaratively. Reusable components keep the catalogue and membership sections consistent. Props carry book and plan data into child components. State controls search, filtering and selection without direct DOM manipulation. Conditional rendering provides availability and empty states. This experiment establishes the component foundation used by the later SPA and MERN application.",
  },
  {
    number: 4,
    title: "Develop a Single Page Application using React Router, Hooks and Component Lifecycle Methods",
    aim: "To implement a routed Kitab Ghar single-page application using React Router, hooks, context and lifecycle behaviour.",
    methodology: "The React application is placed inside BrowserRouter. Route definitions map URLs to page components, while Link and NavLink provide client-side navigation. Hooks load data and preserve authentication state. ProtectedRoute checks the AuthContext before rendering customer pages, and dynamic parameters load a selected book.",
    theory: "A single-page application changes views without requesting a complete new HTML document. React Router maps URL paths to components and useParams reads dynamic segments such as /books/:id. useEffect performs side effects such as data loading and cleanup. useContext shares authentication state across the tree. These concepts model the Kitab Ghar customer journey from public catalogue to protected dashboard.",
    functions: ["BrowserRouter, Routes, Route and Navigate", "Link and NavLink for client-side navigation", "useState and useEffect", "useMemo for derived filtered data", "useContext through AuthContext", "useParams, useLocation and useNavigate", "Protected customer routes and not-found route"],
    procedure: ["Open experiments/exp4 and install dependencies.", "Run npm run dev and visit the root route.", "Navigate between Home, Books, Membership and How It Works without a full reload.", "Open a book card and verify the dynamic /books/:id route.", "Refresh a dynamic route and verify the SPA fallback configuration.", "Open Login and Register routes and inspect controlled form state.", "Attempt to open /dashboard while logged out and verify Navigate redirects to login.", "Log in with the experiment demo state and open the protected dashboard.", "Capture the browser URL and visible page for each route."],
    code: `<Routes>\n  <Route path="/" element={<HomePage />} />\n  <Route path="/books/:id" element={<BookDetailsPage />} />\n  <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />\n</Routes>\n\nconst { id } = useParams();\nuseEffect(() => { loadBook("/books/" + id); }, [id]);`,
    files: ["experiments/exp4/src/App.jsx", "experiments/exp4/src/main.jsx", "experiments/exp4/src/styles.css"],
    figures: commonFigures([
      { title: "SPA home route", detail: "Shows the home component loaded at / without a full page reload.", action: "Open the root route." },
      { title: "Catalogue route", detail: "Shows navigation to /books using React Router.", action: "Click Browse Books." },
      { title: "Dynamic book route", detail: "Shows /books/:id rendering a selected record.", action: "Open a book detail." },
      { title: "Membership route", detail: "Shows the membership page rendered through a route.", action: "Open Membership." },
      { title: "Authentication route", detail: "Shows the login form and auth state entry point.", action: "Open /login." },
      { title: "Protected redirect", detail: "Shows an unauthenticated user redirected away from /dashboard.", action: "Open /dashboard while logged out." },
      { title: "Protected dashboard", detail: "Shows the customer dashboard after authentication state is present.", action: "Log in and open dashboard." },
      { title: "Not-found route", detail: "Shows the fallback page for an unknown URL.", action: "Open an invalid route." },
    ]),
    result: "The Kitab Ghar SPA was implemented with React Router and hooks. Public pages and protected customer pages are mapped to separate routes. Dynamic book identifiers load the correct details component. AuthContext shares session state without prop drilling. useEffect demonstrates lifecycle-style loading and cleanup. Client-side navigation preserves the SPA experience and the protected redirect prevents unauthenticated access. The experiment therefore satisfies the routing, hooks and lifecycle requirements.",
  },
  {
    number: 5,
    title: "Install and Configure MongoDB, Create Collections, Documents and Perform CRUD Operations",
    aim: "To configure the Kitab Ghar MongoDB database, create collections and demonstrate create, read, update and delete operations.",
    methodology: "MongoDB Community Server runs in a persistent Podman container. The practical uses mongosh scripts so every operation is reproducible. JSON Schema validators document the expected structure, seed records model the Kitab Ghar business and scoped CRUD commands prevent unrelated data from being removed.",
    theory: "MongoDB is a document database that stores JSON-like BSON documents inside collections. A database is selected with use, a collection is created when a document is inserted, and queries use expressive operators. CRUD means create, read, update and delete. The Kitab Ghar schema separates users, books, categories, subscriptions, rentals and payments so references can represent the rental business while retaining MongoDB's document flexibility.",
    functions: ["Podman volume persistence and container execution", "mongosh use, show collections and countDocuments", "insertOne and insertMany", "find, findOne and projection", "updateOne with $set and $inc", "deleteOne with a scoped experiment marker", "JSON Schema collection validators"],
    procedure: ["Start the kitabghar-mongodb Podman container and verify port 27017.", "Run mongodb/setup.mongodb.js inside the container.", "Select the kitabghar database and list its collections.", "Read the inserted categories, books, users and membership documents.", "Insert a temporary CRUD book document with an experiment marker.", "Read the temporary document using findOne.", "Update its availableCopies and status using updateOne, $set and $inc.", "Delete only the temporary document using its marker.", "Run verify.mongodb.js and record collection counts and active rental output."],
    code: `use kitabghar\n\ndb.books.insertOne({\n  title: "Kitab Ghar CRUD Demonstration",\n  author: "Web Lab",\n  category: "Technology",\n  totalCopies: 1,\n  availableCopies: 1,\n  experimentMarker: "exp5"\n})\n\ndb.books.updateOne(\n  { experimentMarker: "exp5" },\n  { $set: { status: "archived" }, $inc: { availableCopies: -1 } }\n)\n\ndb.books.deleteOne({ experimentMarker: "exp5" })`,
    files: ["experiments/exp5/mongodb/setup.mongodb.js", "experiments/exp5/mongodb/crud-examples.mongodb.js", "experiments/exp5/mongodb/verify.mongodb.js"],
    figures: commonFigures([
      { title: "Podman MongoDB container", detail: "Shows the running persistent MongoDB container and exposed port.", action: "Capture podman ps output." },
      { title: "Database selected", detail: "Shows mongosh using the kitabghar database.", action: "Run use kitabghar and show collections." },
      { title: "Collections created", detail: "Shows users, books, categories, subscriptions, rentals and payments collections.", action: "Run show collections." },
      { title: "Book documents read", detail: "Shows realistic Kitab Ghar book documents returned by find.", action: "Run db.books.find().limit(5).pretty()." },
      { title: "Create operation", detail: "Shows the inserted temporary CRUD document and generated ObjectId.", action: "Run the insertOne command." },
      { title: "Update operation", detail: "Shows changed availability and archived status.", action: "Run updateOne and findOne." },
      { title: "Delete operation", detail: "Shows the scoped temporary record removed successfully.", action: "Run deleteOne and verify deletedCount." },
      { title: "Verification counts", detail: "Shows final collection counts and active business records.", action: "Run verify.mongodb.js." },
    ]),
    result: "The kitabghar MongoDB database was configured successfully. The Podman volume keeps the database persistent between container restarts. Required collections and realistic documents represent the complete rental domain. Insert, read, update and delete operations were demonstrated with mongosh. JSON Schema validation documents expected fields and data types. The temporary CRUD document was deleted with a scoped marker, protecting unrelated records. This experiment provides the database foundation for the Express and MERN phases.",
  },
  {
    number: 6,
    title: "Develop a Node.js Application using Express.js and Mongoose to Connect with MongoDB",
    aim: "To build the Kitab Ghar backend using Node.js, Express.js, Mongoose and MongoDB with routes, controllers, middleware and error handling.",
    methodology: "The backend is separated into configuration, models, controllers, routes, middleware and utilities. Mongoose schemas describe the database documents. Express routes delegate work to controllers, async errors are forwarded to centralized middleware, and authentication middleware protects customer and admin operations. Environment variables keep database credentials and JWT secrets outside source code.",
    theory: "Node.js executes JavaScript on the server. Express.js provides routing and HTTP middleware, while Mongoose maps JavaScript models to MongoDB collections and performs schema validation. A layered architecture improves maintainability: routes describe endpoints, controllers implement use cases, models represent data and middleware handles cross-cutting concerns. The Kitab Ghar backend applies this architecture to registration, catalogue and rental workflows.",
    functions: ["Express app.use and router methods", "Mongoose Schema and model operations", "asyncHandler for rejected promises", "Helmet, CORS, rate limiting and Morgan", "JWT creation and auth middleware", "bcrypt password hashing", "Centralized errorHandler"],
    procedure: ["Start MongoDB and copy server/.env.example to server/.env.", "Set MONGO_URI, JWT_SECRET, CLIENT_ORIGIN and PORT.", "Install backend packages with npm install.", "Run npm run seed to insert plans, categories and catalogue records.", "Start the server with npm run dev.", "Open /api/health and verify the JSON health response.", "Register a customer and verify that the password is stored as a hash.", "Log in and use the returned JWT on /api/auth/me.", "Request the books endpoint and inspect Mongoose documents and centralized errors."],
    code: `import express from "express";\nimport helmet from "helmet";\nimport { connectDatabase } from "./config/db.js";\nimport bookRoutes from "./routes/bookRoutes.js";\n\nawait connectDatabase();\nconst app = express();\napp.use(helmet());\napp.use(express.json());\napp.use("/api/books", bookRoutes);\napp.use(errorHandler);\napp.listen(process.env.PORT || 5000);`,
    files: ["server/server.js", "server/config/db.js", "server/models/Book.js", "server/routes/bookRoutes.js", "server/controllers/bookController.js", "server/middleware/auth.js"],
    figures: commonFigures([
      { title: "Backend folder structure", detail: "Shows config, controllers, models, routes, middleware and utilities.", action: "Capture the project tree in the editor." },
      { title: "Environment configuration", detail: "Shows safe environment variable names without exposing secret values.", action: "Capture .env.example only." },
      { title: "MongoDB connection log", detail: "Shows the server connecting to MongoDB successfully.", action: "Capture terminal output after npm run dev." },
      { title: "Health endpoint", detail: "Shows Express returning a successful /api/health response.", action: "Open the health endpoint in a browser or Postman." },
      { title: "Registration request", detail: "Shows a customer registration request and response.", action: "Use Postman or the client registration form." },
      { title: "JWT login response", detail: "Shows login returning a token without exposing a password.", action: "Run the login request." },
      { title: "Mongoose book response", detail: "Shows catalogue documents returned by an Express controller.", action: "Request GET /api/books." },
      { title: "Centralized validation error", detail: "Shows a structured error response for invalid input.", action: "Send an invalid book body." },
    ]),
    result: "The Node.js backend was developed successfully using Express.js and Mongoose. The project separates routes, controllers, models and middleware for a clear architecture. MongoDB connectivity was verified through the health route and catalogue query. JWT authentication and password hashing protect account operations. Helmet, CORS, rate limiting and centralized errors provide basic security and reliability. Environment variables prevent secrets from entering source code. The backend is ready to expose the REST API and support the React client.",
  },
  {
    number: 7,
    title: "Develop Basic Node.js Applications Demonstrating REPL, HTTP Server, File System, Buffers, Streams and Event Loop",
    aim: "To demonstrate Node.js core APIs using independent Kitab Ghar catalogue examples.",
    methodology: "Each Node.js core concept is isolated in a small executable file so its output can be observed without the production Express server. The examples use books.json as the shared case-study data. Terminal output and an HTTP request provide direct evidence of the runtime behaviour.",
    theory: "The Node.js REPL evaluates JavaScript interactively. The http module creates a basic server, fs reads and writes files, Buffer represents binary data, streams process data in chunks and the event loop schedules asynchronous callbacks. These primitives are important because Express and many Node.js libraries build on them. Kitab Ghar uses a book catalogue to make each low-level demonstration meaningful.",
    functions: ["Node REPL expressions", "http.createServer and response.end", "fs.readFileSync and fs.copyFileSync", "Buffer.from and buffer.toString", "fs.createReadStream and stream events", "setTimeout, Promise and process.nextTick"],
    procedure: ["Open experiments/exp7 and verify books.json exists.", "Run node repl-demo.js and execute a simple catalogue expression in the REPL.", "Run node http-server.js and request http://127.0.0.1:5050/api/books.", "Run node fs-demo.js and verify the copied catalogue output file.", "Run node buffer-demo.js and record byte length and decoded text.", "Run node stream-demo.js and inspect the generated stream output.", "Run node event-loop-demo.js and compare synchronous and asynchronous log order.", "Capture terminal output for each core API demonstration.", "Stop the temporary HTTP server after the request."],
    code: `import { createServer } from "node:http";\nimport books from "./books.json" with { type: "json" };\n\ncreateServer((request, response) => {\n  response.setHeader("Content-Type", "application/json");\n  response.end(JSON.stringify({ count: books.length, books }));\n}).listen(5050);`,
    files: ["experiments/exp7/repl-demo.js", "experiments/exp7/http-server.js", "experiments/exp7/fs-demo.js", "experiments/exp7/buffer-demo.js", "experiments/exp7/stream-demo.js", "experiments/exp7/event-loop-demo.js"],
    figures: commonFigures([
      { title: "Node REPL", detail: "Shows an interactive expression evaluated against the Kitab Ghar catalogue.", action: "Run the REPL demonstration." },
      { title: "HTTP server started", detail: "Shows the core http server listening on port 5050.", action: "Run http-server.js." },
      { title: "HTTP JSON response", detail: "Shows curl receiving book data from the core HTTP server.", action: "Run curl http://127.0.0.1:5050/api/books." },
      { title: "File system output", detail: "Shows catalogue-copy.json created by fs operations.", action: "Run fs-demo.js and list output." },
      { title: "Buffer output", detail: "Shows encoded bytes and decoded catalogue text.", action: "Run buffer-demo.js." },
      { title: "Stream output", detail: "Shows a catalogue processed through a readable stream.", action: "Run stream-demo.js." },
      { title: "Event loop order", detail: "Shows synchronous, nextTick, promise and timer execution order.", action: "Run event-loop-demo.js." },
      { title: "Experiment output folder", detail: "Shows generated files retained as reproducible evidence.", action: "List experiments/exp7/output." },
    ]),
    result: "The required Node.js core demonstrations were completed independently from the production backend. The REPL showed interactive evaluation, while the HTTP example returned the catalogue as JSON. File-system operations created a copy, buffers demonstrated binary representation and streams processed data incrementally. The event-loop example made asynchronous scheduling visible through log order. Separating these files keeps the academic concepts easy to reproduce and explain. The same Kitab Ghar data connects every low-level example to the project case study.",
  },
  {
    number: 8,
    title: "Build a RESTful API using Express.js and Test API Endpoints using Postman",
    aim: "To implement and test Kitab Ghar REST endpoints with successful responses, validation failures, authentication errors and missing-resource errors.",
    methodology: "The API is tested as a sequence: health check, registration, login, catalogue reads, resource creation and negative cases. The Postman collection stores baseUrl and token variables so requests are repeatable. Each response is recorded with its HTTP status, request body and expected business result.",
    theory: "REST represents resources with URLs and uses HTTP methods to express operations. GET reads, POST creates, PUT or PATCH updates and DELETE removes. Status codes communicate results consistently: 200 for successful reads, 201 for creation, 400 for invalid input, 401 for missing authentication, 403 for forbidden roles, 404 for missing resources, 409 for conflicts and 500 for unexpected failures. The Kitab Ghar API applies these rules to books, users, rentals, subscriptions and payments.",
    functions: ["Express route methods and JSON request bodies", "HTTP verbs and REST resource naming", "Mongoose validation and ObjectId checks", "JWT Authorization header", "Postman environments and test scripts", "Status-code assertions and negative testing"],
    procedure: ["Start MongoDB and the Express server on port 5000.", "Import postman/kitab-ghar-api.postman_collection.json.", "Set the baseUrl variable to http://localhost:5000/api.", "Run the health request and record status 200.", "Run registration and record status 201; keep the test account details.", "Run login and allow the collection to save the returned token.", "Run book list, book details and admin CRUD requests.", "Run invalid-body, invalid-ID, missing-resource and unauthorized requests.", "Run rental and subscription requests, recording success and conflict responses.", "Export or capture the Postman result panels for the manual."],
    code: `GET    /api/books\nGET    /api/books/:id\nPOST   /api/books\nPUT    /api/books/:id\nDELETE /api/books/:id\n\n// Example negative test body\n{ "title": "", "totalCopies": -1 }\n\n// Expected response\n{ "message": "Book validation failed" }`,
    files: ["postman/kitab-ghar-api.postman_collection.json", "server/routes/bookRoutes.js", "server/routes/rentalRoutes.js", "server/middleware/errorHandler.js"],
    figures: commonFigures([
      { title: "Postman collection imported", detail: "Shows the Kitab Ghar folders and baseUrl variable.", action: "Open the collection in Postman." },
      { title: "Health request 200", detail: "Shows the API health response and successful status.", action: "Run GET /api/health." },
      { title: "Registration 201", detail: "Shows a new customer resource being created.", action: "Run POST /api/auth/register." },
      { title: "Login token response", detail: "Shows JWT login response and saved token variable.", action: "Run POST /api/auth/login." },
      { title: "Books GET 200", detail: "Shows catalogue records returned by the REST API.", action: "Run GET /api/books." },
      { title: "Validation 400", detail: "Shows an invalid request body rejected by the API.", action: "Send missing or invalid fields." },
      { title: "Not found 404", detail: "Shows a missing book or rental resource response.", action: "Use a valid-format but unknown ID." },
      { title: "Unauthorized or forbidden response", detail: "Shows missing JWT or a customer calling an admin route.", action: "Remove the token or use a customer token." },
    ]),
    result: "The Kitab Ghar REST API was tested successfully through Postman. Resource URLs and HTTP methods follow REST conventions. The collection demonstrates successful health, registration, login and catalogue requests. Negative tests confirm that invalid bodies, invalid IDs, missing resources and unauthorized roles return meaningful status codes. Token persistence allows authenticated requests to be executed in sequence. The evidence set provides both functional proof and failure-case screenshots required for the Web Lab practical.",
  },
  {
    number: 9,
    title: "Develop a Full-Stack MERN Application by Integrating React with Express using Fetch API",
    aim: "To integrate the React client, Express backend and MongoDB database into the complete Kitab Ghar rental application.",
    methodology: "The client communicates with the backend through the shared apiRequest fetch wrapper. Server controllers read and write MongoDB through Mongoose. The user journey is tested end to end: account creation, login, catalogue browsing, simulated membership, rental, return and profile update. No production catalogue data is hardcoded in the final client flow.",
    theory: "MERN combines MongoDB, Express, React and Node.js. React presents the user interface, Node and Express expose HTTP endpoints, Mongoose maps requests to MongoDB documents and fetch connects the two application tiers. Authentication uses hashed passwords and JWTs. In Kitab Ghar, a rental changes both a rental document and a book's availableCopies, demonstrating persistence across the full stack.",
    functions: ["React Router pages and protected routes", "AuthContext and JWT persistence", "fetch through apiRequest", "Express controllers and Mongoose models", "Simulated UPI/payment flow clearly labelled as demo", "Rental creation and return transactions", "Profile and dashboard data loading"],
    procedure: ["Start the Podman MongoDB container.", "Start the server with a valid local .env and seed data.", "Start the Vite client with VITE_API_URL pointing to the API.", "Register a new Badlapur customer from the React form.", "Log in and verify that the client stores the JWT session.", "Browse and search the live book catalogue from MongoDB.", "Open a book detail and add an available title to the rental flow.", "Choose a membership plan and complete the clearly labelled simulated payment step.", "Open the dashboard and verify plan, rentals and payment history.", "Return the active rental and confirm availability is restored.", "Update the profile and refresh to verify persistence."],
    code: `export async function apiRequest(path, options = {}) {\n  const token = localStorage.getItem("kitabghar-token");\n  const headers = {\n    ...(options.body ? { "Content-Type": "application/json" } : {}),\n    ...(token ? { Authorization: "Bearer " + token } : {}),\n  };\n  const response = await fetch(API_URL + path, { ...options, headers });\n  const body = await response.json();\n  if (!response.ok) throw new Error(body.message);\n  return body;\n}`,
    files: ["client/src/services/api.js", "client/src/context/AuthContext.jsx", "client/src/pages/Pages.jsx", "server/controllers/rentalController.js", "server/models/Rental.js"],
    figures: commonFigures([
      { title: "Full-stack client home", detail: "Shows the React homepage loaded with the business UI.", action: "Open the client." },
      { title: "Registration persisted", detail: "Shows successful registration through React and Express.", action: "Submit the registration form." },
      { title: "Authenticated dashboard", detail: "Shows a logged-in customer dashboard populated from the API.", action: "Log in and open dashboard." },
      { title: "Live catalogue search", detail: "Shows books loaded from MongoDB through Express and fetch.", action: "Search the catalogue." },
      { title: "Membership/payment demo", detail: "Shows the explicitly simulated membership payment state.", action: "Start a membership." },
      { title: "Rental created", detail: "Shows the selected book in active rentals after the API request.", action: "Rent an available book." },
      { title: "Return completed", detail: "Shows a returned rental and restored availability.", action: "Return the active rental." },
      { title: "Profile persistence", detail: "Shows updated profile data after refresh.", action: "Edit and save the profile." },
    ]),
    result: "The complete Kitab Ghar MERN workflow was integrated successfully. React pages call Express endpoints through fetch and MongoDB provides persistent catalogue and account data. JWT authentication protects customer flows and role checks protect admin operations. The simulated payment state is labelled clearly rather than pretending to be a real gateway. Rentals update inventory and returns restore it. Registration, login, browsing, subscription, rental, return and profile update were connected as one continuous business application.",
  },
  {
    number: 10,
    title: "Deploy a MERN Stack Web Application on a Cloud Platform and Demonstrate End-to-End Functionality",
    aim: "To deploy the Kitab Ghar MERN application with a cloud frontend, backend and managed MongoDB database, then verify the live workflow.",
    methodology: "The deployment uses Vercel for the React client, Render for the Express API and MongoDB Atlas for persistence. Environment variables connect the three services without committing secrets. Deployment is verified first with health checks and then through the same registration, login, membership, rental and return journey used in Experiment 9.",
    theory: "Cloud deployment separates application services while allowing them to communicate over HTTPS. Vercel serves the built React assets, Render runs the Node/Express process and MongoDB Atlas hosts the database. A production frontend needs a backend API URL, the backend needs an Atlas connection string and both services require correctly configured CORS and environment variables. Deployment evidence must prove persistence, not only that a page loads.",
    functions: ["Vercel build and SPA rewrite configuration", "Render start command and health check", "MongoDB Atlas database user and network access", "VITE_API_URL, MONGO_URI, JWT_SECRET and CLIENT_ORIGIN", "HTTPS frontend-to-backend communication", "Production smoke tests and rollback-safe verification"],
    procedure: ["Create or select a MongoDB Atlas development cluster and database user.", "Configure Atlas network access for the Render service according to the selected deployment policy.", "Create the Render backend service from the repository and set its root directory to server.", "Add NODE_ENV, PORT, MONGO_URI, JWT_SECRET and CLIENT_ORIGIN as Render environment variables.", "Deploy the backend and open its /api/health URL.", "Import the repository into Vercel with client as the project root.", "Set the VITE_API_URL variable to the Render API URL and deploy the client.", "Verify React Router rewrites by opening a deep URL such as /books.", "Register, log in, browse, subscribe, rent and return a book on the deployed application.", "Refresh the browser and verify that database-backed state persists.", "Capture deployment dashboards, health responses and end-to-end screens without exposing secrets."],
    code: `# client/vercel.json\n{\n  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]\n}\n\n# Production environment variables\nVITE_API_URL=https://your-render-service.onrender.com/api\nMONGO_URI=<stored only in Render>\nJWT_SECRET=<stored only in Render>\nCLIENT_ORIGIN=https://your-vercel-project.vercel.app`,
    files: ["render.yaml", "client/vercel.json", "client/.env.production.example", "docs/deployment-checklist.md"],
    figures: commonFigures([
      { title: "MongoDB Atlas cluster", detail: "Shows the configured development cluster without exposing credentials.", action: "Capture the Atlas cluster overview with secrets hidden." },
      { title: "Render service settings", detail: "Shows the backend service, root directory and health-check configuration.", action: "Capture Render settings without secret values." },
      { title: "Production health endpoint", detail: "Shows the deployed API returning a successful health response.", action: "Open the Render /api/health URL." },
      { title: "Vercel deployment", detail: "Shows the frontend deployment status and production URL.", action: "Capture the Vercel deployment overview." },
      { title: "Deployed home page", detail: "Shows the live Kitab Ghar homepage loaded over HTTPS.", action: "Open the production frontend." },
      { title: "Production registration and login", detail: "Shows the first end-to-end authentication screens.", action: "Register and log in on the deployed site." },
      { title: "Production rental state", detail: "Shows a deployed book rental persisted through the cloud API.", action: "Rent an available book." },
      { title: "Production return and persistence", detail: "Shows the returned state after refresh, proving database persistence.", action: "Return the book, refresh and capture the result." },
    ]),
    result: "The Kitab Ghar MERN application is deployment-ready for Vercel, Render and MongoDB Atlas. The architecture keeps frontend, backend and database credentials separate. Health checks verify the API before user testing begins. The deployed workflow must be verified with registration, login, catalogue browsing, membership, rental and return operations. Refresh testing demonstrates that data is stored in Atlas rather than only in browser memory. This experiment provides the final cloud deployment evidence while keeping secrets out of source control and screenshots.",
  },
];

const css = `
@page { size: A4; margin: 22mm 18mm 20mm; }
* { box-sizing: border-box; }
body { margin: 0; color: #111; background: #fff; font-family: "Times New Roman", Times, serif; font-size: 12pt; line-height: 1.5; text-align: justify; }
.manual { max-width: 180mm; margin: 0 auto; }
.cover { min-height: 245mm; display: flex; flex-direction: column; justify-content: center; text-align: center; page-break-after: always; }
.cover h1 { margin: 8pt 0; font-size: 22pt; text-align: center; }
.cover h2 { margin: 6pt 0 30pt; font-size: 16pt; text-align: center; }
.cover .meta { margin-top: 35pt; line-height: 1.8; text-align: center; }
h1, h2, h3 { font-family: "Times New Roman", Times, serif; font-size: 14pt; font-weight: bold; text-align: left; }
h1 { margin-top: 0; padding-bottom: 5pt; border-bottom: 1px solid #222; }
h2 { margin-top: 18pt; }
h3 { margin-top: 12pt; }
p { margin: 0 0 9pt; text-align: justify; }
ul, ol { margin: 0 0 10pt 23pt; padding: 0; }
li { margin-bottom: 4pt; }
pre { margin: 8pt 0 12pt; padding: 9pt; overflow-wrap: anywhere; white-space: pre-wrap; border: 1px solid #aaa; background: #f6f6f6; font-family: "Courier New", monospace; font-size: 9pt; line-height: 1.35; text-align: left; }
.figure { margin: 14pt 0 18pt; page-break-inside: avoid; }
.figure-box { min-height: 48mm; display: flex; align-items: center; justify-content: center; border: 1px dashed #777; background: #fafafa; text-align: center; }
.figure-box strong { font-size: 12pt; }
.caption { margin-top: 5pt; font-weight: bold; text-align: center; }
.explanation { margin-top: 3pt; font-size: 11pt; }
.note { padding: 8pt; border-left: 3px solid #333; background: #f4f4f4; }
.page-break { page-break-before: always; }
.footer-note { margin-top: 20pt; padding-top: 6pt; border-top: 1px solid #999; font-size: 10pt; }
`;

function render(exp) {
  const figureHtml = exp.figures.map((figure) => `<div class="figure"><div class="figure-box"><strong>Insert actual screenshot here<br>Figure ${String(figure.number).padStart(2, "0")} — ${esc(figure.title)}</strong></div><p class="caption">Figure ${String(figure.number).padStart(2, "0")}: ${esc(figure.title)}</p><p class="explanation"><strong>Explanation:</strong> ${esc(figure.detail)} <strong>Capture instruction:</strong> ${esc(figure.action)}</p></div>`).join("");
  return `<!doctype html><html><head><meta charset="utf-8"><title>Experiment ${exp.number} — Kitab Ghar</title><style>${css}</style></head><body><main class="manual"><section class="cover"><p>Bharati Vidyapeeth College of Engineering</p><p>Department of Information Technology</p><h1>WEB LABORATORY MANUAL</h1><h2>Experiment ${exp.number}: Kitab Ghar — Badlapur</h2><p>${esc(exp.title)}</p><div class="meta"><p><strong>Class:</strong> T.E. &nbsp;&nbsp; <strong>Semester:</strong> V</p><p><strong>Student Name:</strong> ______________________________</p><p><strong>Roll No.:</strong> ______________________________</p><p><strong>Academic Year:</strong> 2026–2027</p></div></section><h1>Experiment ${exp.number} — ${esc(exp.title)}</h1><h2>Aim</h2><p>${esc(exp.aim)}</p><h2>Methodology</h2><p>${esc(exp.methodology)}</p><h2>Theory</h2><p>${esc(exp.theory)}</p><h2>Functions and Methods Used</h2>${list(exp.functions)}<h2>Software and Hardware Requirements</h2>${list(["Computer with a modern web browser", "Visual Studio Code or equivalent editor", "Node.js and npm for React/Node experiments", "MongoDB and Podman for database experiments", "Postman for REST API testing", "Kitab Ghar project source code and supplied catalogue assets"])}<h2>Procedure</h2><ol>${exp.procedure.map((step) => `<li>${esc(step)}</li>`).join("")}</ol><h2>Important Source Code</h2><p>The following representative code is taken from the experiment implementation. The complete source is retained at the paths listed below.</p>${code(exp.code)}<h3>Source Files</h3>${list(exp.files)}<h2 class="page-break">Output and Screenshot Evidence</h2><p>Each output below must be captured from the actual running implementation. Do not use artificial screenshots. Place the screenshot in the indicated evidence folder and retain the browser viewport, input data and observed result in the evidence notes.</p>${figureHtml}<h2>Result</h2><p>${esc(exp.result)}</p><h2>Conclusion</h2><p>${esc(exp.result)} The experiment is reproducible from the listed source files and commands. It contributes one traceable part of the complete Kitab Ghar Web Lab case study.</p><p class="footer-note"><strong>Formatting:</strong> Times New Roman, body 12 pt, headings 14 pt, justified paragraphs, 1.5 line spacing. Replace every figure box with the corresponding real screenshot before final submission.</p></main></body></html>`;
}

for (const experiment of experiments) {
  const filename = `experiment-${String(experiment.number).padStart(2, "0")}-kitab-ghar.html`;
  fs.writeFileSync(path.join(output, filename), render(experiment));
}

// The README is maintained separately so its links remain readable in source control.

console.log(`Generated ${experiments.length} manuals in ${output}`);
