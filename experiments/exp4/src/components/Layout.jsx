import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout, activeRentals } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="app-layout">
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" to="/">
            <img
              src="/kitab-ghar-logo.png"
              alt="Kitab Ghar Badlapur official logo"
              className="brand-logo"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextElementSibling?.classList.add("visible");
              }}
            />
            <span className="brand-fallback" aria-hidden="true">
              Kitab Ghar <small>Badlapur</small>
            </span>
          </Link>

          <nav className="nav-links">
            <NavLink to="/" end className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              Home
            </NavLink>
            <NavLink to="/books" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              Browse Books
            </NavLink>
            <NavLink to="/membership" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              Membership
            </NavLink>
            {user && (
              <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                Dashboard {activeRentals.length > 0 && <span className="badge-count">{activeRentals.length}</span>}
              </NavLink>
            )}
          </nav>

          <div className="header-actions">
            {user ? (
              <div className="user-session-bar">
                <span className="user-greeting">Hi, {user.name.split(" ")[0]}</span>
                <button type="button" className="btn-logout" onClick={handleLogout}>
                  Log out
                </button>
              </div>
            ) : (
              <div className="auth-actions">
                <NavLink to="/login" className="btn-login-link">
                  Log in
                </NavLink>
                <Link to="/register" className="btn-join">
                  Join Kitab Ghar →
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <strong>Kitab Ghar</strong>
            <p>Your neighbourhood book rental & subscription library in Badlapur, Maharashtra.</p>
          </div>
          <div className="footer-links">
            <Link to="/books">All Books</Link>
            <Link to="/membership">Plans</Link>
            <Link to="/login">Reader Login</Link>
            <Link to="/register">Register</Link>
          </div>
          <div className="footer-bottom">
            <span>© 2026 Kitab Ghar Badlapur • Experiment 4: React Router SPA</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
