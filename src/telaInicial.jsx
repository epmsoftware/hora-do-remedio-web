import React from "react";
import { useNavigate } from "react-router-dom";
import "./TelaInicial.css"; // CSS separado

export default function TelaInicial() {
  const navigate = useNavigate();

  return (
    <div className="tela-inicial">
      <div className="overlay" />
      <div className="content">
        <h1 className="title">Hora do Remédio</h1>
        <p className="subtitle">Gestão, Controle, Meio Ambiente!</p>

        <button className="btn" onClick={() => navigate("/login")}>
          Ir para Login
        </button>
      </div>
    </div>
  );
}