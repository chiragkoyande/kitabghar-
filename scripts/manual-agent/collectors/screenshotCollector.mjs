import path from "node:path";
import { ensureDir } from "../utils/files.mjs";

const pause = () => new Promise((resolve) => setTimeout(resolve, 120));

export async function collectScreenshots(experiment, runtime, evidenceDir) {
  if (experiment.id === 2) return collectExp2MainScreenshots(runtime, evidenceDir);
  if (experiment.id === 3) return collectExp3Screenshots(runtime, evidenceDir);
  if (experiment.id === 4) return collectExp4Screenshots(runtime, evidenceDir);
  if (experiment.id === 6) return collectExp6Screenshots(runtime, evidenceDir);
  if (experiment.id === 9) return collectExp9Screenshots(runtime, evidenceDir);
  if (experiment.id !== 1) throw new Error(`Screenshot collection has not yet been implemented for Experiment ${experiment.id}.`);
  const screenshotsDir = path.join(evidenceDir, "screenshots");
  await ensureDir(screenshotsDir);
  const { browser, url } = runtime;
  const capture = async ({ file, figure, title, purpose, demonstrates, codeRefs, width = 1280, height = 900, setup = "", scroll = 0, wait = 450 }) => {
    await browser.goto(`${url}register`); await browser.viewport(width, height); await browser.waitFor(`Boolean(document.querySelector('.registration-card') && document.querySelector('[data-field="confirmPassword"]'))`); if (setup) await browser.eval(setup); if (scroll) await browser.eval(`window.scrollTo(0, ${scroll})`); await new Promise((resolve) => setTimeout(resolve, wait));
    await browser.screenshot(path.join(screenshotsDir, file));
    return { figure, title, file: `screenshots/${file}`, purpose, what_it_demonstrates: demonstrates, code_refs: codeRefs };
  };
  const set = (key, value) => `(()=>{ const f=document.querySelector('[data-field="${key}"]'); const s=Object.getOwnPropertyDescriptor(f.constructor.prototype,'value')?.set || Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set; s.call(f,${JSON.stringify(value)}); f.dispatchEvent(new Event('input',{bubbles:true})); f.dispatchEvent(new Event('focusout',{bubbles:true})); })();`;
  const submit = `setTimeout(()=>document.querySelector('.registration-card').requestSubmit(),80);`;
  const validForm = `${set("name", "Evidence Reader")} ${set("email", "reader@example.com")} ${set("mobile", "9876543210")} ${set("dob", "1999-06-15")} ${set("address", "12 Library Lane, Badlapur")} ${set("city", "Badlapur")} ${set("pincode", "421503")} ${set("password", "StrongPass1")} ${set("confirmPassword", "StrongPass1")} (()=>{const terms=document.querySelector('[data-field="terms"]'); if (!terms.checked) terms.click(); terms.dispatchEvent(new Event('focusout',{bubbles:true}));})();`;
  const figures = [];
  figures.push(await capture({ file: "01-registration-overview.png", figure: "Figure 1.1", title: "Current Main Registration Form", purpose: "Initial desktop capture of the actual current /register route.", demonstrates: "The main React registration card shows the real reader information, account credentials, terms consent and Create account action.", codeRefs: ["EXP1-CODE-01", "EXP1-CODE-02"] }));
  figures.push(await capture({ file: "02-empty-form-errors.png", figure: "Figure 1.2", title: "Empty Form — Visible Validation Errors", purpose: "Submit the current form with no reader details.", demonstrates: "The real current UI displays the validation summary and visible field-level errors rather than leaving the output ambiguous.", codeRefs: ["EXP1-CODE-01", "EXP1-CODE-02"], setup: submit }));
  figures.push(await capture({ file: "03-email-mobile-errors.png", figure: "Figure 1.3", title: "Invalid Email and Mobile Test", purpose: "Enter an incomplete email and an invalid Indian mobile number.", demonstrates: "Current client-side rules visibly flag both contact fields and explain the expected mobile-number format.", codeRefs: ["EXP1-CODE-01", "EXP1-CODE-03"], setup: `${set("email", "reader@")} ${set("mobile", "5123456789")}` }));
  figures.push(await capture({ file: "04-age-pincode-errors.png", figure: "Figure 1.4", title: "Age and Pincode Failure Test", purpose: "Enter an underage date and short pincode.", demonstrates: "The actual current validation reports the 13-year age rule and six-digit pincode requirement.", codeRefs: ["EXP1-CODE-01", "EXP1-CODE-03"], setup: `${set("dob", "2020-06-15")} ${set("pincode", "42150")}`, scroll: 210 }));
  figures.push(await capture({ file: "05-password-confirmation-errors.png", figure: "Figure 1.5", title: "Password Strength and Confirmation Test", purpose: "Enter a weak password and mismatched confirmation.", demonstrates: "The current UI shows a Weak password-strength label and a visible password-matching error.", codeRefs: ["EXP1-CODE-01", "EXP1-CODE-02"], setup: `${set("password", "weak")} ${set("confirmPassword", "different")}`, scroll: 430 }));
  figures.push(await capture({ file: "06-terms-error.png", figure: "Figure 1.6", title: "Terms Consent Failure Test", purpose: "Complete reader details but leave the terms unchecked before submit.", demonstrates: "The current form blocks the next action and displays the reader-terms error as an actual test result.", codeRefs: ["EXP1-CODE-01", "EXP1-CODE-02"], setup: `${validForm} setTimeout(()=>{const terms=document.querySelector('[data-field="terms"]'); if (terms.checked) terms.click();},20); ${submit}`, scroll: 550, wait: 700 }));
  figures.push(await capture({ file: "07-valid-form-pass.png", figure: "Figure 1.7", title: "All Valid Reader Details — Pass State", purpose: "Fill every current validation requirement with valid reader details.", demonstrates: "The current UI shows green valid states and the All checks passed message before any account is created.", codeRefs: ["EXP1-CODE-01", "EXP1-CODE-02", "EXP1-CODE-03"], setup: `${validForm} ${submit}`, scroll: 120 }));
  figures.push(await capture({ file: "08-mobile-valid-form.png", figure: "Figure 1.8", title: "Responsive Mobile Valid Form", purpose: "Capture the current valid registration form at 320 px.", demonstrates: "The main CSS mobile breakpoint presents the current form in one column without horizontal overflow.", codeRefs: ["EXP1-CODE-04"], width: 320, height: 900, setup: `${validForm} ${submit}`, wait: 700 }));
  return figures;
}

