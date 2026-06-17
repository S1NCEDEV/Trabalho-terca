import React, { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);
const SESSION_KEY = "sportfit-session";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedSession = localStorage.getItem(SESSION_KEY);
    return savedSession ? JSON.parse(savedSession) : null;
  });

  function login(email, password, clients = []) {
    if (!email.trim() || !password.trim()) {
      return { ok: false, message: "Preencha e-mail e senha para entrar." };
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    const client = clients.find((clientItem) => clientItem.email.toLowerCase() === cleanEmail);
    const isAdmin = cleanEmail === "admin@sportfit.com";

    if (cleanPassword !== "123456") {
      return {
        ok: false,
        message: "Senha incorreta. Use a senha de teste: 123456."
      };
    }

    if (!isAdmin && !client) {
      return {
        ok: false,
        message: "E-mail nao encontrado. Use o admin ou um cliente cadastrado."
      };
    }

    const session = {
      email: cleanEmail,
      name: client?.name || "Administrador",
      role: client ? "client" : "admin",
      clientId: client?.id || null
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
    return { ok: true };
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }
  return context;
}
