import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true); // true while checking session

  // On mount: try to restore session via /auth/me
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/auth/me`, { credentials: "include" });
        if (res.ok) {
          const { user } = await res.json();
          setUser(user);
        }
      } catch {
        // Not authenticated — that's fine
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signup = useCallback(async (email, password) => {
    const res = await fetch(`${API}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",       // send/receive cookies
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    setUser(data.user);
    return data.user;
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    await fetch(`${API}/auth/logout`, { method: "POST", credentials: "include" });
    setUser(null);
  }, []);

  /**
   * authFetch — wrapper around fetch that silently refreshes the access token
   * when it gets a 401 TOKEN_EXPIRED response, then retries once.
   */
  const authFetch = useCallback(async (url, options = {}) => {
    const opts = { ...options, credentials: "include" };
    let res = await fetch(url, opts);

    if (res.status === 401) {
      const body = await res.json().catch(() => ({}));
      if (body.code === "TOKEN_EXPIRED") {
        // Try to silently refresh
        const refreshRes = await fetch(`${API}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });
        if (refreshRes.ok) {
          res = await fetch(url, opts); // retry original request
        } else {
          setUser(null); // refresh failed — force re-login
        }
      }
    }
    return res;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
};