async function collectExp2MainScreenshots(runtime, evidenceDir) {
  const screenshotsDir = path.join(evidenceDir, "screenshots");
  await ensureDir(screenshotsDir);
  const { browser, url } = runtime;
  const pause = () => new Promise((resolve) => setTimeout(resolve, 400));
  const capture = async ({ file, figure, title, purpose, demonstrates, codeRefs, page = "", setup = "", scroll = 0, wait = 500 }) => {
    await browser.goto(`${url}${page}`); await browser.viewport(1280, 900);
    await browser.waitFor(page === "books" ? `document.querySelectorAll('.book-card').length === 77` : `Boolean(document.querySelector('.home-hero') && document.querySelector('.genie-launch'))`);
    if (setup) await browser.eval(setup); if (scroll) await browser.eval(`window.scrollTo(0, ${scroll})`); await new Promise((resolve) => setTimeout(resolve, wait));
    await browser.screenshot(path.join(screenshotsDir, file));
    return { figure, title, file: `screenshots/${file}`, purpose, what_it_demonstrates: demonstrates, code_refs: codeRefs };
  };
  const start = `document.querySelector('.genie-launch').click();`;
  const begin = `${start} setTimeout(() => [...document.querySelectorAll('.genie-wizard-start button')].find((button)=>button.textContent.includes('Start')).click(),100);`;
  const mystery = `${begin} setTimeout(() => [...document.querySelectorAll('.genie-option-card')].find((button)=>button.textContent.includes('Mystery & suspense')).click(),250);`;
  const results = `${mystery} setTimeout(() => [...document.querySelectorAll('.genie-option-card')].find((button)=>button.textContent.includes('Detective')).click(),450); setTimeout(() => [...document.querySelectorAll('.genie-option-card')].find((button)=>button.textContent.includes('Fast-paced')).click(),650); setTimeout(() => [...document.querySelectorAll('.genie-option-card')].find((button)=>button.textContent.includes('Modern')).click(),850);`;
  const figures = [];
  figures.push(await capture({ file: "01-main-home.png", figure: "Figure 2.1", title: "Current Kitab Ghar Main Home Page", purpose: "Initial capture of the actual running Vite main application.", demonstrates: "The official header, current Book Genie artwork, navigation and current home hero are rendered directly by the main client.", codeRefs: ["EXP2-CODE-06", "EXP2-CODE-01"] }));
  figures.push(await capture({ file: "02-main-home-sections.png", figure: "Figure 2.2", title: "Current Main Home Content", purpose: "Capture of the genuine main application's reader-service section.", demonstrates: "The current main UI continues from the hero into the Badlapur service and collection experience, rather than a recreated experiment shell.", codeRefs: ["EXP2-CODE-06"], scroll: 810 }));
  figures.push(await capture({ file: "03-genie-popup.png", figure: "Figure 2.3", title: "Current Book Genie Popup", purpose: "Open Ask the Book Genie from the actual main home hero.", demonstrates: "The self-managed Book Genie dialog opens from the current component's popup state.", codeRefs: ["EXP2-CODE-01", "EXP2-CODE-03"], setup: start, wait: 700 }));
  figures.push(await capture({ file: "04-genie-question-one.png", figure: "Figure 2.4", title: "Book Genie Question Options", purpose: "Start a new Book Genie session.", demonstrates: "The option array is mapped into interactive category buttons in the real wizard popup.", codeRefs: ["EXP2-CODE-02", "EXP2-CODE-03"], setup: begin, wait: 900 }));
  figures.push(await capture({ file: "05-genie-mystery-flow.png", figure: "Figure 2.5", title: "Book Genie Event-Driven Question Flow", purpose: "Choose Mystery and suspense in question one.", demonstrates: "An anonymous option event changes state and selects the mystery-specific next array of choices.", codeRefs: ["EXP2-CODE-02", "EXP2-CODE-03"], setup: mystery, wait: 1100 }));
  figures.push(await capture({ file: "06-genie-recommendations.png", figure: "Figure 2.6", title: "Live Book Genie Recommendations", purpose: "Complete the mystery preference flow against the configured live catalogue.", demonstrates: "The current recommendation engine scores the live books and returns three Book Genie recommendations.", codeRefs: ["EXP2-CODE-03", "EXP2-CODE-04"], setup: results, wait: 2100 }));
  figures.push(await capture({ file: "07-main-live-catalogue.png", figure: "Figure 2.7", title: "Current API-Backed Books Page", purpose: "Open the real main Books route.", demonstrates: "The actual current page shows the 77-title API-backed catalogue and current filter interface.", codeRefs: ["EXP2-CODE-05"], page: "books", wait: 700 }));
  figures.push(await capture({ file: "08-main-book-cards.png", figure: "Figure 2.8", title: "Current Rendered Book Cards", purpose: "Capture the rendered book-card output in the actual current Books page.", demonstrates: "The current main client maps the API-backed book array into visible card components with title, author, category and availability data.", codeRefs: ["EXP2-CODE-05"], page: "books", scroll: 480, wait: 700 }));
  return figures;
}

