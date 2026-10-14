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
