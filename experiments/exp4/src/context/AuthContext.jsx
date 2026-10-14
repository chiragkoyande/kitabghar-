import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const DEFAULT_USER = {
  id: "reader-badlapur-01",
  name: "Chirag Kulkarni",
  email: "reader@kitabghar.in",
  mobile: "9876543210",
  plan: "Standard Plan (₹299 / month)",
  planTier: "standard",
  city: "Badlapur East",
  maxBooks: 2
};

const INITIAL_RENTALS = [
  {
    id: 1,
    title: "The Wind in the Willows",
    author: "Kenneth Grahame",
    category: "Classics",
    coverImage: "/book-covers/catalogue-000.jpg",
    rentedOn: "2026-09-18",
    dueDate: "2026-10-02",
    status: "Active"
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("exp4_kitabghar_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [activeRentals, setActiveRentals] = useState(() => {
    const saved = localStorage.getItem("exp4_kitabghar_rentals");
    return saved ? JSON.parse(saved) : INITIAL_RENTALS;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("exp4_kitabghar_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("exp4_kitabghar_user");
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("exp4_kitabghar_rentals", JSON.stringify(activeRentals));
  }, [activeRentals]);

  const login = (email, password) => {
    const reader = {
      ...DEFAULT_USER,
      email: email || DEFAULT_USER.email
    };
    setUser(reader);
    return reader;
  };

  const loginDemo = () => {
    setUser(DEFAULT_USER);
    return DEFAULT_USER;
  };

  const register = (details) => {
    const planName = details.plan === "basic" ? "Basic Plan (₹199 / month)" : details.plan === "premium" ? "Premium Plan (₹499 / month)" : "Standard Plan (₹299 / month)";
    const maxBooks = details.plan === "basic" ? 1 : details.plan === "premium" ? 4 : 2;
    const reader = {
      id: "reader-" + Date.now(),
      name: details.name || "New Badlapur Reader",
      email: details.email,
      mobile: details.mobile || "9876543210",
      plan: planName,
      planTier: details.plan || "standard",
      city: details.city || "Badlapur",
      maxBooks
    };
    setUser(reader);
    return reader;
  };

  const logout = () => {
    setUser(null);
  };

  const rentBook = (book) => {
    if (!user) return { success: false, reason: "NOT_AUTHENTICATED" };
    if (activeRentals.length >= user.maxBooks) {
      return { success: false, reason: "QUOTA_EXCEEDED" };
    }
    if (activeRentals.some((r) => r.id === book.id)) {
      return { success: false, reason: "ALREADY_RENTED" };
    }
    const newRental = {
      id: book.id,
      title: book.title,
      author: book.author,
      category: book.category,
      coverImage: book.coverImage,
      rentedOn: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      status: "Active"
    };
    setActiveRentals((prev) => [newRental, ...prev]);
    return { success: true, rental: newRental };
  };

  const returnBook = (bookId) => {
    setActiveRentals((prev) => prev.filter((r) => r.id !== Number(bookId)));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeRentals,
        login,
        loginDemo,
        register,
        logout,
        rentBook,
        returnBook
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