async function collectExp2Screenshots(runtime, evidenceDir) {
  const screenshotsDir = path.join(evidenceDir, "screenshots");
  await ensureDir(screenshotsDir);
  const { browser, url } = runtime;
  const capture = async ({ file, figure, title, purpose, demonstrates, codeRefs, setup = "", scroll = 0, wait = 180 }) => {
    await browser.goto(url); await browser.waitFor(`document.querySelectorAll('.book-card').length === 77`); await browser.viewport(1280, 900);
    if (setup) await browser.eval(setup); if (scroll) await browser.eval(`window.scrollTo(0, ${scroll})`); await new Promise((resolve) => setTimeout(resolve, wait));
    await browser.screenshot(path.join(screenshotsDir, file));
    return { figure, title, file: `screenshots/${file}`, purpose, what_it_demonstrates: demonstrates, code_refs: codeRefs };
  };
  const input = (value) => `const search=document.getElementById('book-search'); search.value=${JSON.stringify(value)}; search.dispatchEvent(new Event('input',{bubbles:true}));`;
  const figures = [];
  figures.push(await capture({ file: "01-overview.png", figure: "Figure 2.1", title: "Kitab Ghar Book Genie Home Experience", purpose: "Initial render of the current Kitab Ghar visual shell for the standalone ES6 practical.", demonstrates: "The official logo, Book Genie hero, current navigation and a real CTA leading to the 77-title JavaScript catalogue.", codeRefs: ["EXP2-CODE-06", "EXP2-CODE-01"] }));
  figures.push(await capture({ file: "02-search-suggestions.png", figure: "Figure 2.2", title: "Author Search and Suggestions", purpose: "Search Murakami in the live catalogue.", demonstrates: "Input events update visible cards and render suggestion buttons from the catalogue array.", codeRefs: ["EXP2-CODE-02", "EXP2-CODE-04"], setup: input("Murakami"), scroll: 830 }));
  figures.push(await capture({ file: "03-accent-normalised-search.png", figure: "Figure 2.3", title: "Accent-Normalised Search", purpose: "Search Cardenas without an accent.", demonstrates: "The normalise function finds Aphasia by Mauro Javier Cárdenas despite the omitted accent.", codeRefs: ["EXP2-CODE-02"], setup: input("Cardenas"), scroll: 830 }));
  figures.push(await capture({ file: "04-category-filter.png", figure: "Figure 2.4", title: "Category Filter Event", purpose: "Select the Classics category.", demonstrates: "Delegated category-button click events filter the mapped cards to one category.", codeRefs: ["EXP2-CODE-02", "EXP2-CODE-04"], setup: `[...document.querySelectorAll('[data-category]')].find((button)=>button.dataset.category==='Classics').click();`, scroll: 830 }));
  figures.push(await capture({ file: "05-availability-filter.png", figure: "Figure 2.5", title: "Currently Out Availability Filter", purpose: "Choose the unavailable filter.", demonstrates: "Array filtering keeps only zero-copy records and exposes the Currently out status.", codeRefs: ["EXP2-CODE-02", "EXP2-CODE-04"], setup: `const select=document.getElementById('availability-filter'); select.value='unavailable'; select.dispatchEvent(new Event('change',{bubbles:true}));`, scroll: 830 }));
  figures.push(await capture({ file: "06-az-sort.png", figure: "Figure 2.6", title: "Alphabetical Catalogue Sorting", purpose: "Choose the A–Z sort option.", demonstrates: "The sort callback reorders the visible book array alphabetically without a page reload.", codeRefs: ["EXP2-CODE-02", "EXP2-CODE-04"], setup: `const select=document.getElementById('sort-books'); select.value='az'; select.dispatchEvent(new Event('change',{bubbles:true}));`, scroll: 830 }));
  figures.push(await capture({ file: "07-book-details-popup.png", figure: "Figure 2.7", title: "Available Book Details Popup", purpose: "Open The Wind in the Willows from the live catalogue.", demonstrates: "The self-managed popup is populated with template-literal book data and shows an enabled rental action.", codeRefs: ["EXP2-CODE-03", "EXP2-CODE-04"], setup: `document.querySelector('[data-book-id="1"]').click();`, scroll: 830, wait: 550 }));
  figures.push(await capture({ file: "08-rental-confirmed.png", figure: "Figure 2.8", title: "Session Rental State Update", purpose: "Confirm rental of The Wind in the Willows.", demonstrates: "The event handler reduces the selected book's copy count for the active browser session and re-renders its details.", codeRefs: ["EXP2-CODE-03", "EXP2-CODE-04"], setup: `document.querySelector('[data-book-id="1"]').click(); setTimeout(()=>document.querySelector('.rent-trigger').click(),350); setTimeout(()=>document.getElementById('confirm-rental').click(),700);`, scroll: 830, wait: 1500 }));
  return figures;
}

