import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../services/api";

export const questions = [
  { key: "mood", prompt: "What do you need from your next read?", options: [["escape", "Help me escape", ["fiction", "fantasy", "mystery", "romance"]], ["learn", "Teach me something", ["technology", "business", "nonfiction", "academic"]], ["grow", "Help me grow", ["self development", "self-help", "biography", "psychology"]], ["inspire", "Leave me inspired", ["classics", "poetry", "literature", "hindi"]]] },
  { key: "pace", prompt: "What kind of reading mood are you in?", options: [["page-turner", "A page-turner", ["mystery", "thriller", "fiction"]], ["thoughtful", "Something thoughtful", ["classics", "literature", "psychology", "poetry"]], ["practical", "A practical guide", ["technology", "business", "self development", "nonfiction"]], ["magical", "A little magic", ["fantasy", "mythology", "comics"]]] },
  { key: "shelf", prompt: "Which shelf would you visit first?", options: [["fiction", "Fiction & stories", ["fiction", "literature", "romance"]], ["growth", "Growth & ideas", ["self development", "business", "technology"]], ["mystery", "Mystery & thrillers", ["mystery", "thriller"]], ["wonder", "Fantasy & wonder", ["fantasy", "mythology", "comics"]]] },
];

export function recommendation(books, answers) {
  if (!books.length) return null;
  const tags = Object.values(answers).flat();
  return [...books].map((book) => {
    const searchable = `${book.title} ${book.author} ${book.category} ${book.description}`.toLowerCase();
    const score = tags.reduce((total, tag) => total + (searchable.includes(tag) ? 3 : 0), 0) + (book.availableCopies > 0 ? 1 : 0);
    return { book, score };
  }).sort((a, b) => b.score - a.score || a.book.title.localeCompare(b.book.title))[0].book;
}

export default function BookGenie() {
  const [books, setBooks] = useState([]);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  useEffect(() => { apiRequest("/books").then((data) => setBooks(data.books || [])).catch(() => setBooks([])); }, []);
  const question = questions[step];
  const progress = useMemo(() => `${Math.min(step + 1, questions.length)} / ${questions.length}`, [step]);
  const choose = (value, tags) => { const next = { ...answers, [question.key]: tags }; setAnswers(next); if (step === questions.length - 1) setResult(recommendation(books, next)); else setStep(step + 1); };
  const restart = () => { setStep(0); setAnswers({}); setResult(null); };
  return <section className="genie-section"><div className="genie-orb" aria-hidden="true"><span>✦</span></div><div className="genie-intro"><p className="eyebrow">Meet your reading companion</p><h2>Not sure what to read?<br /><em>Ask the Book Genie.</em></h2><p>Answer three quick questions and we’ll find a title from the Kitab Ghar collection that fits your mood.</p><button className="primary-button" type="button" onClick={() => setOpen(true)}>{open ? "The genie is listening" : "Find my perfect book →"}</button></div>{open && <div className="genie-chat" role="dialog" aria-label="Book Genie recommendation quiz"><div className="genie-chat-top"><div><span className="genie-status" /> Book Genie</div><button className="genie-close" type="button" onClick={() => setOpen(false)} aria-label="Close Book Genie">×</button></div>{result ? <div className="genie-result"><p className="genie-kicker">Your match is ready</p><h3>{result.title}</h3><p>{result.author} · {result.category}</p>{result.coverImage && <img src={result.coverImage} alt={`${result.title} cover`} />}<Link className="primary-button" to={`/books/${result._id}`}>Meet this book →</Link><button className="genie-restart" type="button" onClick={restart}>Ask again</button></div> : <div className="genie-question"><div className="genie-progress"><span>Question {progress}</span><i><b style={{ width: `${((step + 1) / questions.length) * 100}%` }} /></i></div><p className="genie-prompt">{question.prompt}</p><div className="genie-options">{question.options.map(([value, label, tags]) => <button key={value} type="button" onClick={() => choose(value, tags)}>{label}<span>→</span></button>)}</div></div>}</div>}</section>;
}
