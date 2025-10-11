import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
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
        !e.target.closest(".home-menu") &&
        !e.target.closest(".menu-toggle")
      ) {
        setMenuAberto(false);
      }
    };
    document.addEventListener("click", fecharMenu);
    return () => document.removeEventListener("click", fecharMenu);
  }, [menuAberto]);

  return (
    <div className="home-container">
      {/* Header moderno */}
      <header className="home-header">
        <button
          className="menu-toggle"
          onClick={() => setMenuAberto(!menuAberto)}
        >
          ☰
        </button>

        <h1>Hora do Remédio</h1>

        {usuario && (
          <div className="perfil-area">
            <img
              src={usuario.foto || "/assets/user.png"}
              alt="Foto do usuário"
              className="foto-perfil"
            />
            <span className="nome-usuario">
              {usuario.nome || "Usuário"}
            </span>
            <button onClick={handleLogout} className="logout-btn-top">
              Sair
            </button>
          </div>
        )}
      </header>

      {/* Menu lateral */}
      <nav className={`home-menu ${menuAberto ? "open" : ""}`}>
        <ul>
          <li>
            <button
              onClick={() => {
                setMenuAberto(false);
                navigate("/home");
              }}
            >
              Home
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
                navigate("/meioambiente");
              }}
            >
              Meio Ambiente
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
      <main className="home-content">
        {usuario ? (
          <>
            <h2>Bem-vindo, {usuario.nome || "Usuário"}!</h2>
            <p>Aqui você verá apenas seus dados.</p>
          </>
        ) : (
          <p>Carregando usuário...</p>
        )}
      </main>
    </div>
  );
}