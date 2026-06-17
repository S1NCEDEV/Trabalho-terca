import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { ClientStorePage } from "./ClientStorePage.jsx";

export function ClientPortalPage({
  products,
  categories,
  clients,
  coupons,
  orders,
  payments,
  setOrders,
  setPayments
}) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const client = clients.find((clientItem) => clientItem.id === user.clientId) || clients[0];

  const clientOrders = orders
    .filter((order) => order.clientId === client?.id)
    .map((order) => {
      const product = products.find((productItem) => productItem.id === order.productId);
      const category = categories.find((categoryItem) => categoryItem.id === product?.categoryId);
      const payment = payments.find((paymentItem) => paymentItem.orderId === order.id);
      return { ...order, product, category, payment };
    });

  return (
    <main className="client-portal">
      <header className="client-portal-header">
        <div>
          <p className="eyebrow">Minha conta</p>
          <h1>Ola, {client?.name || user.name}</h1>
        </div>
        <button type="button" className="secondary-button" onClick={logout}>
          Sair
        </button>
      </header>

      <nav className="client-tabs" aria-label="Area do cliente">
        <button type="button" className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>
          Perfil
        </button>
        <button type="button" className={activeTab === "store" ? "active" : ""} onClick={() => setActiveTab("store")}>
          Comprar
        </button>
        <button type="button" className={activeTab === "orders" ? "active" : ""} onClick={() => setActiveTab("orders")}>
          Acompanhar pedido
        </button>
      </nav>

      {activeTab === "profile" && <ClientProfile client={client} clientOrders={clientOrders} />}

      {activeTab === "store" && (
        <ClientStorePage
          products={products}
          categories={categories}
          clients={clients}
          coupons={coupons}
          setOrders={setOrders}
          setPayments={setPayments}
          fixedClientId={client?.id}
        />
      )}

      {activeTab === "orders" && <ClientOrders orders={clientOrders} />}
    </main>
  );
}

function ClientProfile({ client, clientOrders }) {
  return (
    <section className="client-profile-grid">
      <article className="profile-card main-profile-card">
        <div className="avatar-circle">{client?.name?.slice(0, 1) || "C"}</div>
        <div>
          <h2>{client?.name}</h2>
          <p>{client?.email}</p>
        </div>
      </article>

      <article className="profile-card">
        <span>CPF</span>
        <strong>{client?.cpf}</strong>
      </article>
      <article className="profile-card">
        <span>Telefone</span>
        <strong>{client?.phone}</strong>
      </article>
      <article className="profile-card">
        <span>Status</span>
        <strong>{client?.status}</strong>
      </article>
      <article className="profile-card wide">
        <span>Endereco de entrega</span>
        <strong>{client?.address}</strong>
      </article>
      <article className="profile-card wide">
        <span>Resumo</span>
        <strong>{clientOrders.length} pedido(s) vinculados a esta conta</strong>
      </article>
    </section>
  );
}

function ClientOrders({ orders }) {
  if (orders.length === 0) {
    return <p className="empty-state">Voce ainda nao possui pedidos.</p>;
  }

  return (
    <section className="orders-list">
      {orders.map((order) => (
        <article key={order.id} className="order-card">
          <img src={order.product?.imageUrl} alt={order.product?.name || "Produto"} />
          <div>
            <span>Pedido {order.id}</span>
            <h3>{order.product?.name || "Produto removido"}</h3>
            <p>{order.category?.name || "Sem categoria"} - Quantidade: {order.quantity}</p>
            <small>Entrega: {order.deliveryAddress || "Endereco nao informado"}</small>
            <small>CEP: {order.deliveryCep || "Nao informado"}</small>
          </div>
          <div className="order-status">
            <strong>{order.status}</strong>
            <span>{order.payment?.method || "Pagamento nao informado"}</span>
            <small>{order.payment?.status || "Sem status"}</small>
          </div>
        </article>
      ))}
    </section>
  );
}
