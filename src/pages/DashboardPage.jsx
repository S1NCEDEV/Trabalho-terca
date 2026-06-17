import React from "react";

export function DashboardPage({ categories, products, clients, coupons, orders, onNavigate }) {
  const lowStock = products.filter((product) => Number(product.stock) <= 15);
  const activeCoupons = coupons.filter((coupon) => coupon.active === "Sim");
  const soldProducts = products
    .map((product) => {
      const productOrders = orders.filter((order) => order.productId === product.id);
      const soldQuantity = productOrders.reduce((total, order) => total + Number(order.quantity || 0), 0);
      const revenue = soldQuantity * Number(product.price || 0);

      return {
        ...product,
        soldQuantity,
        revenue
      };
    })
    .filter((product) => product.soldQuantity > 0)
    .sort((a, b) => b.soldQuantity - a.soldQuantity);
  const totalSoldItems = soldProducts.reduce((total, product) => total + product.soldQuantity, 0);
  const totalRevenue = soldProducts.reduce((total, product) => total + product.revenue, 0);
  const coveredFlows = [
    "Efetuar login",
    "Encerrar sessao",
    "Cadastrar produto",
    "Editar produto",
    "Excluir produto",
    "Atualizar estoque",
    "Gerenciar categoria",
    "Criar cupom",
    "Editar cupom",
    "Excluir cupom",
    "Gerar relatorios",
    "Visualizar dashboard"
  ];

  return (
    <section className="page-stack">
      <header className="page-header">
        <p className="eyebrow">Painel inicial</p>
        <h2>Gestao da loja esportiva</h2>
        <p>
          Acompanhe os principais cadastros e acesse rapidamente as operacoes de Create, Read, Update
          e Delete.
        </p>
      </header>

      <div className="metric-grid">
        <Metric label="Categorias" value={categories.length} />
        <Metric label="Produtos" value={products.length} />
        <Metric label="Clientes" value={clients.length} />
        <Metric label="Pedidos" value={orders.length} />
        <Metric label="Itens vendidos" value={totalSoldItems} />
        <Metric label="Cupons ativos" value={activeCoupons.length} />
        <Metric label="Estoque baixo" value={lowStock.length} />
      </div>

      <section className="sales-panel">
        <div className="sales-heading">
          <div>
            <p className="eyebrow">Vendas</p>
            <h3>Produtos vendidos</h3>
          </div>
          <strong>{formatMoney(totalRevenue)}</strong>
        </div>

        {soldProducts.length === 0 ? (
          <p className="empty-state">Nenhuma venda registrada ainda.</p>
        ) : (
          <div className="sold-products-list">
            {soldProducts.map((product) => (
              <article key={product.id} className="sold-product-card">
                <img src={product.imageUrl} alt={product.name} />
                <div>
                  <strong>{product.name}</strong>
                  <span>{product.soldQuantity} unidade(s) vendida(s)</span>
                </div>
                <strong>{formatMoney(product.revenue)}</strong>
              </article>
            ))}
          </div>
        )}
      </section>

      <div className="quick-actions">
        <button type="button" className="primary-button" onClick={() => onNavigate("products")}>
          Gerenciar produtos
        </button>
        <button type="button" className="secondary-button" onClick={() => onNavigate("report")}>
          Ver Relatorio
        </button>
      </div>

      <section className="flow-panel">
        <h3>Fluxos UML contemplados no projeto</h3>
        <div className="flow-list">
          {coveredFlows.map((flow) => (
            <span key={flow}>{flow}</span>
          ))}
        </div>
      </section>
    </section>
  );
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function Metric({ label, value }) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
