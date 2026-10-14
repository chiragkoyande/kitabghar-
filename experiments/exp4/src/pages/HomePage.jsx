import React from "react";
import { Link } from "react-router-dom";
import { books } from "../data/books";

export default function HomePage() {
  const featuredBooks = books.slice(0, 4);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="genie-badge">
              <span className="sparkle">✦</span> Book Genie
            </div>
            <h1 className="hero-title">Your personal reading guide in Badlapur</h1>
            <p className="hero-subtitle">
              Rent bestsellers, timeless classics, and academic literature right at your doorstep. 
              Enjoy flexible monthly subscriptions with zero deposit and free exchanges.
            </p>
            <div className="hero-actions">
              <Link to="/books" className="btn-primary">
                Browse Books Catalogue →
              </Link>
              <Link to="/membership" className="btn-secondary">
                View Membership Plans
              </Link>
            </div>
          </div>

          <div className="hero-visual">
            <div className="genie-character-card">
              <img
                src="/book-genie-character.webp"
                alt="Kitab Ghar Book Genie Character"
                className="genie-img"
              />
              <div className="genie-floating-bubble">
                <span className="bubble-icon">✨</span>
                <span>Discover your next favourite read!</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Features Bar */}
      <section className="trust-bar">
        <div className="trust-item">
          <div className="trust-icon">🚚</div>
          <div>
            <strong>Doorstep Delivery</strong>
            <p>Across Badlapur East & West</p>
          </div>
        </div>
        <div className="trust-item">
          <div className="trust-icon">📚</div>
          <div>
            <strong>77+ Curated Titles</strong>
            <p>Classics, Fiction, Tech & Self-Help</p>
          </div>
        </div>
        <div className="trust-item">
          <div className="trust-icon">🔄</div>
          <div>
            <strong>Unlimited Swaps</strong>
            <p>Read at your own pace</p>
          </div>
        </div>
        <div className="trust-item">
          <div className="trust-icon">💳</div>
          <div>
            <strong>Affordable Plans</strong>
            <p>Starting at ₹199 / month</p>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="featured-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Featured Books</h2>
            <p className="section-subtitle">Handpicked recommendations for Badlapur readers this week</p>
          </div>
          <Link to="/books" className="view-all-link">
            See all books →
          </Link>
        </div>

        <div className="featured-grid">
          {featuredBooks.map((book) => (
            <article key={book.id} className="book-card">
              <div className="book-cover-wrap">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="book-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/book-covers/catalogue-000.jpg";
                  }}
                />
                <span className={`availability-tag ${book.availableCopies > 0 ? "available" : "out"}`}>
                  {book.availableCopies > 0 ? `${book.availableCopies} available` : "Currently out"}
                </span>
              </div>
              <div className="book-info">
                <span className="book-category">{book.category}</span>
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">by {book.author}</p>
                <div className="book-card-footer">
                  <Link to={`/books/${book.id}`} className="card-link-btn">
                    View Details →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Membership Callout */}
      <section className="membership-preview-section">
        <div className="membership-preview-card">
          <div className="membership-preview-content">
            <h2>Join the Kitab Ghar Reading Club</h2>
            <p>
              Get unlimited access to our entire catalogue with doorstep drop and pickup across Badlapur. 
              Plans start at just ₹199 per month.
            </p>
            <Link to="/membership" className="btn-primary light">
              Explore Subscription Plans →
            </Link>
          </div>
          <div className="membership-preview-badges">
            <div className="plan-badge">
              <strong>Basic</strong>
              <span>₹199 / mo</span>
            </div>
            <div className="plan-badge popular">
              <span className="badge-ribbon">Popular</span>
              <strong>Standard</strong>
              <span>₹299 / mo</span>
            </div>
            <div className="plan-badge">
              <strong>Premium</strong>
              <span>₹499 / mo</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
