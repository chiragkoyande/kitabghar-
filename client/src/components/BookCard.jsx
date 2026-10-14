import React from "react";
import { Link } from "react-router-dom";

export default function BookCard({ book }) {
  const tone = book.category?.toLowerCase().includes("mystery") ? "wine" : book.category?.toLowerCase().includes("fiction") ? "coffee" : "sage";
  return <article className="book-card"><Link to={`/books/${book._id}`}><div className={`book-cover cover-${tone}`}>{book.coverImage ? <img className="book-cover-image" src={book.coverImage} alt={`${book.title} cover`} /> : <><span>KITAB GHAR</span><strong>{book.title}</strong><small>{book.category}</small></>}</div><div className="book-card-body"><p className="book-category">{book.category}</p><h2>{book.title}</h2><p className="book-author">{book.author}</p><span className={`availability ${book.availableCopies > 0 ? "available" : "unavailable"}`}>{book.availableCopies > 0 ? `${book.availableCopies} available` : "Currently out"}</span></div></Link></article>;
}
