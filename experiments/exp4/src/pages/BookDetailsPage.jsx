import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { books } from "../data/books";
import { useAuth } from "../context/AuthContext";

export default function BookDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, rentBook, activeRentals } = useAuth();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  // Component Lifecycle Behaviour:
  // Runs whenever the dynamic route parameter `id` changes
  useEffect(() => {
    setLoading(true);
    setFeedback(null);
    window.scrollTo(0, 0);

    // Simulate async data retrieval and lifecycle mount
    const timer = setTimeout(() => {
      const foundBook = books.find((b) => b.id === Number(id));
      setBook(foundBook || null);
      if (foundBook) {
        document.title = `${foundBook.title} — Kitab Ghar Badlapur`;
      } else {
        document.title = "Book Not Found — Kitab Ghar Badlapur";
      }
      setLoading(false);
    }, 120);

    // Lifecycle cleanup function
    return () => {
      clearTimeout(timer);
    };
  }, [id]);

  const isRentedByMe = activeRentals.some((r) => r.id === Number(id));

  const handleRent = () => {
    if (!user) {
      navigate("/login", { state: { from: `/books/${id}` } });
      return;
    }

    const result = rentBook(book);
    if (result.success) {
      setFeedback({
        type: "success",
        message: `Success! "${book.title}" has been added to your active rentals. Doorstep delivery will be scheduled for Badlapur.`
      });
    } else if (result.reason === "QUOTA_EXCEEDED") {
      setFeedback({
        type: "error",
        message: `Rental limit reached (${user.maxBooks} books max for your ${user.plan}). Please return a book or upgrade your plan.`
      });
    } else if (result.reason === "ALREADY_RENTED") {
      setFeedback({
        type: "info",
        message: "You already have this book checked out in your active rentals."
      });
    }
  };

  if (loading) {
    return (
      <div className="book-details-page loading-wrap">
        <div className="loading-spinner"></div>
        <p>Loading book details for Catalog ID #{id}…</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="book-details-page not-found-wrap">
        <div className="details-error-card">
          <div className="error-icon">📚</div>
          <h2>Book Record #{id} Not Found</h2>
          <p>The book you requested does not exist in our Badlapur catalogue or has been retired.</p>
          <Link to="/books" className="btn-primary">
            ← Return to Catalogue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="book-details-page">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span className="separator">/</span>
        <Link to="/books">Catalogue</Link>
        <span className="separator">/</span>
        <span className="current">{book.title}</span>
      </nav>

      {/* Main Book Detail Grid */}
      <div className="details-container">
        <div className="details-visual">
          <div className="details-cover-card">
            <img
              src={book.coverImage}
              alt={book.title}
              className="details-cover-img"
              onError={(e) => {
                e.currentTarget.src = "/book-covers/catalogue-000.jpg";
              }}
            />
            <div className="cover-badge-row">
              <span className={`status-pill ${book.availableCopies > 0 ? "available" : "out"}`}>
                {book.availableCopies > 0 ? `✓ ${book.availableCopies} Copies Available` : "✕ Currently Out"}
              </span>
            </div>
          </div>
        </div>

        <div className="details-info-panel">
          <div className="book-meta-top">
            <span className="details-category">{book.category}</span>
            <span className="details-id">Catalogue ID: #{book.id}</span>
          </div>

          <h1 className="details-title">{book.title}</h1>
          <p className="details-author">
            Author: <strong>{book.author}</strong>
          </p>

          <div className="details-spec-grid">
            <div className="spec-card">
              <span className="spec-label">Language</span>
              <span className="spec-value">{book.language || "English"}</span>
            </div>
            <div className="spec-card">
              <span className="spec-label">Publication</span>
              <span className="spec-value">{book.publicationYear || "2025"}</span>
            </div>
            <div className="spec-card">
              <span className="spec-label">Total Inventory</span>
              <span className="spec-value">{book.totalCopies} copies</span>
            </div>
            <div className="spec-card">
              <span className="spec-label">Location</span>
              <span className="spec-value">Badlapur Central</span>
            </div>
          </div>

          <div className="details-synopsis">
            <h3>Synopsis & Overview</h3>
            <p>{book.description}</p>
          </div>

          {feedback && (
            <div className={`feedback-banner ${feedback.type}`}>
              <span>{feedback.message}</span>
              {feedback.type === "success" && (
                <Link to="/dashboard" className="btn-view-dashboard">
                  View in Dashboard →
                </Link>
              )}
            </div>
          )}

          <div className="details-actions-bar">
            {book.availableCopies > 0 ? (
              <button
                type="button"
                className="btn-rent-action"
                onClick={handleRent}
                disabled={isRentedByMe}
              >
                {isRentedByMe ? "✓ Currently Borrowed" : "📖 Rent this Book"}
              </button>
            ) : (
              <button type="button" className="btn-waitlist-action" disabled>
                ⏳ Join Waiting List (Currently Out)
              </button>
            )}

            <Link to="/books" className="btn-back-catalogue">
              ← Back to Catalogue
            </Link>
          </div>

          <div className="delivery-perks">
            <div className="perk-item">
              <span>⚡</span> Doorstep delivery in 24 hours across Badlapur
            </div>
            <div className="perk-item">
              <span>🔄</span> Free doorstep returns & swaps with active membership
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
