import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { user, activeRentals, returnBook, logout } = useAuth();
  const navigate = useNavigate();
  const [returnMessage, setReturnMessage] = useState("");

  const handleReturn = (bookId, title) => {
    returnBook(bookId);
    setReturnMessage(`✓ Return requested for "${title}". Our Badlapur courier will pick it up tomorrow.`);
    setTimeout(() => {
      setReturnMessage("");
    }, 4000);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <span className="section-pill">Reader Dashboard</span>
          <h1 className="page-title">Welcome back, {user?.name || "Reader"}</h1>
          <p className="page-subtitle">Manage your active book rentals, subscription plan, and Badlapur delivery preferences.</p>
        </div>
        <button type="button" className="btn-secondary" id="btn-dashboard-logout" onClick={handleLogout}>
          Log out
        </button>
      </div>

      {returnMessage && <div className="return-success-alert">{returnMessage}</div>}

      {/* Reader Overview Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">📖</span>
          <div className="stat-info">
            <span className="stat-value">{activeRentals.length}</span>
            <span className="stat-label">Currently Borrowed</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">🎯</span>
          <div className="stat-info">
            <span className="stat-value">{user?.maxBooks || 2}</span>
            <span className="stat-label">Max Quota per Plan</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">💎</span>
          <div className="stat-info">
            <span className="stat-value">{user?.plan || "Standard Plan"}</span>
            <span className="stat-label">Active Subscription</span>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">📍</span>
          <div className="stat-info">
            <span className="stat-value">{user?.city || "Badlapur"}</span>
            <span className="stat-label">Delivery Hub</span>
          </div>
        </div>
      </div>

      {/* Active Borrowed Books Section */}
      <div className="dashboard-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Your Active Rentals</h2>
            <p className="section-subtitle">Keep track of your borrowed physical books and scheduled returns.</p>
          </div>
          <Link to="/books" className="btn-primary small">
            + Borrow Another Book
          </Link>
        </div>

        {activeRentals.length > 0 ? (
          <div className="rentals-grid">
            {activeRentals.map((rental) => (
              <article key={rental.id} className="rental-card">
                <img
                  src={rental.coverImage || "/book-covers/catalogue-000.jpg"}
                  alt={rental.title}
                  className="rental-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/book-covers/catalogue-000.jpg";
                  }}
                />
                <div className="rental-content">
                  <div className="rental-top">
                    <span className="book-category">{rental.category || "General"}</span>
                    <span className="status-badge active">● Currently Reading</span>
                  </div>
                  <h3 className="rental-title">{rental.title}</h3>
                  <p className="rental-author">by {rental.author}</p>

                  <div className="rental-dates">
                    <div>
                      <span className="date-label">Rented on:</span>
                      <span className="date-val">{rental.rentedOn || "Recent"}</span>
                    </div>
                    <div>
                      <span className="date-label">Return due:</span>
                      <span className="date-val due">{rental.dueDate || "In 14 days"}</span>
                    </div>
                  </div>

                  <div className="rental-actions">
                    <button
                      type="button"
                      className="btn-return"
                      onClick={() => handleReturn(rental.id, rental.title)}
                    >
                      🔄 Request Return / Swap
                    </button>
                    <Link to={`/books/${rental.id}`} className="btn-view-book">
                      View Book Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-rentals-card">
            <div className="empty-icon">📚</div>
            <h3>No books currently checked out</h3>
            <p>You have {user?.maxBooks || 2} book slots available under your plan. Browse the catalogue to order your next delivery!</p>
            <Link to="/books" className="btn-primary">
              Browse Kitab Ghar Catalogue →
            </Link>
          </div>
        )}
      </div>

      {/* Account & Delivery Profile Box */}
      <div className="profile-box">
        <h3>Reader Account & Subscription Profile</h3>
        <div className="profile-details-grid">
          <div>
            <strong>Reader Name:</strong> <span>{user?.name}</span>
          </div>
          <div>
            <strong>Registered Email:</strong> <span>{user?.email}</span>
          </div>
          <div>
            <strong>Contact Mobile:</strong> <span>{user?.mobile || "9876543210"}</span>
          </div>
          <div>
            <strong>Delivery Zone:</strong> <span>Badlapur East & West Station Circle</span>
          </div>
        </div>
      </div>
    </div>
  );
}
