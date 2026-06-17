import React from "react";
import { useAuth } from "../context/AuthContext.jsx";

const navigation = [
  { id: "dashboard", label: "Inicio" },
  { id: "categories", label: "Categorias" },
  { id: "products", label: "Produtos" },
  { id: "clients", label: "Clientes" },
  { id: "coupons", label: "Cupons" },
  { id: "report", label: "Relatorio" }
];

export function Layout({ activePage, onNavigate, children }) {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">SportFit Store</p>
          <h1>Loja de roupa esportiva</h1>
        </div>

        <nav className="nav-list" aria-label="Menu principal">
          {navigation.map((item) => (
            <button
              key={item.id}
              type="button"
              className={item.id === activePage ? "nav-button active" : "nav-button"}
              onClick={() => onNavigate(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="session-card">
          <span>Logado como</span>
          <strong>{user.email}</strong>
          <button type="button" className="secondary-button" onClick={logout}>
            Sair
          </button>
        </div>
      </aside>

      <main className="content">{children}</main>
    </div>
  );
}
