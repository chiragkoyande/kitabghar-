import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PLANS = [
  {
    id: "basic",
    name: "Basic Reader",
    price: "₹199",
    period: "/ month",
    booksAtATime: 1,
    swaps: "2 swaps / month",
    delivery: "Standard Delivery (₹30)",
    features: [
      "1 book at a time",
      "2 monthly book exchanges",
      "Access to full 77+ book catalogue",
      "7-day borrowing period",
      "Community reading group access"
    ],
    popular: false
  },
  {
    id: "standard",
    name: "Standard Reader",
    price: "₹299",
    period: "/ month",
    booksAtATime: 2,
    swaps: "Unlimited swaps",
    delivery: "Free Doorstep Delivery",
    features: [
      "2 books at a time",
      "Unlimited monthly exchanges",
      "Free doorstep delivery in Badlapur",
      "14-day borrowing period",
      "Book Genie recommendations",
      "Priority customer support"
    ],
    popular: true
  },
  {
    id: "premium",
    name: "Bibliophile Premium",
    price: "₹499",
    period: "/ month",
    booksAtATime: 4,
    swaps: "Unlimited swaps",
    delivery: "Priority Same-Day Delivery",
    features: [
      "4 books at a time",
      "Unlimited monthly exchanges",
      "Free priority same-day delivery",
      "21-day borrowing period",
      "First access to new arrivals",
      "Complimentary Kitab Ghar bookmark & tote"
    ],
    popular: false
  }
];

export default function MembershipPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPlanId, setSelectedPlanId] = useState("standard");

  const handleSelectPlan = (planId) => {
    setSelectedPlanId(planId);
  };

  const handleSubscribe = (planId) => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/register", { state: { plan: planId } });
    }
  };

  return (
    <div className="membership-page">
      <div className="page-header text-center">
        <span className="section-pill">Membership Plans</span>
        <h1 className="page-title">Flexible Reading Subscriptions</h1>
        <p className="page-subtitle">
          Enjoy unlimited access to physical books delivered straight to your home in Badlapur. 
          No security deposit, pause or cancel anytime.
        </p>
      </div>

      <div className="plans-grid">
        {PLANS.map((plan) => {
          const isSelected = selectedPlanId === plan.id;
          const isCurrentPlan = user && user.planTier === plan.id;

          return (
            <div
              key={plan.id}
              className={`plan-card ${plan.popular ? "popular" : ""} ${isSelected ? "selected" : ""}`}
              onClick={() => handleSelectPlan(plan.id)}
            >
              {plan.popular && <span className="popular-tag">Most Popular in Badlapur</span>}
              <div className="plan-header">
                <h2 className="plan-name">{plan.name}</h2>
                <div className="plan-price-wrap">
                  <span className="price-amount">{plan.price}</span>
                  <span className="price-period">{plan.period}</span>
                </div>
                <p className="plan-summary">{plan.delivery} • {plan.swaps}</p>
              </div>

              <ul className="plan-features">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>
                    <span className="check-icon">✓</span> {feature}
                  </li>
                ))}
              </ul>

              <div className="plan-action">
                <button
                  type="button"
                  className={`btn-plan-select ${plan.popular ? "btn-primary" : "btn-secondary"}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSubscribe(plan.id);
                  }}
                >
                  {isCurrentPlan ? "Current Plan (Active)" : user ? "Switch to this Plan" : "Get Started →"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="faq-box">
        <h3>How Kitab Ghar Subscriptions Work</h3>
        <div className="faq-grid">
          <div className="faq-item">
            <strong>1. Select Your Plan</strong>
            <p>Choose how many books you want at a time. No deposit required.</p>
          </div>
          <div className="faq-item">
            <strong>2. Pick Any Books</strong>
            <p>Order through our catalogue or Book Genie recommendation wizard.</p>
          </div>
          <div className="faq-item">
            <strong>3. Free Home Delivery</strong>
            <p>Our local Badlapur team delivers to your doorstep within 24 hours.</p>
          </div>
          <div className="faq-item">
            <strong>4. Read & Swap</strong>
            <p>When done, schedule a swap. We deliver your next read and take the previous.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
