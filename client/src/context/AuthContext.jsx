import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { api } from "../api";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ============================================
  // LOGOUT
  // ============================================
  const logout = useCallback(() => {
    console.log("[AUTH] LOGOUT");

    localStorage.removeItem("token");
    setUser(null);
    setLoading(false);
  }, []);

  // ============================================
  // RESTORE SESSION
  // ============================================
  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      const token = localStorage.getItem("token");

      console.log("[AUTH] Token exists:", !!token);

      if (!token) {
        console.log("[AUTH] No token found");

        if (!cancelled) {
          setUser(null);
          setLoading(false);
        }

        return;
      }

      try {
        console.log("[AUTH] Calling /api/auth/me...");

        const data = await api("/api/auth/me");

        if (cancelled) return;

        console.log("[AUTH] /me response:", data);

        if (!data?.user) {
          throw new Error("No user returned from /me");
        }

        console.log("[AUTH] Session restored successfully");

        setUser(data.user);
      } catch (error) {
        if (cancelled) return;

        console.error("[AUTH] Session restore FAILED:", error);

        // Only remove the token in ONE place — here.
        // Do not let api.js fire auth:expired for /me.
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        if (!cancelled) {
          console.log("[AUTH] Loading finished");
          setLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  // ============================================
  // AUTH EXPIRED EVENT
  // ============================================
  useEffect(() => {
    const handleAuthExpired = () => {
      console.log("[AUTH] auth:expired event received");

      localStorage.removeItem("token");
      setUser(null);
      setLoading(false);
    };

    window.addEventListener(
      "auth:expired",
      handleAuthExpired
    );

    return () => {
      window.removeEventListener(
        "auth:expired",
        handleAuthExpired
      );
    };
  }, []);

  // ============================================
  // LOGIN
  // ============================================
  const login = async (username, password) => {
    console.log("[AUTH] Logging in...");

    const data = await api("/api/auth/login", {
      method: "POST",
      body: {
        username,
        password,
      },
    });

    console.log("[AUTH] Login response:", data);

    if (!data?.token) {
      throw new Error("No token received from server");
    }

    localStorage.setItem("token", data.token);

    console.log("[AUTH] Token saved to localStorage");

    setUser(data.user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}