async function collectExp3Screenshots(runtime, evidenceDir) {
  const screenshotsDir = path.join(evidenceDir, "screenshots");
  await ensureDir(screenshotsDir);
  const { browser, url } = runtime;
  const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const capture = async ({ file, figure, title, purpose, demonstrates, codeRefs, setup = "", scroll = 0, width = 1280, height = 900, wait = 550, page = "" }) => {
    await browser.goto(`${url}${page}`); await browser.viewport(width, height);
    await browser.waitFor(page === "books" ? `document.querySelectorAll('.book-card').length === 77` : `Boolean(document.querySelector('.home-hero') && document.querySelector('.genie-launch'))`);
    if (setup) await browser.eval(setup); if (scroll) await browser.eval(`window.scrollTo(0, ${scroll})`); await new Promise((resolve) => setTimeout(resolve, wait));
    await browser.screenshot(path.join(screenshotsDir, file));
    return { figure, title, file: `screenshots/${file}`, purpose, what_it_demonstrates: demonstrates, code_refs: codeRefs };
  };
  const start = `document.querySelector('.genie-launch').click();`;
  const begin = `${start} setTimeout(() => [...document.querySelectorAll('.genie-wizard-start button')].find((button) => button.textContent.includes('Start')).click(),100);`;
  const search = (value) => `const input=document.querySelector('.search-control input'); const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set; setter.call(input,${JSON.stringify(value)}); input.dispatchEvent(new Event('input',{bubbles:true}));`;
  const figures = [];
  figures.push(await capture({ file: "01-main-react-home.png", figure: "Figure 3.1", title: "Current Kitab Ghar React Home Page", purpose: "Initial capture of the actual current main React application.", demonstrates: "The current Layout, HomePage, Hero and GenieHero functional components compose the official main UI through JSX.", codeRefs: ["EXP3-CODE-01", "EXP3-CODE-02"] }));
  figures.push(await capture({ file: "02-react-home-components.png", figure: "Figure 3.2", title: "Current Home Component Output", purpose: "Capture the next section of the actual main home page.", demonstrates: "The running main UI shows composed React home-section components, including the Badlapur service content.", codeRefs: ["EXP3-CODE-02"], scroll: 820 }));
  figures.push(await capture({ file: "03-book-genie-state.png", figure: "Figure 3.3", title: "Book Genie Conditional Popup", purpose: "Open Book Genie from the actual main home page.", demonstrates: "The GenieHero open state conditionally renders BookGenieWizard JSX rather than a separate legacy interface.", codeRefs: ["EXP3-CODE-05"], setup: start, wait: 750 }));
  figures.push(await capture({ file: "04-book-genie-props.png", figure: "Figure 3.4", title: "Book Genie Interactive Child Components", purpose: "Start the live Book Genie session.", demonstrates: "The current wizard receives live book data and maps question options into visible child components using props and JSX.", codeRefs: ["EXP3-CODE-05"], setup: begin, wait: 1000 }));
  figures.push(await capture({ file: "05-live-bookcard-components.png", figure: "Figure 3.5", title: "Live BookCard Component List", purpose: "Open the current API-backed Books page.", demonstrates: "The actual BooksPage maps the live catalogue into 77 reusable BookCard components with book props.", codeRefs: ["EXP3-CODE-03", "EXP3-CODE-04"], page: "books", wait: 700 }));
  figures.push(await capture({ file: "06-search-state.png", figure: "Figure 3.6", title: "Controlled React Search State", purpose: "Search for Murakami in the live Books page.", demonstrates: "The controlled input updates query state and changes the rendered BookCard output to the matching Norwegian Wood result.", codeRefs: ["EXP3-CODE-03", "EXP3-CODE-04"], page: "books", setup: search("Murakami"), wait: 900 }));
  figures.push(await capture({ file: "07-conditional-empty-state.png", figure: "Figure 3.7", title: "Conditional Empty-State JSX", purpose: "Search a title absent from the live catalogue.", demonstrates: "Current component state makes the no-books-found JSX branch visible when no BookCard props remain to render.", codeRefs: ["EXP3-CODE-03"], page: "books", setup: search("zzznobook"), wait: 900 }));
  figures.push(await capture({ file: "08-main-mobile-react.png", figure: "Figure 3.8", title: "Current React Mobile Layout", purpose: "Capture the actual current home page at a 320 px viewport.", demonstrates: "The current React component composition remains visible and within the narrow mobile viewport.", codeRefs: ["EXP3-CODE-01", "EXP3-CODE-02"], width: 320, height: 900, wait: 650 }));
  return figures;
}

