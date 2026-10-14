import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getBookRecommendations } from "./recommendationEngine";

const STORAGE_KEY = "kitabghar-book-genie-preferences";

const option = (value, label, description, icon, tags = []) => ({ value, label, description, icon, tags });

const categoryQuestion = {
  key: "category",
  prompt: "What are you in the mood for?",
  options: [
    option("inspiring", "Something inspiring", "Stories and ideas that stay with you.", "✦"),
    option("mystery", "Mystery & suspense", "Clues, twists and impossible-to-put-down pages.", "⌕"),
    option("fiction", "Relax & escape", "A warm doorway into another world.", "◌"),
    option("self-improvement", "Self improvement", "Small ideas that make everyday life better.", "↗"),
    option("career", "Career & business", "Practical thinking for work and ambition.", "▥"),
    option("technology", "Learn something new", "Technology, science and the future.", "⌘"),
  ],
};

const FLOWS = {
  "self-improvement": [
    { key: "topic", prompt: "What would you like to work on?", options: [option("habits", "Habits", "Build routines that last.", "◒"), option("productivity", "Productivity", "Focus your time and energy.", "◷"), option("money", "Money", "Make calmer financial decisions.", "₹"), option("career", "Career", "Grow your skills and direction.", "↗"), option("communication", "Communication", "Connect and communicate better.", "◌"), option("personal-growth", "Personal growth", "Understand yourself and move forward.", "✦")] },
    { key: "readingTime", prompt: "How much time do you usually have for reading?", options: [option("short", "Short sessions", "A few pages whenever you find a moment.", "⌁"), option("20-30", "20–30 minutes", "A steady daily reading rhythm.", "◷"), option("30-60", "30–60 minutes", "Time to settle into an idea.", "◒"), option("long", "Long reading sessions", "Give me a book I can disappear into.", "∞")] },
    { key: "style", prompt: "What style do you prefer?", options: [option("practical", "Practical", "Clear ideas you can use today.", "✓"), option("story-driven", "Story-driven", "Lessons carried by memorable stories.", "◌"), option("deep-detailed", "Deep & detailed", "Nuance, context and a bigger picture.", "⌘"), option("easy-conversational", "Easy & conversational", "Friendly, accessible and warm.", "☼")] },
    { key: "experience", prompt: "How experienced are you with this topic?", options: [option("beginner", "Beginner", "Start with a welcoming introduction.", "1"), option("intermediate", "Intermediate", "I know the basics and want more.", "2"), option("advanced", "Advanced", "Challenge me with deeper thinking.", "3")] },
    { key: "era", prompt: "Modern or classic?", options: [option("modern", "Modern", "Contemporary voices and current ideas.", "✦"), option("classic", "Classic", "A title with a long afterlife.", "◈"), option("either", "Either", "The best match matters most.", "↔")] },
  ],
  mystery: [
    { key: "mysteryType", prompt: "What kind of mystery are you craving?", options: [option("detective", "Detective", "Clever clues and satisfying deductions.", "⌕"), option("psychological", "Psychological", "Secrets, motives and a twist in the mind.", "◉"), option("crime", "Crime", "Justice, consequences and high stakes.", "⚖"), option("dark-supernatural", "Dark / supernatural", "Atmosphere, shadows and the unknown.", "☾")] },
    { key: "readingPace", prompt: "What pace should the story have?", options: [option("fast", "Fast-paced", "Keep the pages turning.", "»"), option("medium", "Medium", "A balanced mix of plot and atmosphere.", "›"), option("slow", "Slow / atmospheric", "Let the tension build quietly.", "…")] },
    { key: "era", prompt: "Classic or modern?", options: [option("modern", "Modern", "Fresh voices and contemporary settings.", "✦"), option("classic", "Classic", "A mystery readers return to.", "◈"), option("either", "Either", "Surprise me with the right case.", "↔")] },
  ],
  technology: [
    { key: "area", prompt: "Which technology shelf sounds best?", options: [option("programming", "Programming", "Build software and sharpen your craft.", "</>"), option("cybersecurity", "Cybersecurity", "Protect systems, people and data.", "⌁"), option("ai", "AI", "Explore intelligent machines and ideas.", "✦"), option("business-tech", "Business & technology", "Where products, people and platforms meet.", "▥"), option("general-tech", "General technology", "A broad tour of how things work.", "⌘")] },
    { key: "difficulty", prompt: "What level should we choose?", options: [option("beginner", "Beginner", "Build a clear foundation.", "1"), option("intermediate", "Intermediate", "Move beyond the basics.", "2"), option("advanced", "Advanced", "Give me a serious challenge.", "3")] },
    { key: "style", prompt: "How would you like to learn?", options: [option("practical", "Practical", "Examples, tools and useful steps.", "✓"), option("conceptual", "Conceptual", "Understand the ideas beneath the tools.", "⌘"), option("project-oriented", "Project-oriented", "Learn by building something real.", "▣")] },
  ],
  fiction: [
    { key: "topic", prompt: "What kind of escape sounds right?", options: [option("fantasy", "Fantasy", "A world beyond the everyday.", "✦"), option("heartwarming", "Heartwarming", "Human stories with a little light.", "♡"), option("classics", "Classic fiction", "A story that has travelled through time.", "◈"), option("poetry", "Poetry & reflection", "Beautiful language and a slower rhythm.", "❧")] },
    { key: "style", prompt: "How should it feel to read?", options: [option("story-driven", "Story-driven", "Let the characters lead the way.", "◌"), option("easy-conversational", "Easy & conversational", "Comforting and effortless.", "☼"), option("deep-detailed", "Deep & detailed", "A richly built world to explore.", "⌘")] },
    { key: "era", prompt: "Modern or classic?", options: [option("modern", "Modern", "A current voice and perspective.", "✦"), option("classic", "Classic", "A title with a long afterlife.", "◈"), option("either", "Either", "Choose the most enchanting match.", "↔")] },
  ],
  inspiring: [
    { key: "topic", prompt: "What kind of inspiration do you need?", options: [option("personal-growth", "Personal growth", "A thoughtful nudge forward.", "✦"), option("biography", "A real life story", "Learn from someone else's journey.", "◌"), option("classics", "Timeless wisdom", "Ideas that have endured.", "◈"), option("poetry", "Poetry & reflection", "A few beautiful lines to carry.", "❧")] },
    { key: "style", prompt: "What style would you enjoy?", options: [option("story-driven", "Story-driven", "Let a life or story open the door.", "◌"), option("conceptual", "Thought-provoking", "Give me ideas to sit with.", "⌘"), option("easy-conversational", "Easy & conversational", "Warm, clear and welcoming.", "☼")] },
    { key: "era", prompt: "Modern or classic?", options: [option("modern", "Modern", "A voice for today.", "✦"), option("classic", "Classic", "A voice that still matters.", "◈"), option("either", "Either", "The right idea at the right time.", "↔")] },
  ],
  career: [
    { key: "careerFocus", prompt: "What would help you most right now?", options: [option("leadership", "Leadership", "Lead people and decisions with clarity.", "♧"), option("entrepreneurship", "Entrepreneurship", "Build, test and grow an idea.", "↗"), option("finance-investing", "Finance", "Understand money and markets.", "₹"), option("teamwork-culture", "Teams & culture", "Make work more human and effective.", "◌")] },
    { key: "style", prompt: "How do you like to learn?", options: [option("practical", "Practical", "Useful frameworks for the real world.", "✓"), option("story-driven", "Story-driven", "Learn through people and cases.", "◌"), option("deep-detailed", "Deep & detailed", "Give me the full picture.", "⌘")] },
    { key: "difficulty", prompt: "What level feels right?", options: [option("beginner", "Beginner", "A clear place to start.", "1"), option("intermediate", "Intermediate", "I am ready to go further.", "2"), option("advanced", "Advanced", "Challenge my thinking.", "3")] },
  ],
};

