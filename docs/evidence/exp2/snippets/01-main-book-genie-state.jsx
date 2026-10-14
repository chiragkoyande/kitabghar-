export default function GenieHero() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const loadBooks = () => {
    setLoading(true);
    setError("");
    return apiRequest("/books")
      .then((data) => setBooks(data.books || []))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let active = true;
    loadBooks();
    return () => { active = false; };
  }, []);

  return <div className="genie-hero-visual"><div className="genie-hero-stage"><img className="genie-stage-character" src="/book-genie-character.webp" alt="Book Genie rising from a magic lamp" /><div className="genie-art-glow" /><div className="genie-art-label"><span>✦</span><div><strong>Book Genie</strong><small>Your personal reading guide</small></div></div></div><button className={open ? "genie-launch active" : "genie-launch"} type="button" onClick={() => setOpen(true)}><span className="genie-launch-orb">✦</span>{open ? "Genie is listening" : "Ask the Book Genie"}<b>↗</b></button>{open && <BookGenieWizard books={books} loading={loading} error={error} onRetry={loadBooks} onClose={() => setOpen(false)} />}</div>;
}
