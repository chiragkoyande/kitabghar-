import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import { AdminPage, BookDetailsPage, BooksPage, CartPage, DashboardPage, HomePage, HowItWorksPage, LoginPage, MembershipPage, NotificationsPage, OrdersPage, PaymentsPage, ProfilePage, RegisterPage, RentalsPage, SubscriptionPage } from "./pages/Pages";

function AdminRoute() { const { user } = useAuth(); return user?.role === "admin" ? <AdminPage /> : <Navigate to="/dashboard" replace />; }

