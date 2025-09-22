import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css"; // vamos criar o CSS separado

export default function Dashboard() {
  const [usuario, setUsuario] = useState(null);
  const [menuAberto, setMenuAberto] = useState(false);
  const navigate = useNavigate();

  // Carregar usuário do localStorage
  useEffect(() => {
    const dados = localStorage.getItem("usuarioLogado");
    if (dados) setUsuario(JSON.parse(dados));
    else navigate("/"); // redireciona se não logado
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("usuarioLogado");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <button className="menu-toggle" onClick={() => setMenuAberto(!menuAberto)}>
          ☰
        </button>
        <h1>Hora do Remédio</h1>
      </header>

      {/* Menu lateral */}
      <nav className={`dashboard-menu ${menuAberto ? "open" : ""}`}>
        <ul>
          <li>
            <button onClick={() => {
                setMenuAberto(false);
                navigate("/dashboard");
            }} >Dashboard
            </button>
          </li>
          <li>
            <button onClick={() => {
                setMenuAberto(false);
                alert("Pacientes");
            }} >Pacientes
            </button>
          </li>
          <li>
            <button onClick={() => {
                setMenuAberto(false);
                alert("Usuários");
            }}>Usuários
            </button>
          </li>
          <li>
            <button onClick={() => {
                setMenuAberto(false);
                alert("Configurações");
            }}>Configurações
            </button>
          </li>
          <li>
            <button onClick={() => {
                setMenuAberto(false);
                handleLogout();
            }}    
            className="logout-btn">Sair
            </button>
          </li>
        </ul>
      </nav>

      {/* Conteúdo principal */}
      <main className="dashboard-content">
        {usuario ? (
          <>
            <h2>Bem-vindo,{" "} 
            {usuario.displayName
            ? usuario.displayName
            : usuario.email.replace("@login.local", "")}!</h2>
            <p>Aqui você verá apenas seus dados.</p>
          </>
        ) : (
          <p>Carregando usuário...</p>
        )}
      </main>
    </div>
  );
}