import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./Unificado.css";

// Som de alerta (arquivo local ou URL)
const ALERT_SOUND = "/assets/notificacao.mp3";

export default function ListaMedicamentos() {
  const navigate = useNavigate();
  const { pacienteId } = useParams();
  const [medicamentos, setMedicamentos] = useState([]);

  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  const userId = usuario?.uid;

  // Função para tocar som
  const tocarSom = useCallback(() => {
    const audio = new Audio(ALERT_SOUND);
    audio.play().catch(() => { });
  }, []);

  // Função para notificação nativa
  const enviarNotificacao = useCallback((titulo, mensagem) => {
    if (Notification.permission === "granted") {
      new Notification(titulo, { body: mensagem,
        silent: true // Desativa o som nativo da notificação
       });
      tocarSom(); // Toca apenas o som local
    }
  }, [tocarSom]);

  // Carrega medicamentos do backend
  const carregarMedicamentos = useCallback(async () => {
    if (!userId) {
      alert("Usuário não autenticado.");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get(`http://localhost:3001/api/medicamentos/${pacienteId}`);
      setMedicamentos(res.data);
    } catch (error) {
      console.error("Erro ao carregar medicamentos:", error);
      setMedicamentos([]);
    }
  }, [userId, pacienteId, navigate]);

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
    const alarmesAtivos = {};
    
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

          horarios.forEach((horario) => {
            const chave = `${m.id}_${horario}`;

            // Se chegou o horário e o alarme ainda não está ativo
            if (horaAtual === horario && !alarmesAtivos[chave]) {
              enviarNotificacao(
                `Hora do remédio - ${m.nome}`,
                `Está na hora de tomar ${m.nome} (${m.dosagem}).`
              );

              // Toca e repete o alerta a cada 1 minuto (ou altere para 3 min se quiser)
              let contador = 1;
              const repetidor = setInterval(() => {
                if (contador >= 20 || !m.alertaAtivo) {
                  // para após 60 repetições (~1 hora)
                  clearInterval(repetidor);
                  delete alarmesAtivos[chave];
                  return;
                }

                enviarNotificacao(
                  `Lembrete - ${m.nome}`,
                  `Ainda está na hora de tomar ${m.nome} (${m.dosagem}).`
                );

                contador++;
              }, 3 * 60 * 1000); // repete a cada 3 minuto

              // marca alarme ativo
              alarmesAtivos[chave] = repetidor;
            }
          });
        }
      });
    }, 60 * 1000); // verifica a cada 1 minuto

    return () => {
      clearInterval(intervalo);
      Object.values(alarmesAtivos).forEach(clearInterval);
    };
  }, [medicamentos, enviarNotificacao]);

  // Excluir medicamento
  const excluirMedicamento = async (id) => {
    if (!window.confirm("Deseja realmente excluir este medicamento?")) return;
    try {
      await axios.delete(`http://localhost:3001/api/medicamentos/${id}`);
      setMedicamentos(medicamentos.filter((m) => m.id !== id));
    } catch (error) {
      console.error("Erro ao excluir medicamento:", error);
      alert("Não foi possível excluir o medicamento.");
    }
  };

 // Alternar alerta ativo
  const toggleAlerta = async (id) => {
    const medicamento = medicamentos.find((m) => m.id === id);
    if (!medicamento) return;

    try {
      await axios.post("http://localhost:3001/api/medicamentos", {
        ...medicamento,
        alertaAtivo: medicamento.alertaAtivo ? 0 : 1,
      });

      setMedicamentos(
        medicamentos.map((m) =>
          m.id === id ? { ...m, alertaAtivo: m.alertaAtivo ? 0 : 1 } : m
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar alerta:", error);
      alert("Não foi possível atualizar o alerta.");
    }
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