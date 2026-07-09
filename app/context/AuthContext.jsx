import { createContext, useContext, useState, useEffect } from "react";
import { MOCK_USERS } from "../data/mockUsers";

const STORAGE_KEY = "portfolium_user";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: restore session from localStorage before any route decision
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setCurrentUser(JSON.parse(stored));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  function persist(user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setCurrentUser(user);
  }

  function login(email, password) {
    const found = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (!found) return false;

    const { password: _pw, ...safeUser } = found;
    persist(safeUser);
    return true;
  }

  function signup({ name, email, password, firm = "" }) {
    const exists = MOCK_USERS.find((u) => u.email === email);
    if (exists) return false;

    const newUser = {
      id: `u${Date.now()}`,
      name,
      email,
      firm,
      planId: "free",
      clients: [],
      createdAt: new Date().toISOString().split("T")[0],
    };

    // Store password only in the in-memory array, not in localStorage
    MOCK_USERS.push({ ...newUser, password });
    persist(newUser);
    return true;
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setCurrentUser(null);
  }

  // Mock reset — real link would carry a signed token; here the token is ignored
  function resetPassword(token, newPassword) {
    if (!token || !newPassword) return false;
    return true;
  }

  function updateUser(updates) {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    const idx = MOCK_USERS.findIndex((u) => u.id === currentUser.id);
    if (idx !== -1) Object.assign(MOCK_USERS[idx], updates);
    persist(updated);
  }

  return (
    <AuthContext.Provider
      value={{ currentUser, isLoading, login, signup, logout, resetPassword, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
