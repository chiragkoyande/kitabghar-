export const experiments = [
  {
    id: 1,
    title: "Design a Responsive Registration Form using Bootstrap and Perform Client-Side Validation using JavaScript",
    path: "client",
    technologies: ["React 18", "HTML5", "CSS3", "JavaScript", "Express API"],
    requirements: ["Responsive registration form", "Client-side required and email constraints", "Bootstrap layout and custom validation (EVIDENCE MISSING in current main UI)"],
    screenshotTarget: 8,
    snippets: [
      { id: "EXP1-CODE-01", file: "client/src/pages/Pages.jsx", startLine: 83, endLine: 103, name: "01-current-main-validation-rules.jsx", purpose: "The current main RegisterPage defines reader-field validation for email, mobile, age, delivery, pincode, password, confirmation and terms consent." },
      { id: "EXP1-CODE-02", file: "client/src/pages/Pages.jsx", startLine: 105, endLine: 111, name: "02-current-validation-feedback-ui.jsx", purpose: "The current form shows field-level pass/fail feedback, password strength, a testable validation summary and the real account-submission action." },
      { id: "EXP1-CODE-03", file: "client/src/styles.css", startLine: 64, endLine: 72, name: "03-current-validation-responsive-css.css", purpose: "Current main CSS styles two-column registration fields, valid and invalid states, strength feedback and reader terms consent." },
      { id: "EXP1-CODE-04", file: "client/src/styles.css", startLine: 440, endLine: 440, name: "04-current-mobile-registration-grid.css", purpose: "The current main mobile breakpoint changes the registration form grid to one column." },
      { id: "EXP1-CODE-05", file: "client/src/context/AuthContext.jsx", startLine: 17, endLine: 21, name: "05-current-registration-request.jsx", purpose: "The current authentication context sends validated registration details to the real API and saves the returned session." },
      { id: "EXP1-CODE-06", file: "client/src/services/api.js", startLine: 1, endLine: 9, name: "06-current-api-request.js", purpose: "The common API helper serializes the registration request and exposes server error messages to the registration form." }
    ]
  },
  {
    id: 2,
    title: "Develop JavaScript Programs using ES6 Features, Arrays, Events and Popup Boxes",
    path: "client",
    technologies: ["React 18", "JavaScript ES6", "Vite", "Express API", "MongoDB"],
    requirements: ["Arrow functions", "Anonymous functions", "Arrays", "Events", "Popup boxes"],
    screenshotTarget: 8,
    snippets: [
      { id: "EXP2-CODE-01", file: "client/src/components/hero/GenieHero.jsx", startLine: 5, endLine: 27, name: "01-main-book-genie-state.jsx", purpose: "The current main Book Genie loads live catalogue data, keeps popup state and renders the actual hero trigger." },
      { id: "EXP2-CODE-02", file: "client/src/components/genie/BookGenieWizard.jsx", startLine: 7, endLine: 70, name: "02-arrow-functions-arrays.jsx", purpose: "Arrow functions, arrays of question options, spread syntax, filter(), map() and JSX option events in the real wizard." },
      { id: "EXP2-CODE-03", file: "client/src/components/genie/BookGenieWizard.jsx", startLine: 78, endLine: 121, name: "03-popup-state-events.jsx", purpose: "The current main popup state, anonymous event handlers, local storage and timed recommendation transition." },
      { id: "EXP2-CODE-04", file: "client/src/components/genie/recommendationEngine.js", startLine: 80, endLine: 145, name: "04-array-recommendation-engine.js", purpose: "Current Book Genie array matching uses some(), includes(), arrays and callback functions to score live catalogue data." },
      { id: "EXP2-CODE-05", file: "client/src/pages/Pages.jsx", startLine: 17, endLine: 35, name: "05-live-catalogue-search-filter.jsx", purpose: "The current main Books page uses ES6 state, URLSearchParams, map(), filter(), sort() and input or click events." },
      { id: "EXP2-CODE-06", file: "client/src/components/hero/Hero.jsx", startLine: 1, endLine: 8, name: "06-main-home-hero.jsx", purpose: "The real main home hero composes the current Kitab Ghar visual identity and Book Genie component." }
    ]
  },
  {
    id: 3,
    title: "Create a React Application using Functional Components, JSX, Props and State",
    path: "client",
    technologies: ["React 18", "JSX", "React Router", "Vite", "Express API", "MongoDB"],
    requirements: ["Functional components", "JSX", "Props", "State"],
    screenshotTarget: 8,
    snippets: [
      { id: "EXP3-CODE-01", file: "client/src/main.jsx", startLine: 1, endLine: 8, name: "01-react-root-composition.jsx", purpose: "The current React root composes StrictMode, BrowserRouter, AuthProvider and the App functional component." },
      { id: "EXP3-CODE-02", file: "client/src/App.jsx", startLine: 1, endLine: 9, name: "02-functional-app-component.jsx", purpose: "The actual App function composes the Kitab Ghar page components using JSX." },
      { id: "EXP3-CODE-03", file: "client/src/pages/Pages.jsx", startLine: 17, endLine: 35, name: "03-live-catalogue-state.jsx", purpose: "The real BooksPage functional component keeps search, category, availability and sorting state, then maps the live book array to BookCard props." },
      { id: "EXP3-CODE-04", file: "client/src/components/BookCard.jsx", startLine: 1, endLine: 7, name: "04-book-card-prop.jsx", purpose: "The reusable current BookCard receives a book prop and renders title, author, category, image and availability through JSX." },
      { id: "EXP3-CODE-05", file: "client/src/components/hero/GenieHero.jsx", startLine: 1, endLine: 27, name: "05-book-genie-state-and-props.jsx", purpose: "The current Book Genie functional component uses state for API data and popup visibility, then passes values and callbacks as props to the wizard." },
      { id: "EXP3-CODE-06", file: "client/src/context/AuthContext.jsx", startLine: 1, endLine: 19, name: "06-auth-provider-children-prop.jsx", purpose: "The AuthProvider functional component maintains user state and supplies it to child components through JSX context." }
    ]
  },
  {
    id: 4,
    title: "Develop a Single Page Application using React Router, Hooks and Component Lifecycle Behaviour",
    path: "client",
    technologies: ["React 18", "React Router v6", "Vite", "JavaScript ES6+"],
    requirements: ["React Router (BrowserRouter, Routes, Route, NavLink, Link)", "React Hooks (useState, useEffect, useContext, useMemo, useParams, useNavigate)", "Single Page Application (SPA) architecture", "Component lifecycle behaviour (mount, update, cleanup, param change)", "Protected route guarding"],
    screenshotTarget: 8,
    snippets: [
      { id: "EXP4-CODE-01", file: "client/src/App.jsx", startLine: 1, endLine: 11, name: "01-react-router-spa-routes.jsx", purpose: "React Router declarative route hierarchy composing public routes, dynamic parameter routes, protected routes and 404 fallback." },
      { id: "EXP4-CODE-02", file: "client/src/components/Layout.jsx", startLine: 1, endLine: 8, name: "02-layout-navlink-navigation.jsx", purpose: "Site header layout using NavLink for active route styling, dynamic authentication state and Outlet for nested page rendering." },
      { id: "EXP4-CODE-03", file: "client/src/pages/Pages.jsx", startLine: 17, endLine: 35, name: "03-books-page-hooks-and-state.jsx", purpose: "BooksPage functional component using useState, URLSearchParams and custom useApiData hook for live catalogue search, filtering and sorting." },
      { id: "EXP4-CODE-04", file: "client/src/pages/Pages.jsx", startLine: 37, endLine: 37, name: "04-dynamic-params-and-navigation.jsx", purpose: "BookDetailsPage dynamic route component using useParams to extract book ID, useEffect lifecycle fetching via useApiData and useNavigate." },
      { id: "EXP4-CODE-05", file: "client/src/context/AuthContext.jsx", startLine: 1, endLine: 25, name: "05-auth-context-provider.jsx", purpose: "AuthContext provider and useAuth hook managing user session, login, register and logout state across the SPA." },
      { id: "EXP4-CODE-06", file: "client/src/components/ProtectedRoute.jsx", startLine: 1, endLine: 6, name: "06-protected-route-guard.jsx", purpose: "ProtectedRoute component guarding authenticated routes such as the reader dashboard." },
      { id: "EXP4-CODE-07", file: "client/src/pages/Pages.jsx", startLine: 53, endLine: 79, name: "07-membership-and-dashboard.jsx", purpose: "MembershipPage component managing subscription tiers and UPI payment modal state in the React SPA." }
    ]
  },
  { id: 5, title: "Configure MongoDB and Perform CRUD Operations", path: "experiments/exp5", technologies: ["MongoDB", "mongosh"], requirements: ["Database", "Collections", "Documents", "CRUD"], screenshotTarget: 8 },
  {
    id: 6,
    title: "Build a Node.js, Express.js, Mongoose and MongoDB Application",
    path: "server",
    technologies: ["Node.js (v18+)", "Express.js 4", "Mongoose 8", "MongoDB 7.0+", "JWT", "Bcrypt", "Vite", "React 18"],
    requirements: [
      "Node.js Express Server Setup & Middleware Pipeline (Helmet, CORS, JSON, Rate Limit, Error Handling)",
      "Mongoose Schema & Model Architecture (Data Types, Field Validations, Indexes, Instance Methods)",
      "MongoDB Connection Configuration with Mongoose strictQuery",
      "RESTful API CRUD Controllers (find, text search, findById, create, update, delete)",
      "JWT Authentication Middleware (protect, requireRole) and Secured Routes",
      "Connected Real Client UI Integration"
    ],
    screenshotTarget: 8,
    snippets: [
      { id: "EXP6-CODE-01", file: "server/server.js", startLine: 1, endLine: 52, name: "01-express-server-setup.js", purpose: "Express server initialization, middleware pipeline (Helmet, CORS, JSON, Morgan, Rate Limit), REST route mounting, MongoDB connection and global error handling." },
      { id: "EXP6-CODE-02", file: "server/config/db.js", startLine: 1, endLine: 8, name: "02-mongoose-db-connection.js", purpose: "Mongoose connection management and strictQuery configuration connecting to the MongoDB database." },
      { id: "EXP6-CODE-03", file: "server/models/Book.js", startLine: 1, endLine: 7, name: "03-book-mongoose-model.js", purpose: "Mongoose Schema definition for books with field validations, timestamps, and compound text index for search." },
      { id: "EXP6-CODE-04", file: "server/models/User.js", startLine: 1, endLine: 10, name: "04-user-mongoose-model.js", purpose: "Mongoose Schema definition for users with role enumeration, bcrypt password hashing, and instance comparison method." },
      { id: "EXP6-CODE-05", file: "server/controllers/bookController.js", startLine: 1, endLine: 43, name: "05-book-crud-controller.js", purpose: "REST API CRUD controller implementing Mongoose queries (find, text search, findById, create, findByIdAndUpdate)." },
      { id: "EXP6-CODE-06", file: "server/middleware/auth.js", startLine: 1, endLine: 21, name: "06-jwt-auth-middleware.js", purpose: "JWT verification middleware (protect) and role-based access control (requireRole) for securing API endpoints." },
      { id: "EXP6-CODE-07", file: "server/controllers/authController.js", startLine: 1, endLine: 23, name: "07-auth-controller-jwt.js", purpose: "Reader registration and login controller generating signed JWT tokens and validating reader credentials against MongoDB." }
    ]
  },
  { id: 7, title: "Demonstrate Node.js REPL, HTTP Server, File System, Buffers, Streams and Event Loop", path: "experiments/exp7", technologies: ["Node.js"], requirements: ["REPL", "HTTP", "File system", "Buffers", "Streams", "Event loop"], screenshotTarget: 8 },
  { id: 8, title: "Build and Test a RESTful API using Express and Postman", path: "experiments/exp8", technologies: ["Node.js", "Express", "Postman"], requirements: ["RESTful API", "Express", "Postman testing"], screenshotTarget: 8 },
  {
    id: 9,
    title: "Develop a Full MERN Application using React, Express, Node and MongoDB",
    path: "client",
    technologies: ["MongoDB 7.0+", "Express.js 4", "React 18", "Node.js (v18+)", "Mongoose 8", "Vite", "JWT", "Fetch API"],
    requirements: [
      "Three-Tier MERN Architecture Integration (MongoDB, Express, React, Node.js)",
      "Express REST API Gateway & Mongoose ODM Data Modeling",
      "React Single Page Application with React Router v6 & Custom Hooks",
      "Unified Client-to-Server Fetch API Service with JWT Authentication",
      "End-to-End Catalogue Search, Filter, Book Details, and Rental Workflows",
      "Reader Registration, Login, Protected Dashboard & UPI Subscription Management"
    ],
    screenshotTarget: 8,
    snippets: [
      { id: "EXP9-CODE-01", file: "server/server.js", startLine: 1, endLine: 52, name: "01-mern-express-server.js", purpose: "Node.js & Express REST backend entry point initializing middleware, MongoDB connection, and mounting modular API routes." },
      { id: "EXP9-CODE-02", file: "server/models/Book.js", startLine: 1, endLine: 7, name: "02-mern-mongoose-model.js", purpose: "MongoDB Mongoose Schema for the Book collection with strict typing, timestamps, and compound text search index." },
      { id: "EXP9-CODE-03", file: "server/controllers/bookController.js", startLine: 1, endLine: 21, name: "03-mern-api-controller.js", purpose: "Express REST controller querying MongoDB via Mongoose find(), text search, and findById() endpoints." },
      { id: "EXP9-CODE-04", file: "client/src/services/api.js", startLine: 1, endLine: 11, name: "04-react-api-fetch-service.js", purpose: "Unified React API service abstraction injecting JWT Bearer tokens and handling asynchronous fetch requests." },
      { id: "EXP9-CODE-05", file: "client/src/context/AuthContext.jsx", startLine: 1, endLine: 25, name: "05-react-auth-context.jsx", purpose: "Global React authentication context managing JWT tokens, user sessions, login, register, and logout state across the MERN app." },
      { id: "EXP9-CODE-06", file: "client/src/pages/Pages.jsx", startLine: 17, endLine: 35, name: "06-react-catalogue-page.jsx", purpose: "React BooksPage component querying Express /api/books with URLSearchParams, live search, and category filtering." },
      { id: "EXP9-CODE-07", file: "client/src/pages/Pages.jsx", startLine: 53, endLine: 79, name: "07-react-membership-payments.jsx", purpose: "Subscription tier management and UPI payment modal connecting to Express /api/plans and /api/payments." }
    ]
  },
  { id: 10, title: "Deploy the Kitab Ghar MERN Application to the Cloud", path: "experiments/exp10", technologies: ["Vercel", "Render", "MongoDB Atlas"], requirements: ["Cloud deployment", "End-to-end functionality"], screenshotTarget: 8 }
];

export const getExperiment = (id) => experiments.find((experiment) => experiment.id === Number(id));
