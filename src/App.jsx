import React, { useEffect, useMemo, useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { Layout } from "./components/Layout.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { CrudPage } from "./pages/CrudPage.jsx";
import { ClientPortalPage } from "./pages/ClientPortalPage.jsx";
import { ReportPage } from "./pages/ReportPage.jsx";
import { categoryFields, clientFields, couponFields, productFields } from "./data/forms.js";
import {
  initialCategories,
  initialClients,
  initialCoupons,
  initialOrders,
  initialPayments,
  initialProducts
} from "./data/seed.js";
import { useFirestoreCollection } from "./hooks/useFirestoreCollection.js";
import { getFallbackProductPhoto } from "./services/productPhotoApi.js";

function StoreApp() {
  const { user } = useAuth();
  const [activePage, setActivePage] = useState("dashboard");
  const [categories, setCategories, firebaseStatus] = useFirestoreCollection("categories", initialCategories);
  const [clients, setClients] = useFirestoreCollection("clients", initialClients);
  const [products, setProducts] = useFirestoreCollection("products", initialProducts);
  const [coupons, setCoupons] = useFirestoreCollection("coupons", initialCoupons);
  const [orders, setOrders] = useFirestoreCollection("orders", initialOrders);
  const [payments, setPayments] = useFirestoreCollection("payments", initialPayments);

  useEffect(() => {
    const hasOldProducts = products.some((product) => !product.imageUrl || !product.description || !product.favorite);

    if (hasOldProducts) {
      setProducts((currentProducts) =>
        currentProducts.map((product, index) => {
          const fallbackProduct = initialProducts[index % initialProducts.length];
          return {
            ...product,
            description: product.description || fallbackProduct.description,
            imageUrl: product.imageUrl || fallbackProduct.imageUrl || getFallbackProductPhoto(index),
            favorite: product.favorite || fallbackProduct.favorite
          };
        })
      );
    }
  }, [products, setProducts]);

  const categoryOptions = useMemo(
    () => categories.map((category) => ({ value: category.id, label: category.name })),
    [categories]
  );

  const productFormFields = useMemo(
    () => productFields(categoryOptions),
    [categoryOptions]
  );

  if (!user) {
    return <LoginPage clients={clients} setClients={setClients} />;
  }

  if (user.role === "client") {
    return (
      <ClientPortalPage
        products={products}
        categories={categories}
        clients={clients}
        coupons={coupons}
        orders={orders}
        payments={payments}
        setOrders={setOrders}
        setPayments={setPayments}
      />
    );
  }

  return (
    <Layout activePage={activePage} onNavigate={setActivePage}>
      <div className="firebase-status">{firebaseStatus}</div>

      {activePage === "dashboard" && (
        <DashboardPage
          categories={categories}
          products={products}
          clients={clients}
          coupons={coupons}
          orders={orders}
          onNavigate={setActivePage}
        />
      )}

      {activePage === "categories" && (
        <CrudPage
          title="Categorias"
          description="Organize as linhas de roupas esportivas vendidas pela loja."
          storageKey="category"
          fields={categoryFields}
          records={categories}
          setRecords={setCategories}
        />
      )}

      {activePage === "products" && (
        <CrudPage
          title="Produtos"
          description="Cadastre, edite e remova os itens do catalogo da SportFit Store."
          storageKey="product"
          fields={productFormFields}
          records={products}
          setRecords={setProducts}
        />
      )}

      {activePage === "clients" && (
        <CrudPage
          title="Clientes"
          description="Gerencie os dados de cliente presentes no diagrama: CPF, telefone, endereco e status."
          storageKey="client"
          fields={clientFields}
          records={clients}
          setRecords={setClients}
        />
      )}

      {activePage === "coupons" && (
        <CrudPage
          title="Cupons"
          description="Controle codigos promocionais, percentual de desconto, validade e status."
          storageKey="coupon"
          fields={couponFields}
          records={coupons}
          setRecords={setCoupons}
        />
      )}

      {activePage === "report" && (
        <ReportPage
          products={products}
          categories={categories}
          clients={clients}
          coupons={coupons}
          orders={orders}
          payments={payments}
        />
      )}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StoreApp />
    </AuthProvider>
  );
}