function flowFor(category) {
  return [categoryQuestion, ...(FLOWS[category] || FLOWS.fiction)];
}

function preferenceSummary(preferences) {
  return Object.values(preferences).filter(Boolean).map((value) => String(value).replace(/-/g, " ")).slice(0, 4).join(" · ");
}

function GenieProgress({ current, total }) {
  return <div className="genie-wizard-progress"><div><span>Question {current} of {total}</span><strong>{Math.round((current / total) * 100)}%</strong></div><i><b style={{ width: `${(current / total) * 100}%` }} /></i></div>;
}

function GenieOption({ choice, selected, onSelect }) {
  return <button className={`genie-option-card${selected ? " selected" : ""}`} type="button" onClick={() => onSelect(choice)}><span className="genie-option-icon" aria-hidden="true">{choice.icon}</span><span className="genie-option-copy"><strong>{choice.label}</strong><small>{choice.description}</small></span><span className="genie-option-arrow" aria-hidden="true">→</span></button>;
}

function RecommendationCard({ book }) {
  const available = book.availableCopies > 0;
  return <article className="genie-recommendation-card"><div className="genie-recommendation-cover">{book.coverImage ? <img src={book.coverImage} alt={`${book.title} cover`} /> : <><span>KITAB GHAR</span><strong>{book.title}</strong></>}</div><div className="genie-recommendation-body"><div className="genie-match-line"><span>{book.compatibilityScore}% match</span><small className={available ? "available" : "unavailable"}>{available ? "Available" : "Currently out"}</small></div><p className="book-category">{book.category}</p><h3>{book.title}</h3><p className="book-author">{book.author}</p><p className="genie-why">{book.explanation}</p><div className="genie-recommendation-actions"><Link className="secondary-button" to={`/books/${book._id}`}>View book</Link><Link className="primary-button" to={`/books/${book._id}`}>Rent this book</Link></div></div></article>;
}

