import React from "react";

export function ReportPage({ products, categories, clients, coupons, orders, payments }) {
  const reportRows = orders.map((order) => {
    const product = products.find((item) => item.id === order.productId);
    const category = categories.find((item) => item.id === product?.categoryId);
    const client = clients.find((item) => item.id === order.clientId);
    const coupon = coupons.find((item) => item.id === order.couponId);
    const payment = payments.find((item) => item.orderId === order.id);
    const subtotal = Number(product?.price || 0) * Number(order.quantity || 0);
    const discount = coupon?.active === "Sim" ? subtotal * (Number(coupon.discount || 0) / 100) : 0;

    return {
      ...order,
      productName: product?.name || "Produto removido",
      categoryName: category?.name || "Categoria removida",
      clientName: client?.name || "Cliente removido",
      clientEmail: client?.email || "Sem e-mail",
      couponCode: coupon?.code || "Sem cupom",
      paymentMethod: payment?.method || "Nao informado",
      paymentStatus: payment?.status || "Nao informado",
      deliveryAddress: order.deliveryAddress || client?.address || "Endereco nao informado",
      deliveryCep: order.deliveryCep || "Nao informado",
      total: subtotal - discount
    };
  });

  return (
    <section className="page-stack">
      <header className="page-header">
        <p className="eyebrow">Relatorio</p>
        <h2>Relatorio de pedidos</h2>
        <p>Acompanhe pedidos, clientes, produtos, pagamento, entrega e total da compra.</p>
      </header>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Cliente</th>
              <th>Cupom</th>
              <th>Pagamento</th>
              <th>Entrega</th>
              <th>Status pedido</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {reportRows.map((row) => (
              <tr key={row.id}>
                <td>
                  <strong>{row.productName}</strong>
                  <span className="muted-cell">Qtd: {row.quantity}</span>
                </td>
                <td>{row.categoryName}</td>
                <td>
                  <strong>{row.clientName}</strong>
                  <span className="muted-cell">{row.clientEmail}</span>
                </td>
                <td>{row.couponCode}</td>
                <td>
                  <strong>{row.paymentMethod}</strong>
                  <span className="muted-cell">{row.paymentStatus}</span>
                </td>
                <td>
                  <strong>{row.deliveryAddress}</strong>
                  <span className="muted-cell">CEP: {row.deliveryCep}</span>
                </td>
                <td>{row.status}</td>
                <td>{Number(row.total || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
