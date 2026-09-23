import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "../api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!localStorage.getItem("token"));

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  // restore session
  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    api("/api/auth/me")
      .then((d) => setUser(d.user))
      .catch(logout)
      .finally(() => setLoading(false));
  }, [logout]);

  // any 401 from the API / socket -> log out
  useEffect(() => {
    window.addEventListener("auth:expired", logout);
    return () => window.removeEventListener("auth:expired", logout);
  }, [logout]);

  const login = async (username, password) => {
    const d = await api("/api/auth/login", { method: "POST", body: { username, password } });
    localStorage.setItem("token", d.token);
    setUser(d.user);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
  );
}
