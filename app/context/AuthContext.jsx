import { createContext, useContext, useState } from "react";
import { USERS } from "../data/users";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  function login(email, password) {
    const user = USERS.find(
      (u) => u.email === email && u.password === password,
    );
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  }

  function signup(name, email, password) {
    if (USERS.find((u) => u.email === email)) return false;
    const newUser = {
      id: `u${USERS.length + 1}`,
      name,
      email,
      password,
      planId: null,
      createdAt: new Date().toISOString().split("T")[0],
    };
    USERS.push(newUser);
    setCurrentUser(newUser);
    return true;
  }

  function logout() {
    setCurrentUser(null);
  }

  function updateUser(updates) {
    if (!currentUser) return;
    const idx = USERS.findIndex((u) => u.id === currentUser.id);
    if (idx !== -1) {
      Object.assign(USERS[idx], updates);
      setCurrentUser({ ...USERS[idx] });
    }
  }

  return (
    <AuthContext.Provider
      value={{ currentUser, login, signup, logout, updateUser }}
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