async function collectExp4Screenshots(runtime, evidenceDir) {
  const screenshotsDir = path.join(evidenceDir, "screenshots");
  await ensureDir(screenshotsDir);
  const { browser, url } = runtime;
  const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const capture = async ({ file, figure, title, purpose, demonstrates, codeRefs, setup = "", scroll = 0, width = 1280, height = 900, wait = 600, path: routePath = "" }) => {
    await browser.goto(`${url}${routePath}`);
    await browser.viewport(width, height);
    await pause(450);
    if (setup) await browser.eval(setup);
    if (scroll) await browser.eval(`window.scrollTo(0, ${scroll})`);
    await pause(wait);
    await browser.screenshot(path.join(screenshotsDir, file));
    return { figure, title, file: `screenshots/${file}`, purpose, what_it_demonstrates: demonstrates, code_refs: codeRefs };
  };

  const figures = [];

  // Figure 4.1: Main Home Experience
  figures.push(await capture({
    file: "01-main-homepage.png",
    figure: "Figure 4.1",
    title: "Kitab Ghar Main Application & Book Genie Hero",
    purpose: "Initial render of the main Kitab Ghar React Router SPA homepage.",
    demonstrates: "The React Router client layout, active navigation, official branding logo, Book Genie reading guide hero and featured catalogue cards in the main application.",
    codeRefs: ["EXP4-CODE-01", "EXP4-CODE-02"],
    wait: 600
  }));

  // Figure 4.2: Book Genie Wizard Modal
  figures.push(await capture({
    file: "02-book-genie-wizard.png",
    figure: "Figure 4.2",
    title: "Interactive Book Genie Recommendation Wizard",
    purpose: "Interactive Akinator-style recommendation wizard modal.",
    demonstrates: "The interactive Book Genie recommendation wizard rendered conditionally as an interactive modal with dynamic questions, option cards and progress tracking.",
    codeRefs: ["EXP4-CODE-01", "EXP4-CODE-02"],
    setup: `document.querySelector('.genie-launch')?.click(); setTimeout(() => { const btn = [...document.querySelectorAll('.genie-wizard-start button')].find(b => b.textContent.includes('Start')); if (btn) btn.click(); }, 350);`,
    wait: 1000
  }));

  // Figure 4.3: Live Books Catalogue Route
  figures.push(await capture({
    file: "03-books-catalogue.png",
    figure: "Figure 4.3",
    title: "Live Books Catalogue Route (/books)",
    purpose: "Main API-backed catalogue route with search, filters and sorting.",
    demonstrates: "The client-side BooksPage component fetching and rendering the 77-book API catalogue with live search, category filter pills, availability toggles and sorting.",
    codeRefs: ["EXP4-CODE-03", "EXP4-CODE-01"],
    path: "books",
    scroll: 220,
    wait: 800
  }));

  // Figure 4.4: Dynamic Parameter Route
  figures.push(await capture({
    file: "04-dynamic-book-details.png",
    figure: "Figure 4.4",
    title: "Dynamic Parameter Route (/books/:id)",
    purpose: "Dynamic route rendering book record by ID parameter.",
    demonstrates: "The dynamic parameter route extracting book ID with useParams, fetching record details via useApiData, and displaying cover artwork, stock availability and rental actions.",
    codeRefs: ["EXP4-CODE-04", "EXP4-CODE-01"],
    path: "books",
    setup: `document.querySelector('.book-card a')?.click();`,
    wait: 1000
  }));

  // Figure 4.5: Membership Plans Route
  figures.push(await capture({
    file: "05-membership-plans.png",
    figure: "Figure 4.5",
    title: "Reader Membership Plans Route (/membership)",
    purpose: "Dedicated subscription tiers page with UPI integration.",
    demonstrates: "The dedicated membership route with live subscription tiers (Basic, Standard, Bibliophile) and interactive UPI QR payment modal integration.",
    codeRefs: ["EXP4-CODE-07", "EXP4-CODE-01"],
    path: "membership",
    scroll: 120,
    wait: 700
  }));

  // Figure 4.6: Controlled Login Route
  figures.push(await capture({
    file: "06-login-route.png",
    figure: "Figure 4.6",
    title: "Controlled Authentication Route (/login)",
    purpose: "Reader login screen with controlled form state.",
    demonstrates: "Controlled form inputs for reader authentication, error feedback, and programmatic navigation redirection via useNavigate.",
    codeRefs: ["EXP4-CODE-05", "EXP4-CODE-01"],
    path: "login",
    wait: 600
  }));

  // Figure 4.7: Protected Dashboard Route
  figures.push(await capture({
    file: "07-dashboard-route.png",
    figure: "Figure 4.7",
    title: "Protected Reader Dashboard Route (/dashboard)",
    purpose: "Protected user dashboard displaying active loans and account status.",
    demonstrates: "The reader dashboard route guarded by ProtectedRoute, rendering active rental metrics, payment status, and library exploration CTAs.",
    codeRefs: ["EXP4-CODE-06", "EXP4-CODE-05"],
    path: "login",
    setup: `(() => { const emails = document.querySelector('input[type="email"]'); const passes = document.querySelector('input[type="password"]'); if (emails && passes) { const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; setter.call(emails, 'reader@example.com'); emails.dispatchEvent(new Event('input', { bubbles: true })); setter.call(passes, 'password123'); passes.dispatchEvent(new Event('input', { bubbles: true })); document.querySelector('form.auth-card')?.requestSubmit(); } })()`,
    wait: 900
  }));

  // Figure 4.8: Responsive Mobile Layout
  figures.push(await capture({
    file: "08-responsive-mobile-spa.png",
    figure: "Figure 4.8",
    title: "Responsive Mobile SPA Layout (320px)",
    purpose: "Mobile responsiveness capture at 320px viewport width.",
    demonstrates: "Responsive React Router layout and Book Genie hero adapting cleanly to a 320px mobile viewport without horizontal scrolling.",
    codeRefs: ["EXP4-CODE-01", "EXP4-CODE-02"],
    width: 320,
    height: 900,
    wait: 700
  }));

  return figures;
}

