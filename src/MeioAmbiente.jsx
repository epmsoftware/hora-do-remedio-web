import React from "react";
import { useNavigate } from "react-router-dom";
import "./MeioAmbiente.css";

export default function MeioAmbiente() {
   const navigate = useNavigate();

  return (
    <div className="meioambiente-container">
      <header className="header">
        <i
          className="fas fa-arrow-left voltar-icon"
          title="Voltar"
          onClick={() => navigate(-1)}
        ></i>

        <button className="home-btn" onClick={() => navigate("/home")}>
          <i className="fas fa-home"></i> <span>Voltar à Home</span>
        </button>
      </header>

      <h1 className="titulo">
        Assista o vídeo e veja como descartar de maneira correta
      </h1>

      <video
        controls
        className="video"
      >
        <source
          src="assets/Saiba como descartar remédios sem uso e onde encontrar os pontos de coleta.mp4"
          type="video/mp4"
        />
        Seu navegador não suporta o elemento de vídeo.
      </video>

      <section className="section2">
        <img src="/assets/descarte.png" alt="Imagem de descarte" className="imagem-descarte" />
        <p>
          <strong>Não descarte no lixo comum, pia ou vaso sanitário:</strong> Esses métodos podem contaminar o
          solo e os recursos hídricos, além de representar risco à saúde pública.
          <br /><br />
          <strong>Procure pontos de coleta autorizados:</strong> Farmácias, drogarias e unidades de saúde
          costumam disponibilizar pontos de coleta para medicamentos vencidos ou em desuso.
        </p>
      </section>

      <section className="ferramentas">
        <h2>Ferramentas Úteis</h2>
        <p>
          • <strong>Descarte Consciente:</strong> Plataforma que indica farmácias participantes do programa de
          coleta de medicamentos. Acesse em{" "}
          <a href="https://www.descarteconsciente.com.br" target="_blank" rel="noreferrer">
            https://www.descarteconsciente.com.br
          </a>
        </p>
        <br />
        <p>
          • <strong>LogMed:</strong> Plataforma que lista pontos de coleta em todo o Brasil. Acesse{" "}
          <a href="https://www.logmed.org.br/" target="_blank" rel="noreferrer">
            www.logmed.org.br
          </a>
        </p>
      </section>

      <footer className="footer">
        <p>&copy; 2025 Hora do Remédio.</p>
      </footer>
    </div>
  );
}