import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login, loginDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to previously requested page or dashboard
  const destination = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    login(email, password);
    navigate(destination, { replace: true });
  };

  const handleDemoLogin = () => {
    loginDemo();
    navigate(destination, { replace: true });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-icon">🔐</span>
          <h1 className="auth-title">Reader Login</h1>
          <p className="auth-subtitle">Access your active rentals, saved books, and Badlapur library account.</p>
        </div>

        {error && <div className="auth-error-alert">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <input
              type="email"
              id="login-email"
              className="form-input"
              placeholder="e.g. reader@kitabghar.in"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              type="password"
              id="login-password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
            />
          </div>

          <button type="submit" className="btn-primary full-width" id="btn-submit-login">
            Log In to Account →
          </button>
        </form>

        <div className="demo-login-box">
          <p>Quick Prototype Access:</p>
          <button type="button" className="btn-demo-login" id="btn-demo-login" onClick={handleDemoLogin}>
            ⚡ Demo Reader Quick Fill & Login
          </button>
        </div>

        <div className="auth-footer">
          <span>Don't have an account yet? </span>
          <Link to="/register" className="auth-link">
            Join Kitab Ghar
          </Link>
        </div>
      </div>
    </div>
  );
}