async function collectExp6Screenshots(runtime, evidenceDir) {
  const screenshotsDir = path.join(evidenceDir, "screenshots");
  await ensureDir(screenshotsDir);
  const { browser, url } = runtime;
  const pause = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));
  const apiBase = runtime.apiUrl || "http://127.0.0.1:5003/api";

  const capture = async ({ file, figure, title, purpose, demonstrates, codeRefs, path: targetPath = "", directUrl = "", width = 1280, height = 900, setup = "", scroll = 0, wait = 600 }) => {
    const fullUrl = directUrl || (targetPath ? `${url}${targetPath}` : url);
    await browser.goto(fullUrl);
    await browser.viewport(width, height);
    await pause(wait);
    if (setup) await browser.eval(setup);
    if (scroll) await browser.eval(`window.scrollTo(0, ${scroll})`);
    await pause(wait);
    await browser.screenshot(path.join(screenshotsDir, file));
    return { figure, title, file: `screenshots/${file}`, purpose, what_it_demonstrates: demonstrates, code_refs: codeRefs };
  };

  const figures = [];

  // Figure 6.1: Node.js Express Server Health & API Root (/api/health)
  figures.push(await capture({
    file: "01-express-server-health.png",
    figure: "Figure 6.1",
    title: "Node.js Express Server Health & MongoDB State (/api/health)",
    purpose: "Live Express server health check and MongoDB connectivity verification.",
    demonstrates: "Express.js REST API running on port 5003 with JSON response verifying active server status and live MongoDB connection.",
    codeRefs: ["EXP6-CODE-01", "EXP6-CODE-02"],
    directUrl: `${apiBase}/health`,
    wait: 500
  }));

  // Figure 6.2: Mongoose Books REST API Endpoint (GET /api/books)
  figures.push(await capture({
    file: "02-api-books-endpoint.png",
    figure: "Figure 6.2",
    title: "Mongoose Books REST API Endpoint (GET /api/books)",
    purpose: "Live JSON payload returned by Mongoose Book.find() query.",
    demonstrates: "Express REST endpoint returning 77 book documents serialized from MongoDB with Mongoose Schema fields, text search indexing, and inventory counts.",
    codeRefs: ["EXP6-CODE-05", "EXP6-CODE-03"],
    directUrl: `${apiBase}/books`,
    wait: 600
  }));

  // Figure 6.3: Kitab Ghar Main Application & Live Backend Integration
  figures.push(await capture({
    file: "03-main-homepage-backend.png",
    figure: "Figure 6.3",
    title: "Main Kitab Ghar SPA Connected to Express Backend & MongoDB",
    purpose: "Real Kitab Ghar homepage rendering dynamic data supplied by Express & MongoDB.",
    demonstrates: "Client layout, official branding logo, Book Genie reading guide, and featured live book catalogue fetched asynchronously from the Express API.",
    codeRefs: ["EXP6-CODE-01", "EXP6-CODE-05"],
    wait: 600
  }));

  // Figure 6.4: Live Books Catalogue Route (/books) Querying MongoDB
  figures.push(await capture({
    file: "04-books-catalogue-mongodb.png",
    figure: "Figure 6.4",
    title: "Live Books Catalogue Route (/books) Querying MongoDB",
    purpose: "Live React frontend catalogue rendering 77 books directly from MongoDB.",
    demonstrates: "React SPA fetching the live 77-book catalogue from the Express /api/books endpoint, with live search and category filtering executing against MongoDB.",
    codeRefs: ["EXP6-CODE-05", "EXP6-CODE-03"],
    path: "books",
    scroll: 220,
    wait: 800
  }));

  // Figure 6.5: Dynamic Parameter Route (/books/:id) using Mongoose findById
  figures.push(await capture({
    file: "05-dynamic-book-details-crud.png",
    figure: "Figure 6.5",
    title: "Dynamic Book Details (/books/:id) using Mongoose findById",
    purpose: "Real book detail view fetched via GET /api/books/:id.",
    demonstrates: "Dynamic book record loaded from MongoDB via Mongoose findById(), rendering title, author, description, category, and real-time copy availability.",
    codeRefs: ["EXP6-CODE-05", "EXP6-CODE-03"],
    path: "books",
    setup: `document.querySelector('.book-card a')?.click();`,
    wait: 1000
  }));

  // Figure 6.6: Reader Membership Plans (/membership) via Mongoose Plans Collection
  figures.push(await capture({
    file: "06-membership-plans-api.png",
    figure: "Figure 6.6",
    title: "Reader Membership Plans (/membership) via Mongoose Plans Collection",
    purpose: "Live subscription tiers loaded from MongoDB /api/plans.",
    demonstrates: "Dynamic membership options (Basic, Standard, Bibliophile) rendered from MongoDB documents via Express, with interactive UPI payment trigger.",
    codeRefs: ["EXP6-CODE-01", "EXP6-CODE-02"],
    path: "membership",
    scroll: 120,
    wait: 700
  }));

  // Figure 6.7: User Authentication & JWT Token Exchange (/login)
  figures.push(await capture({
    file: "07-jwt-auth-login.png",
    figure: "Figure 6.7",
    title: "User Authentication & JWT Token Exchange (/login)",
    purpose: "Reader authentication form interacting with /api/auth/login.",
    demonstrates: "Reader login form sending credentials to Express authController, verifying hashed passwords with bcrypt in MongoDB and returning signed JWT session tokens.",
    codeRefs: ["EXP6-CODE-06", "EXP6-CODE-07", "EXP6-CODE-04"],
    path: "login",
    wait: 600
  }));

  // Figure 6.8: Protected Reader Dashboard (/dashboard) Querying User State
  figures.push(await capture({
    file: "08-reader-dashboard-rentals.png",
    figure: "Figure 6.8",
    title: "Protected Reader Dashboard (/dashboard) Querying User State",
    purpose: "Authenticated dashboard populated from MongoDB via JWT protected routes.",
    demonstrates: "Protected reader dashboard rendering verified user account details, rental summary, and active subscriptions guarded by Express JWT middleware.",
    codeRefs: ["EXP6-CODE-06", "EXP6-CODE-07"],
    path: "login",
    setup: `(() => { const emails = document.querySelector('input[type="email"]'); const passes = document.querySelector('input[type="password"]'); if (emails && passes) { const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; setter.call(emails, 'reader@kitabghar.local'); emails.dispatchEvent(new Event('input', { bubbles: true })); setter.call(passes, 'Reader@2026!'); passes.dispatchEvent(new Event('input', { bubbles: true })); document.querySelector('form.auth-card')?.requestSubmit(); } })()`,
    wait: 1000
  }));

  return figures;
}

