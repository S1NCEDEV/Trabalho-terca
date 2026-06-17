import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const initialRegisterData = {
  name: "",
  email: "",
  cpf: "",
  phone: "",
  address: "",
  password: "123456"
};

export function LoginPage({ clients = [], setClients }) {
  const { login } = useAuth();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("admin@sportfit.com");
  const [password, setPassword] = useState("123456");
  const [registerData, setRegisterData] = useState(initialRegisterData);
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const result = login(email, password, clients);
    setMessage(result.ok ? "" : result.message);
  }

  function handleRegisterChange(event) {
    const { name, value } = event.target;
    setRegisterData((currentData) => ({ ...currentData, [name]: value }));
  }

  async function handleRegister(event) {
    event.preventDefault();

    const missingField = Object.entries(registerData).find(([, value]) => !String(value || "").trim());
    if (missingField) {
      setMessage("Preencha todos os campos para criar sua conta.");
      return;
    }

    if (registerData.password.trim() !== "123456") {
      setMessage("Use a senha de teste 123456 para criar a conta.");
      return;
    }

    const cleanEmail = registerData.email.trim().toLowerCase();
    const emailAlreadyExists = clients.some((client) => client.email.toLowerCase() === cleanEmail);
    if (emailAlreadyExists || cleanEmail === "admin@sportfit.com") {
      setMessage("Este e-mail ja esta cadastrado.");
      return;
    }

    const newClient = {
      id: `cli-${crypto.randomUUID()}`,
      name: registerData.name.trim(),
      email: cleanEmail,
      cpf: registerData.cpf.trim(),
      phone: registerData.phone.trim(),
      address: registerData.address.trim(),
      status: "Ativo"
    };

    const nextClients = [...clients, newClient];
    await setClients(nextClients);
    setRegisterData(initialRegisterData);
    setEmail(cleanEmail);
    setPassword(registerData.password.trim());
    setMode("login");
    const result = login(cleanEmail, registerData.password, nextClients);
    setMessage(result.ok ? "" : result.message);
  }

  function changeMode(nextMode) {
    setMode(nextMode);
    setMessage("");
  }

  return (
    <main className="login-page">
      <section className="login-hero">
        <div className="brand-mark">SF</div>
        <h1>SportFit Store</h1>
      </section>

      <section className="login-card">
        <div className="login-mode-switch">
          <button type="button" className={mode === "login" ? "active" : ""} onClick={() => changeMode("login")}>
            Entrar
          </button>
          <button type="button" className={mode === "register" ? "active" : ""} onClick={() => changeMode("register")}>
            Criar conta
          </button>
        </div>

        {mode === "login" ? (
          <form onSubmit={handleSubmit}>
            <h2>Acesso ao sistema</h2>
            <label className="field">
              <span>E-mail</span>
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>
            <label className="field">
              <span>Senha</span>
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            </label>
            {message && <p className="error-message">{message}</p>}
            <button type="submit" className="primary-button full">
              Entrar
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <h2>Cadastro de cliente</h2>
            <label className="field">
              <span>Nome completo</span>
              <input name="name" value={registerData.name} onChange={handleRegisterChange} />
            </label>
            <label className="field">
              <span>E-mail</span>
              <input name="email" type="email" value={registerData.email} onChange={handleRegisterChange} />
            </label>
            <label className="field">
              <span>CPF</span>
              <input name="cpf" value={registerData.cpf} onChange={handleRegisterChange} />
            </label>
            <label className="field">
              <span>Telefone</span>
              <input name="phone" value={registerData.phone} onChange={handleRegisterChange} />
            </label>
            <label className="field">
              <span>Endereco</span>
              <input name="address" value={registerData.address} onChange={handleRegisterChange} />
            </label>
            <label className="field">
              <span>Senha</span>
              <input name="password" type="password" value={registerData.password} onChange={handleRegisterChange} />
            </label>
            {message && <p className="error-message">{message}</p>}
            <button type="submit" className="primary-button full">
              Cadastrar e entrar
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
