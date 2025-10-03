import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const [usuario, setUsuario] = useState(null);
  const [menuAberto, setMenuAberto] = useState(false);
  const navigate = useNavigate();

  // Carregar usuário do localStorage
  useEffect(() => {
    const dados = localStorage.getItem("usuarioLogado");
    if (dados) {
      const user = JSON.parse(dados);
      setUsuario(user);
    } else {
      navigate("/"); // redireciona se não logado
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("usuarioLogado");
    navigate("/");
  };

  // Fecha o menu clicando fora
  useEffect(() => {
    const fecharMenu = (e) => {
      if (
        menuAberto &&
        !e.target.closest(".dashboard-menu") &&
        !e.target.closest(".menu-toggle")
      ) {
        setMenuAberto(false);
      }
    };
    document.addEventListener("click", fecharMenu);
    return () => document.removeEventListener("click", fecharMenu);
  }, [menuAberto]);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <button
          className="menu-toggle"
          onClick={() => setMenuAberto(!menuAberto)}
        >
          ☰
        </button>
        <h1>Hora do Remédio</h1>
      </header>

      {/* Menu lateral */}
      <nav className={`dashboard-menu ${menuAberto ? "open" : ""}`}>
        <ul>
          <li>
            <button
              onClick={() => {
                setMenuAberto(false);
                navigate("/dashboard");
              }}
            >
              Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setMenuAberto(false);
                navigate("/pacientes");
              }}
            >
              Pacientes
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setMenuAberto(false);
                alert("Usuários");
              }}
            >
              Usuários
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setMenuAberto(false);
                alert("Configurações");
              }}
            >
              Configurações
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setMenuAberto(false);
                handleLogout();
              }}
              className="logout-btn"
            >
              Sair
            </button>
          </li>
        </ul>
      </nav>

      {/* Conteúdo principal */}
      <main className="dashboard-content">
        {usuario ? (
          <>
            <h2>
              Bem-vindo,{" "}
              {usuario.displayName
                ? usuario.displayName
                : usuario.email.replace("@login.local", "")}
              !
            </h2>
            <p>Aqui você verá apenas seus dados.</p>
          </>
        ) : (
          <p>Carregando usuário...</p>
        )}
      </main>
    </div>
  );
}