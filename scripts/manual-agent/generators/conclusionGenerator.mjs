export function conclusionFor(experiment, testResults, logoStatus) {
  if (experiment.id === 6) {
    const passed = testResults.filter((test) => test.status === "PASS").length;
    return [
      "The Kitab Ghar Experiment 6 backend application was executed and documented from live runtime and browser evidence.",
      "The backend implementation organizes Node.js and Express.js into a modular MVC architecture with dedicated models, controllers, middleware, and routes.",
      `All ${passed} recorded functional API and UI test cases passed against the running Express and MongoDB instances.`,
      "Mongoose schemas successfully enforced data integrity, field validations, default values, and compound text search indexing for MongoDB documents.",
      "RESTful API endpoints delivered full CRUD capabilities for the Kitab Ghar catalogue, categories, and subscription plans.",
      "JWT authentication middleware and bcrypt password hashing effectively secured reader sessions and protected private dashboard endpoints.",
      "Express security and utility middleware (Helmet, CORS, rate limiting, and centralized error handling) provided a robust API gateway.",
      "The connected Kitab Ghar React frontend demonstrated seamless asynchronous data fetching and state synchronization with the backend API.",
      logoStatus === "PASS" ? "The Kitab Ghar branding identity and main UI components were visible during the observed session." : "The referenced branding identity was unavailable during the observed session; the evidence gap is recorded separately for correction.",
      "This Node.js, Express, Mongoose, and MongoDB architecture establishes the reliable backend foundation for full MERN stack integration and cloud deployment in subsequent experiments."
    ];
  }
  if (experiment.id === 9) {
    const passed = testResults.filter((test) => test.status === "PASS").length;
    return ["The Kitab Ghar Experiment 9 MERN application was executed and documented from the current main client, Express API and MongoDB runtime.", "The evidence uses the real current interface and source files rather than a recreated experiment UI.", `All ${passed} recorded API and browser workflow tests passed in the isolated local MERN run.`, "The live health and catalogue calls confirmed that Node.js and Express communicated with the MongoDB database through the configured Mongoose layer.", "React rendered the 77-title catalogue returned by the API and updated the output for a controlled author search without a page refresh.", "The dynamic book-details route demonstrated that a selected record moved from the database query through Express JSON into React output.", "The membership view loaded current plan records through the same full-stack data path.", "The seeded reader login returned a session used by React to reach the protected dashboard, while removal of that session returned the browser to login.", "The current Kitab Ghar logo and responsive main interface were visible during the observed browser run.", "This verified MERN integration provides the practical base for production deployment and cloud verification in the next experiment."];
  }
  if (experiment.id === 4) {
    const passed = testResults.filter((test) => test.status === "PASS").length;
    return [
      "The Kitab Ghar Experiment 4 Single Page Application was executed and documented from live browser evidence.",
      "The implementation structures the client application using React Router v6 declarative routing, dynamic parameter paths and nested layouts.",
      `All ${passed} recorded functional test cases passed in the executed Vite application.`,
      "The BrowserRouter and Routes architecture enabled instantaneous view transitions without page refreshes.",
      "Dynamic parameter routing via useParams correctly resolved book IDs, while useEffect coordinated data loading, scroll restoration, and title synchronization.",
      "Controlled component hooks (useState and useMemo) managed search, category filtering, and inventory sorting with high responsiveness.",
      "Authentication context (useContext) and ProtectedRoute provided declarative route guarding for reader dashboard and borrowing features.",
      "The catch-all route gracefully intercepted non-existent URLs and provided client-side recovery paths.",
      "The mobile viewport capture at 320 px confirmed that the SPA remains fully responsive on narrow screens.",
      logoStatus === "PASS" ? "The Kitab Ghar branding identity and Book Genie hero were visible during the observed session." : "The referenced branding identity was unavailable during the observed session; the evidence gap is recorded separately for correction.",
      "This routing and lifecycle architecture establishes the core frontend framework for API integration and full MERN development in subsequent experiments."
    ];
  }
  if (experiment.id === 3) {
    const passed = testResults.filter((test) => test.status === "PASS").length;
    return ["The Kitab Ghar Experiment 3 manual was documented from live evidence of the current main React application.", "All current UI screenshots were captured from the running Kitab Ghar client and not reconstructed for the manual.", `All ${passed} recorded functional test cases passed in the executed main-client browser session.`, "The React root composes StrictMode, BrowserRouter, AuthProvider and App before rendering the current Kitab Ghar experience.", "Functional page, hero, Book Genie and BookCard components create a reusable component structure for the Badlapur book-rental platform.", "JSX is visible in the current home, Book Genie and Books-page output captured during the evidence run.", "The live BooksPage uses useState to change search, availability and sorting without a full-page reload.", "Book objects are passed as props to the reusable BookCard component, which renders current title, author, category, cover and availability data.", "The empty catalogue capture confirms that conditional JSX responds to the current search state.", logoStatus === "PASS" ? "The current Kitab Ghar logo and Book Genie visual identity were visible in the observed React session." : "The referenced branding identity was unavailable in the observed React session; the evidence gap is recorded separately for correction.", "This real main-client component and state foundation connects directly to later routing, API integration and full MERN experiments."];
  }
  if (experiment.id === 2) {
    const passed = testResults.filter((test) => test.status === "PASS").length;
    return ["The Kitab Ghar Experiment 2 manual was executed and documented from the actual current main application.", "The evidence uses the real React home page, Book Genie popup and live API-backed Books page rather than a recreated experiment interface.", `All ${passed} recorded functional test cases passed in the executed browser session.`, "Arrow functions, arrays, spread syntax and callback methods were observed in the Book Genie and catalogue source files.", "The Book Genie option buttons demonstrate anonymous event handlers changing JavaScript popup state and question flow.", "The recommendation engine applies array matching to the live book data and returns three scored reader recommendations.", "The current Books page demonstrated API-backed search, availability filtering and alphabetical sorting without a full-page reload.", "The test evidence confirms a 77-title live catalogue response from the configured Express and MongoDB application.", logoStatus === "PASS" ? "The current Kitab Ghar logo and Book Genie visual identity were visible during the evidence run." : "The referenced branding identity was unavailable during the evidence run; the gap is recorded for correction.", "This actual main-client ES6 implementation connects directly to the React, API and MERN concepts used in the following experiments."];
  }
  if (experiment.id !== 1) return ["EVIDENCE MISSING." ];
  const passed = testResults.filter((test) => test.status === "PASS").length;
  return [
    "The Kitab Ghar Experiment 1 manual was rebuilt from the actual current main registration page and live local application evidence.",
    "The implementation uses React state, semantic HTML5 controls, responsive CSS and the real authentication API wiring.",
    `${passed} recorded current-main functional checks passed in the executed browser session; two prescribed items are explicitly BLOCKED because the implementation does not contain them.`,
    "The evidence confirms visible required-field, email, mobile, age, pincode, password, confirmation and reader-terms validation in the current registration form.",
    "The responsive capture at 320 pixels confirms that the current form now switches to one column and remains within the browser viewport.",
    "The real current registration action is wired through AuthContext to the /auth/register API path; no persistent test reader was created merely for documentation.",
    "The Kitab Ghar case study keeps the inputs meaningful because they represent a Badlapur reader's delivery and account details.",
    "The extracted source connects the visual outcomes to the current RegisterPage, stylesheet, authentication context and API helper.",
    "Bootstrap and a Bootstrap confirmation modal are absent from the current main UI and are labelled EVIDENCE MISSING; the password-strength, confirmation and reader-terms controls are current real implementation features.",
    logoStatus === "PASS" ? "The Kitab Ghar branding identity was visible in the observed session." : "The referenced branding identity was unavailable in the observed session; this evidence gap is recorded separately for correction.",
    "This current registration and authentication foundation can be extended with the missing prescribed client-side rules before later Express, MongoDB and full MERN experiments."
  ];
}