export default function BookGenieWizard({ books = [], loading = false, error = "", onRetry, onClose }) {
  const [preferences, setPreferences] = useState({});
  const [phase, setPhase] = useState("start");
  const [step, setStep] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const [savedPreferences, setSavedPreferences] = useState(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (saved && typeof saved === "object") setSavedPreferences(saved);
    } catch { setSavedPreferences(null); }
  }, []);

  useEffect(() => {
    const closeOnEscape = (event) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", closeOnEscape);
    return () => { document.removeEventListener("keydown", closeOnEscape); };
  }, [onClose]);

  const questions = useMemo(() => flowFor(preferences.category), [preferences.category]);
  const question = questions[step];

  const begin = (initial = {}) => { setPreferences(initial); setStep(0); setRecommendations([]); setPhase("quiz"); };
  const continueSaved = () => {
    setPreferences(savedPreferences || {});
    setStep(0);
    if (books.length > 0) { setRecommendations(getBookRecommendations(savedPreferences || {}, books)); setPhase("results"); }
    else setPhase("quiz");
  };
  const choose = (choice) => {
    const next = { ...preferences, [question.key]: choice.value };
    if (question.key === "category") next.category = choice.value;
    setPreferences(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    if (step < questions.length - 1) { setStep(step + 1); return; }
    setPhase("thinking");
    window.setTimeout(() => { setRecommendations(getBookRecommendations(next, books)); setPhase("results"); }, 650);
  };
  const restart = () => { setSavedPreferences(null); localStorage.removeItem(STORAGE_KEY); begin({}); };
  const changeAnswers = () => { setStep(0); setRecommendations([]); setPhase("quiz"); };
  const relaxFilters = () => { setRecommendations(getBookRecommendations({}, books)); setPhase("results"); };

  return <div className="genie-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="genie-modal" role="dialog" aria-modal="true" aria-labelledby="book-genie-title"><aside className="genie-wizard-side"><div className="genie-wizard-side-copy"><span className="genie-wizard-sparkle">✦</span><p className="eyebrow">Your personal reading guide</p><h2 id="book-genie-title">Meet your<br /><em>Book Genie.</em></h2><p>Tell us what you feel like reading. We’ll search the Kitab Ghar catalogue for three thoughtful matches.</p><div className="genie-preference-pill">{phase === "results" ? preferenceSummary(preferences) || "Your reading match" : "Offline recommendation engine"}</div></div><img className="genie-wizard-character" src="/book-genie-character.webp" alt="Friendly blue Book Genie rising from a magic lamp" /></aside><div className="genie-wizard-main"><header className="genie-wizard-header"><div><span className="genie-status" /> <strong>Book Genie</strong><small>Your personal reading guide</small></div><button className="genie-modal-close" type="button" onClick={onClose} aria-label="Close Book Genie">×</button></header>{phase === "start" && <div className="genie-wizard-start"><p className="eyebrow">A few quick questions</p><h3>Find the book<br /><em>that fits today.</em></h3><p>{savedPreferences ? "We remember your last reading mood. Continue it or start with a fresh set of answers." : "Answer one question at a time. Your recommendations are selected from the live Kitab Ghar catalogue."}</p><div className="genie-start-actions">{savedPreferences && <button className="primary-button" type="button" onClick={continueSaved}>Continue previous preferences</button>}<button className="secondary-button" type="button" onClick={restart}>{savedPreferences ? "Start fresh" : "Start the questions"} <span>→</span></button></div></div>}{phase === "quiz" && question && <div className="genie-wizard-quiz"><GenieProgress current={step + 1} total={questions.length} /><div className="genie-question-heading"><p className="eyebrow">Book Genie is listening</p><h3>{question.prompt}</h3><p>Choose the answer that feels closest. You can change your answers later.</p></div><div className="genie-option-grid">{question.options.map((choice) => <GenieOption key={choice.value} choice={choice} selected={preferences[question.key] === choice.value} onSelect={choose} />)}</div></div>}{phase === "thinking" && <div className="genie-wizard-thinking"><img src="/book-genie-character.webp" alt="" /><p className="eyebrow">Book Genie is thinking</p><h3>Searching the shelves<br /><em>for your next read.</em></h3><div className="genie-thinking-dots"><i /><i /><i /></div></div>}{phase === "results" && <div className="genie-wizard-results">{recommendations.length > 0 ? <><div className="genie-results-heading"><div><p className="eyebrow">Your next reads</p><h3>Three books<br /><em>worth bringing home.</em></h3><p>Based on your answers, the Book Genie found these matches.</p></div><button className="genie-text-button" type="button" onClick={changeAnswers}>Change my answers</button></div><div className="genie-results-grid">{recommendations.map((book) => <RecommendationCard key={book._id} book={book} />)}</div><button className="genie-restart-link" type="button" onClick={restart}>↺ Start again</button></> : <div className="genie-empty-results"><span>✦</span><h3>We couldn’t find a close match.</h3><p>Try relaxing the filters and we’ll show the closest available books in the catalogue.</p><div><button className="primary-button" type="button" onClick={relaxFilters}>Relax the filters</button><button className="secondary-button" type="button" onClick={changeAnswers}>Change my answers</button></div></div>}</div>}{loading && <div className="genie-wizard-loading"><span className="skeleton-line" /><span className="skeleton-line short" /> Loading the latest catalogue…</div>}{error && !loading && <div className="genie-wizard-error"><strong>Something went wrong while finding your books.</strong><span>{error}</span><button className="secondary-button" type="button" onClick={onRetry}>Try again</button></div>}</div></section></div>;
}
