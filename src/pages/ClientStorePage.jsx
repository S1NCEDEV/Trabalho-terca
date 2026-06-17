import React, { useEffect, useMemo, useState } from "react";
import { useLocalStorageState } from "../hooks/useLocalStorageState.js";

const PAYMENT_METHODS = ["Pix", "Cartao de credito", "Boleto"];

export function ClientStorePage({ products, categories, clients, coupons, setOrders, setPayments, fixedClientId }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedClientId, setSelectedClientId] = useState(fixedClientId || clients[0]?.id || "");
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [couponCode, setCouponCode] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryCep, setDeliveryCep] = useState("");
  const [deliveryConfirmed, setDeliveryConfirmed] = useState(false);
  const [calculatedShipping, setCalculatedShipping] = useState(0);
  const [message, setMessage] = useState("");
  const [cart, setCart] = useLocalStorageState("sportfit-cart", []);
  const [favorites, setFavorites] = useLocalStorageState("sportfit-favorites", []);

  const categoryMap = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories]
  );

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedClient = clients.find((client) => client.id === selectedClientId);

  useEffect(() => {
    setDeliveryAddress(selectedClient?.address || "");
    setDeliveryCep("");
    setDeliveryConfirmed(false);
    setCalculatedShipping(0);
  }, [selectedClient?.address, selectedClient?.id]);

  const appliedCoupon = coupons.find(
    (coupon) => coupon.code.toLowerCase() === couponCode.trim().toLowerCase() && coupon.active === "Sim"
  );

  const cartRows = cart.map((item) => {
    const product = products.find((productItem) => productItem.id === item.productId);
    return {
      ...item,
      product,
      subtotal: Number(product?.price || 0) * item.quantity
    };
  }).filter((item) => item.product);

  const subtotal = cartRows.reduce((total, item) => total + item.subtotal, 0);
  const discount = appliedCoupon ? subtotal * (Number(appliedCoupon.discount || 0) / 100) : 0;
  const shipping = deliveryConfirmed ? calculatedShipping : 0;
  const total = subtotal - discount + shipping;

  function addToCart(productId) {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.productId === productId);
      if (existingItem) {
        return currentCart.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...currentCart, { productId, quantity: 1 }];
    });
    setMessage("Produto adicionado ao carrinho.");
  }

  function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      setCart((currentCart) => currentCart.filter((item) => item.productId !== productId));
      return;
    }

    setCart((currentCart) =>
      currentCart.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  }

  function toggleFavorite(productId) {
    setFavorites((currentFavorites) =>
      currentFavorites.includes(productId)
        ? currentFavorites.filter((id) => id !== productId)
        : [...currentFavorites, productId]
    );
  }

  function handleDeliveryAddressChange(event) {
    setDeliveryAddress(event.target.value);
    setDeliveryConfirmed(false);
    setCalculatedShipping(0);
  }

  function handleDeliveryCepChange(event) {
    setDeliveryCep(event.target.value);
    setDeliveryConfirmed(false);
    setCalculatedShipping(0);
  }

  function confirmDeliveryAddress() {
    if (!deliveryAddress.trim()) {
      setMessage("Informe o endereco para calcular o frete.");
      return;
    }

    if (!deliveryCep.trim()) {
      setMessage("Informe o CEP para calcular o frete.");
      return;
    }

    if (cartRows.length === 0) {
      setMessage("Adicione produtos ao carrinho para calcular o frete.");
      return;
    }

    const fakeShipping = calculateFakeShipping(deliveryAddress, deliveryCep, subtotal);
    setCalculatedShipping(fakeShipping);
    setDeliveryConfirmed(true);
    setMessage(
      fakeShipping === 0
        ? "Endereco confirmado. Frete gratis aplicado."
        : `Endereco confirmado. Frete calculado: ${formatMoney(fakeShipping)}.`
    );
  }

  function finishOrder() {
    if (!selectedClient) {
      setMessage("Selecione um cliente para finalizar a compra.");
      return;
    }

    if (cartRows.length === 0) {
      setMessage("Adicione produtos ao carrinho antes de finalizar.");
      return;
    }

    if (!deliveryConfirmed) {
      setMessage("Confirme o endereco e calcule o frete antes de finalizar.");
      return;
    }

    const createdAt = new Date().toISOString().slice(0, 10);
    const newPayments = [];
    const newOrders = cartRows.map((item, index) => {
      const orderId = `ped-${crypto.randomUUID()}`;
      const paymentId = `pay-${crypto.randomUUID()}`;

      newPayments.push({
        id: paymentId,
        orderId,
        method: paymentMethod,
        status: paymentMethod === "Boleto" ? "Pendente" : "Aprovado",
        paymentDate: createdAt
      });

      return {
        id: orderId,
        clientId: selectedClient.id,
        productId: item.product.id,
        couponId: index === 0 ? appliedCoupon?.id || "" : "",
        quantity: String(item.quantity),
        status: paymentMethod === "Boleto" ? "Aguardando pagamento" : "Separando pedido",
        orderDate: createdAt,
        deliveryAddress: deliveryAddress.trim(),
        deliveryCep: deliveryCep.trim(),
        shipping: String(calculatedShipping)
      };
    });

    setOrders((currentOrders) => [...currentOrders, ...newOrders]);
    setPayments((currentPayments) => [...currentPayments, ...newPayments]);
    setCart([]);
    setCouponCode("");
    setMessage(`Compra finalizada para ${selectedClient.name}. Pedido enviado para o relatorio.`);
  }

  return (
    <section className="client-store">
      <header className="store-hero">
        <div>
          <p className="eyebrow">Area do cliente</p>
          <h2>Comprar roupas esportivas</h2>
          <p>Escolha os produtos, aplique cupom, revise o carrinho e finalize a compra.</p>
        </div>
        <div className="store-client-box">
          {fixedClientId ? (
            <div className="client-identity">
              <span>Cliente comprador</span>
              <strong>{selectedClient?.name}</strong>
            </div>
          ) : (
            <label className="field">
              <span>Cliente comprador</span>
              <select value={selectedClientId} onChange={(event) => setSelectedClientId(event.target.value)}>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          <small>{selectedClient?.address || "Endereco nao informado"}</small>
        </div>
      </header>

      <div className="store-layout">
        <main className="catalog-area">
          <div className="catalog-toolbar">
            <label className="field">
              <span>Pesquisar produto</span>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Ex.: legging" />
            </label>
            <label className="field">
              <span>Categoria</span>
              <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
                <option value="all">Todas</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="store-grid">
            {filteredProducts.map((product) => (
              <article key={product.id} className="store-product-card">
                <button
                  type="button"
                  className={favorites.includes(product.id) ? "favorite-button active" : "favorite-button"}
                  onClick={() => toggleFavorite(product.id)}
                  aria-label="Favoritar produto"
                >
                  {favorites.includes(product.id) ? "Fav" : "+"}
                </button>
                <img src={product.imageUrl} alt={product.name} />
                <div className="store-product-body">
                  <span>{categoryMap.get(product.categoryId)?.name || "Sem categoria"}</span>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="product-buy-row">
                    <strong>{Number(product.price || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong>
                    <small>{product.stock} em estoque</small>
                  </div>
                  <button type="button" className="primary-button full" onClick={() => addToCart(product.id)}>
                    Adicionar ao carrinho
                  </button>
                </div>
              </article>
            ))}
          </div>
        </main>

        <aside className="checkout-panel">
          <h3>Carrinho</h3>
          {cartRows.length === 0 ? (
            <p className="empty-cart">Seu carrinho esta vazio.</p>
          ) : (
            <div className="cart-list">
              {cartRows.map((item) => (
                <div key={item.productId} className="cart-item">
                  <img src={item.product.imageUrl} alt={item.product.name} />
                  <div>
                    <strong>{item.product.name}</strong>
                    <span>{Number(item.product.price || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                    <div className="quantity-control">
                      <button type="button" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <label className="field">
            <span>Cupom</span>
            <input value={couponCode} onChange={(event) => setCouponCode(event.target.value)} placeholder="SPORT10" />
          </label>

          <section className="delivery-panel">
            <div>
              <span>Entrega</span>
              <strong>Confirmar endereco</strong>
            </div>
            <label className="field">
              <span>Endereco de entrega</span>
              <input
                value={deliveryAddress}
                onChange={handleDeliveryAddressChange}
                placeholder="Rua, numero, bairro e cidade"
              />
            </label>
            <label className="field">
              <span>CEP</span>
              <input
                value={deliveryCep}
                onChange={handleDeliveryCepChange}
                placeholder="00000-000"
              />
            </label>
            <button type="button" className="secondary-button full compact-full" onClick={confirmDeliveryAddress}>
              Confirmar endereco e calcular frete
            </button>
            {deliveryConfirmed && (
              <small className="delivery-result">
                Frete confirmado: {calculatedShipping === 0 ? "Gratis" : formatMoney(calculatedShipping)}
              </small>
            )}
          </section>

          <label className="field">
            <span>Pagamento</span>
            <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
              {PAYMENT_METHODS.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </label>

          <div className="summary-box">
            <div><span>Subtotal</span><strong>{formatMoney(subtotal)}</strong></div>
            <div><span>Desconto</span><strong>- {formatMoney(discount)}</strong></div>
            <div>
              <span>Frete</span>
              <strong>{deliveryConfirmed ? (shipping === 0 ? "Gratis" : formatMoney(shipping)) : "Calcule o frete"}</strong>
            </div>
            <div className="summary-total"><span>Total</span><strong>{formatMoney(total)}</strong></div>
          </div>

          <button type="button" className="primary-button full" onClick={finishOrder}>
            Finalizar compra
          </button>
          {message && <p className="store-message">{message}</p>}
        </aside>
      </div>
    </section>
  );
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function calculateFakeShipping(address, cep, subtotal) {
  if (subtotal > 250) {
    return 0;
  }

  const normalizedAddress = address.toLowerCase();
  const cepPrefix = cep.replace(/\D/g, "").slice(0, 2);

  if (normalizedAddress.includes("sp") || normalizedAddress.includes("sao paulo")) {
    return 12.9;
  }

  if (normalizedAddress.includes("rj") || normalizedAddress.includes("rio de janeiro")) {
    return 18.9;
  }

  if (["01", "02", "03", "04", "05", "06", "07", "08", "09"].includes(cepPrefix)) {
    return 12.9;
  }

  if (cepPrefix === "20" || cepPrefix === "21" || cepPrefix === "22" || cepPrefix === "23" || cepPrefix === "24") {
    return 18.9;
  }

  return 24.9;
}
