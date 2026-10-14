import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import { AdminPage, BookDetailsPage, BooksPage, CartPage, DashboardPage, HomePage, HowItWorksPage, LoginPage, MembershipPage, NotificationsPage, OrdersPage, PaymentsPage, ProfilePage, RegisterPage, RentalsPage, SubscriptionPage } from "./pages/Pages";

function AdminRoute() { const { user } = useAuth(); return user?.role === "admin" ? <AdminPage /> : <Navigate to="/dashboard" replace />; }

export default function App() { return <Routes><Route element={<Layout />}><Route index element={<HomePage />} /><Route path="books" element={<BooksPage />} /><Route path="books/:id" element={<BookDetailsPage />} /><Route path="membership" element={<MembershipPage />} /><Route path="how-it-works" element={<HowItWorksPage />} /><Route path="login" element={<LoginPage />} /><Route path="register" element={<RegisterPage />} /><Route element={<ProtectedRoute />}><Route path="dashboard" element={<DashboardPage />} /><Route path="cart" element={<CartPage />} /><Route path="orders" element={<OrdersPage />} /><Route path="notifications" element={<NotificationsPage />} /><Route path="my-rentals" element={<RentalsPage />} /><Route path="subscription" element={<SubscriptionPage />} /><Route path="payments" element={<PaymentsPage />} /><Route path="profile" element={<ProfilePage />} /><Route path="admin" element={<AdminRoute />} /></Route><Route path="*" element={<HomePage />} /></Route></Routes>; }

