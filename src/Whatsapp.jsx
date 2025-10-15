import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Unificado.css";

export default function WhatsappPage() {
  const [pacientes, setPacientes] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [arquivo, setArquivo] = useState(null);
  const navigate = useNavigate();

  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  const userId = usuario?.uid;

  // Carrega pacientes do usuário logado
  useEffect(() => {
    if (!userId) {
      alert("Usuário não autenticado.");
      navigate("/login");
      return;
    }

    const carregarPacientes = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/pacientes/${userId}`);
        setPacientes(res.data || []);
      } catch (error) {
        console.error("Erro ao carregar pacientes:", error);
      }
    };

    carregarPacientes();
  }, [userId, navigate]);

  // Envia mensagem pelo WhatsApp Web
  const enviarMensagem = (telefone) => {
    if (!mensagem && !arquivo) {
      alert("Digite uma mensagem ou selecione um arquivo para enviar.");
      return;
    }

    const telefoneLimpo = telefone.replace(/\D/g, "");

    if (!telefoneLimpo) {
      alert("Telefone inválido.");
      return;
    }

    // Codifica a mensagem
    const texto = encodeURIComponent(mensagem || "Olá! Tudo bem?");
    const link = `https://wa.me/${telefoneLimpo}?text=${texto}`;

    window.open(link, "_blank");
  };

  // (Opcional) — Futuro: Upload de arquivo via API (por enquanto apenas simula)
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArquivo(file);
      alert(`Arquivo "${file.name}" selecionado (simulação).`);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Interação via WhatsApp</h2>

      <div style={{ width: "100%", textAlign: "left" }}>
        <p>Escolha um paciente e envie uma mensagem personalizada:</p>
        <textarea
          className="form-input form-textarea"
          placeholder="Digite sua mensagem..."
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
        />
        <input
          type="file"
          className="form-input"
          accept="image/*,.pdf,.doc,.docx"
          onChange={handleUpload}
        />
      </div>

      <h3 style={{ marginTop: "20px" }}>Pacientes Cadastrados</h3>
      {pacientes.length === 0 ? (
        <p>Nenhum paciente cadastrado.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, width: "100%" }}>
          {pacientes.map((p) => (
            <li key={p.id} className="form-card">
              <div>
                <strong>{p.nome}</strong>
                <p>
                  {p.telefone
                    ? `Telefone: ${p.telefone}`
                    : "Telefone não informado"}
                </p>
                {p.email && <p>Email: {p.email}</p>}
              </div>

              <div className="form-actions">
                <button
                  className="form-button save"
                  style={{ backgroundColor: "#25D366" }}
                  onClick={() => enviarMensagem(p.telefone)}
                >
                  Enviar WhatsApp
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="form-actions">
        <button
          className="form-button cancel"
          onClick={() => navigate("/home")}
        >
          Voltar Home
        </button>
      </div>
    </div>
  );
}