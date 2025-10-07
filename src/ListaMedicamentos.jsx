import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./cadastro.css";

// Som de alerta (arquivo local ou URL)
const ALERT_SOUND = "https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3";

export default function ListaMedicamentos() {
  const navigate = useNavigate();
  const { pacienteId } = useParams();
  const [medicamentos, setMedicamentos] = useState([]);

  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  const userId = usuario?.uid;

  const chaveMedicamentos = `medicamentos_${userId}_${pacienteId}`;

  // Função para tocar som
  const tocarSom = useCallback(() => {
    const audio = new Audio(ALERT_SOUND);
    audio.play().catch(() => { });
  }, []);

  // Função para notificação nativa
  const enviarNotificacao = useCallback((titulo, mensagem) => {
    if (Notification.permission === "granted") {
      new Notification(titulo, { body: mensagem });
      tocarSom();
    }
  }, [tocarSom]);

  const carregarMedicamentos = useCallback(() => {
    if (!userId) {
      alert("Usuário não autenticado.");
      navigate("/login");
      return;
    }

    const dados = localStorage.getItem(chaveMedicamentos);
    const lista = dados ? JSON.parse(dados) : [];
    setMedicamentos(lista);
  }, [userId, chaveMedicamentos, navigate]);

  // 1) Carrega medicamentos ao abrir a tela
  useEffect(() => {
    carregarMedicamentos();
  }, [carregarMedicamentos]);

  // 2) Solicita permissão de notificação apenas uma vez
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // 3) Verifica alertas a cada 1 minuto
  useEffect(() => {
    const intervalo = setInterval(() => {
      medicamentos.forEach((m) => {
        if (!m.alertaAtivo) return;

        // Verifica validade (3 dias antes)
        if (m.validade) {
          const hoje = new Date();
          const validade = new Date(m.validade);
          const diffDias = Math.ceil((validade - hoje) / (1000 * 60 * 60 * 24));
          if (diffDias <= 3 && diffDias >= 0) {
            enviarNotificacao(
              `Validade próxima - ${m.nome}`,
              `O medicamento ${m.nome} vence em ${diffDias} dia(s)!`
            );
          }
        }

        // Verifica horário (ex: "08:00, 14:00, 20:00")
        if (m.horarios) {
          const agora = new Date();
          const horaAtual = `${String(agora.getHours()).padStart(2, "0")}:${String(
            agora.getMinutes()
          ).padStart(2, "0")}`;
          const horarios = m.horarios.split(",").map((h) => h.trim());

          if (horarios.includes(horaAtual)) {
            enviarNotificacao(
              `Hora do remédio - ${m.nome}`,
              `Está na hora de tomar ${m.nome} (${m.dosagem}).`
            );
          }
        }
      });
    }, 60000); // 1 minuto

    return () => clearInterval(intervalo);
  }, [medicamentos, enviarNotificacao]);

  const excluirMedicamento = (id) => {
    if (!window.confirm("Deseja realmente excluir este medicamento?")) return;
    const listaAtualizada = medicamentos.filter((m) => m.id !== id);
    localStorage.setItem(chaveMedicamentos, JSON.stringify(listaAtualizada));
    setMedicamentos(listaAtualizada);
  };

  const toggleAlerta = (id) => {
    const listaAtualizada = medicamentos.map((m) =>
      m.id === id ? { ...m, alertaAtivo: !m.alertaAtivo } : m
    );
    localStorage.setItem(chaveMedicamentos, JSON.stringify(listaAtualizada));
    setMedicamentos(listaAtualizada);
  };

  // Corrige diferença de 1 dia no fuso horário
  const formatarDataLocal = (dataISO) => {
    const data = new Date(dataISO);
    // compensar diferença de fuso horário local
    data.setMinutes(data.getMinutes() + data.getTimezoneOffset());
    return data.toLocaleDateString("pt-BR");
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Lista de Medicamentos</h2>

      {medicamentos.length === 0 && <p>Nenhum medicamento cadastrado.</p>}

      {medicamentos.map((m) => (
        <div key={m.id} className="form-card">
          <strong>{m.nome}</strong>{" "}
          {m.validade && (
            <p>Validade: {formatarDataLocal(m.validade)}</p>
          )}
          <p>Dosagem: {m.dosagem}</p>
          <p>Quantidade: {m.quantidade}</p>
          <p>Frequência: {m.frequencia}h</p>
          {m.horarios && <p>Horários: {m.horarios}</p>}
          {m.descricao && <p>Descrição: {m.descricao}</p>}

          <label className="switch-label">
            <span>Alerta:</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={m.alertaAtivo}
                onChange={() => toggleAlerta(m.id)}
              />
              <span className="slider"></span>
            </label>
          </label>

          <div className="form-actions">
            <button
              className="form-button save"
              onClick={() =>
                navigate(`/pacientes/${pacienteId}/medicamentos/cadastro/${m.id}`)
              }
            >
              Editar
            </button>
            <button
              className="form-button cancel"
              style={{ backgroundColor: "red" }}
              onClick={() => excluirMedicamento(m.id)}
            >
              Excluir
            </button>
          </div>
        </div>
      ))}

      <button
        className="form-button save"
        onClick={() => navigate(`/pacientes/${pacienteId}/medicamentos/cadastro`)}
      >
        Novo Medicamento
      </button>

      <button
        className="form-button cancel"
        onClick={() => navigate("/pacientes")}
      >
        Voltar Pacientes
      </button>
    </div>
  );
}