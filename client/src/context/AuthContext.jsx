import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("kitabghar-token")));

  useEffect(() => {
    if (!localStorage.getItem("kitabghar-token")) return undefined;
    apiRequest("/auth/me").then((result) => setUser(result.user)).catch(() => localStorage.removeItem("kitabghar-token")).finally(() => setLoading(false));
    return undefined;
  }, []);

  const saveSession = (result) => { localStorage.setItem("kitabghar-token", result.token); setUser(result.user); };
  const login = async (credentials) => saveSession(await apiRequest("/auth/login", { method: "POST", body: JSON.stringify(credentials) }));
  const register = async (details) => saveSession(await apiRequest("/auth/register", { method: "POST", body: JSON.stringify(details) }));
  const logout = () => { localStorage.removeItem("kitabghar-token"); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error("useAuth must be used within AuthProvider"); return context; }
