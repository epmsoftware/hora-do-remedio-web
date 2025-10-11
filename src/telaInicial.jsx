import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TelaInicial.css";

export default function TelaInicial() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Frases que vão aparecer uma após a outra
  const frases = [
    "Gestão eficiente.",
    "Controle inteligente.",
    "Cuidando do meio ambiente!"
  ];

  useEffect(() => {
    const currentPhrase = frases[index];
    const typingSpeed = isDeleting ? 50 : 100;

    const timer = setTimeout(() => {
      if (!isDeleting && charIndex < currentPhrase.length) { // Digita
        setText(currentPhrase.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      } else if (isDeleting && charIndex > 4) { // não apaga até o fim
        setText(currentPhrase.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      } else if (!isDeleting && charIndex === currentPhrase.length) { // Pausa antes de iniciar a exclusão parcial
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && charIndex <= 4) { // Troca de frase sem ficar vazio
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % frases.length);
        setCharIndex(0);
        setText(""); // evita bug visual
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, index]);

  return (
    <div className="tela-inicial">
      <div className="overlay" />
      <div className="content">
        <h1 className="title">Hora do Remédio</h1>
        <p className="subtitle typing">{text}</p>

        <button className="btn" onClick={() => navigate("/login")}>
          Ir para Login
        </button>
      </div>
    </div>
  );
}