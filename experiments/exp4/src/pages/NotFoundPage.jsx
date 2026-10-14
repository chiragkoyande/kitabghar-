import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function NotFoundPage() {
  const location = useLocation();

  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <div className="not-found-badge">404 Error</div>
        <h1 className="not-found-title">Page Not Found</h1>
        <p className="not-found-message">
          The requested URL <code className="route-code">{location.pathname}</code> does not match any valid route in the Kitab Ghar Single Page Application.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn-primary" id="btn-back-home">
            ← Return to Homepage
          </Link>
          <Link to="/books" className="btn-secondary" id="btn-browse-books">
            Browse Books Catalogue
          </Link>
        </div>
      </div>
    </div>
  );
}