async function collectExp9Screenshots(runtime, evidenceDir) {
  const screenshotsDir = path.join(evidenceDir, "screenshots");
  await ensureDir(screenshotsDir);
  const { browser, url } = runtime;
  const pause = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

  const capture = async ({ file, figure, title, purpose, demonstrates, codeRefs, path: targetPath = "", width = 1280, height = 900, setup = "", scroll = 0, wait = 600 }) => {
    await browser.goto(targetPath ? `${url}${targetPath}` : url);
    await browser.viewport(width, height);
    await pause(wait);
    if (setup) await browser.eval(setup);
    if (scroll) await browser.eval(`window.scrollTo(0, ${scroll})`);
    await pause(wait);
    await browser.screenshot(path.join(screenshotsDir, file));
    return { figure, title, file: `screenshots/${file}`, purpose, what_it_demonstrates: demonstrates, code_refs: codeRefs };
  };

  const figures = [];

  // Figure 9.1: Complete MERN Application Homepage
  figures.push(await capture({
    file: "01-mern-homepage.png",
    figure: "Figure 9.1",
    title: "Kitab Ghar MERN Application Homepage & Visual Identity",
    purpose: "Initial render of the integrated full MERN application homepage.",
    demonstrates: "React 18 SPA homepage connected to the Express backend and MongoDB database, rendering live trust metrics, brand identity, and the Book Genie hero.",
    codeRefs: ["EXP9-CODE-01", "EXP9-CODE-04"],
    wait: 600
  }));

  // Figure 9.2: Interactive Book Genie Recommendation Wizard
  figures.push(await capture({
    file: "02-book-genie-recommendation.png",
    figure: "Figure 9.2",
    title: "Interactive Book Genie Recommendation Engine",
    purpose: "Interactive Akinator-style recommendation wizard querying live catalogue.",
    demonstrates: "React recommendation wizard querying the 77-book MongoDB catalogue via Express API to provide real-time personalized book suggestions.",
    codeRefs: ["EXP9-CODE-04", "EXP9-CODE-06"],
    setup: `document.querySelector('.genie-launch')?.click(); setTimeout(() => { const btn = [...document.querySelectorAll('.genie-wizard-start button')].find(b => b.textContent.includes('Start')); if (btn) btn.click(); }, 350);`,
    wait: 1000
  }));

  // Figure 9.3: Live Books Catalogue Route (/books)
  figures.push(await capture({
    file: "03-live-catalogue-api.png",
    figure: "Figure 9.3",
    title: "Full-Stack Books Catalogue Route (/books)",
    purpose: "Live API-backed catalogue rendering 77 books directly from MongoDB.",
    demonstrates: "React BooksPage component querying Express /api/books with URLSearchParams, live search input, category filters, and availability toggles.",
    codeRefs: ["EXP9-CODE-06", "EXP9-CODE-03", "EXP9-CODE-02"],
    path: "books",
    scroll: 220,
    wait: 800
  }));

  // Figure 9.4: Dynamic Book Details Route (/books/:id)
  figures.push(await capture({
    file: "04-dynamic-details-cart.png",
    figure: "Figure 9.4",
    title: "Dynamic Book Details & Rental Cart Action (/books/:id)",
    purpose: "Dynamic parameter route fetching record details via Mongoose findById.",
    demonstrates: "Targeted book record loaded from MongoDB via Express /api/books/:id, displaying cover art, description, real-time inventory count, and rental cart interaction.",
    codeRefs: ["EXP9-CODE-03", "EXP9-CODE-04"],
    path: "books",
    setup: `document.querySelector('.book-card a')?.click();`,
    wait: 1000
  }));

  // Figure 9.5: Membership Plans & UPI Payment Modal (/membership)
  figures.push(await capture({
    file: "05-membership-tiers-upi.png",
    figure: "Figure 9.5",
    title: "Subscription Management & UPI Payment Gateway (/membership)",
    purpose: "Live reader subscription tiers with dynamic UPI payment integration.",
    demonstrates: "Subscription tiers retrieved from MongoDB /api/plans rendered into interactive cards with dynamic UPI QR code modal generation.",
    codeRefs: ["EXP9-CODE-07", "EXP9-CODE-04"],
    path: "membership",
    scroll: 120,
    wait: 700
  }));

  // Figure 9.6: Controlled Authentication Route (/login)
  figures.push(await capture({
    file: "06-reader-authentication-jwt.png",
    figure: "Figure 9.6",
    title: "Full-Stack Reader Authentication & JWT Session (/login)",
    purpose: "Controlled reader login screen interacting with /api/auth/login.",
    demonstrates: "Controlled login form transmitting credentials to the Express authController, verifying bcrypt password hashes against MongoDB, and storing JWT tokens.",
    codeRefs: ["EXP9-CODE-05", "EXP9-CODE-04"],
    path: "login",
    wait: 600
  }));

  // Figure 9.7: Protected Reader Dashboard (/dashboard)
  figures.push(await capture({
    file: "07-protected-reader-dashboard.png",
    figure: "Figure 9.7",
    title: "Protected Reader Dashboard & Account Overview (/dashboard)",
    purpose: "Guarded reader dashboard displaying authenticated profile and rentals.",
    demonstrates: "Protected reader dashboard guarded by React ProtectedRoute and Express JWT middleware, rendering live account details and library services.",
    codeRefs: ["EXP9-CODE-05", "EXP9-CODE-01"],
    path: "login",
    setup: `(() => { const emails = document.querySelector('input[type="email"]'); const passes = document.querySelector('input[type="password"]'); if (emails && passes) { const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; setter.call(emails, 'reader@kitabghar.local'); emails.dispatchEvent(new Event('input', { bubbles: true })); setter.call(passes, 'Reader@2026!'); passes.dispatchEvent(new Event('input', { bubbles: true })); document.querySelector('form.auth-card')?.requestSubmit(); } })()`,
    wait: 1000
  }));

  // Figure 9.8: Responsive Mobile MERN Layout (320px)
  figures.push(await capture({
    file: "08-responsive-mobile-mern.png",
    figure: "Figure 9.8",
    title: "Responsive Mobile Full MERN Layout (320px)",
    purpose: "Mobile responsiveness verification at 320px viewport width.",
    demonstrates: "Complete MERN application UI and Book Genie hero adapting cleanly to a 320px mobile viewport without horizontal scrolling or clipping.",
    codeRefs: ["EXP9-CODE-01", "EXP9-CODE-06"],
    width: 320,
    height: 900,
    wait: 700
  }));

  return figures;
}
