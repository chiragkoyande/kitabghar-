  const saveSession = (result) => { localStorage.setItem("kitabghar-token", result.token); setUser(result.user); };
  const login = async (credentials) => saveSession(await apiRequest("/auth/login", { method: "POST", body: JSON.stringify(credentials) }));
  const register = async (details) => saveSession(await apiRequest("/auth/register", { method: "POST", body: JSON.stringify(details) }));
  const logout = () => { localStorage.removeItem("kitabghar-token"); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
