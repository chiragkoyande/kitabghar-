import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { register } = useAuth();

  const initialPlan = location.state?.plan || "standard";

  const [formData, setFormData] = useState({
    name: "Chirag Kulkarni",
    email: "reader@kitabghar.in",
    mobile: "9876543210",
    plan: initialPlan,
    password: "Password123",
    confirmPassword: "Password123"
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.mobile || !formData.password) {
      setError("Please fill out all required fields.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    register(formData);
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="auth-page">
      <div className="auth-card register-card">
        <div className="auth-header">
          <span className="auth-icon">📝</span>
          <h1 className="auth-title">Join Kitab Ghar</h1>
          <p className="auth-subtitle">Create your Badlapur reader account to start borrowing books today.</p>
        </div>

        {error && <div className="auth-error-alert">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="reg-name">Full Name</label>
            <input
              type="text"
              id="reg-name"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="reg-email">Email Address</label>
              <input
                type="email"
                id="reg-email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-mobile">Mobile Number (Badlapur)</label>
              <input
                type="tel"
                id="reg-mobile"
                name="mobile"
                className="form-input"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-plan">Select Subscription Tier</label>
            <select
              id="reg-plan"
              name="plan"
              className="form-input select-input"
              value={formData.plan}
              onChange={handleChange}
            >
              <option value="basic">Basic Reader (₹199 / mo — 1 book at a time)</option>
              <option value="standard">Standard Reader (₹299 / mo — 2 books at a time)</option>
              <option value="premium">Bibliophile Premium (₹499 / mo — 4 books at a time)</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="reg-pass">Password</label>
              <input
                type="password"
                id="reg-pass"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-confirm">Confirm Password</label>
              <input
                type="password"
                id="reg-confirm"
                name="confirmPassword"
                className="form-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary full-width" id="btn-submit-register">
            Complete Registration & Go to Dashboard →
          </button>
        </form>

        <div className="auth-footer">
          <span>Already have an account? </span>
          <Link to="/login" className="auth-link">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
}
