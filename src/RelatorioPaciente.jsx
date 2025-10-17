import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import "./Unificado.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function RelatorioPaciente() {
  const [pacientes, setPacientes] = useState([]);
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [medicamentos, setMedicamentos] = useState([]);
  const navigate = useNavigate();

  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  const userId = usuario?.id || usuario?.uid;

  useEffect(() => {
    if (!userId) {
      alert("Usuário não autenticado.");
      navigate("/");
      return;
    }

    // Carregar lista de pacientes do usuário
    const carregarPacientes = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/pacientes/${userId}`);
        setPacientes(res.data);
      } catch (error) {
        console.error("Erro ao carregar pacientes:", error);
      }
    };

    carregarPacientes();
  }, [userId, navigate]);

  // Carregar medicamentos do paciente selecionado
  const carregarMedicamentos = async (id) => {
    setPacienteSelecionado(pacientes.find((p) => p.id === Number(id)));
    try {
      const res = await axios.get(`http://localhost:3001/api/medicamentos/${id}`);
      setMedicamentos(res.data);
    } catch (error) {
      console.error("Erro ao carregar medicamentos:", error);
    }
  };

  // Gerar relatórios
  const gerarPDF = async () => {
    if (!pacienteSelecionado) return alert("Selecione um paciente!");
    window.open(`http://localhost:3001/api/relatorio/${pacienteSelecionado.id}/pdf`, "_blank");
  };

  const gerarExcel = async () => {
    if (!pacienteSelecionado) return alert("Selecione um paciente!");
    window.open(`http://localhost:3001/api/relatorio/${pacienteSelecionado.id}/excel`, "_blank");
  };

  // Gráfico — Quantidade de medicamentos por paciente
  const graficoBarra = {
    labels: medicamentos.map((m) => m.nome),
    datasets: [
      {
        label: "Quantidade",
        data: medicamentos.map((m) => m.quantidade || 0),
        backgroundColor: "#1976d2",
      },
    ],
  };

  // Gráfico — Distribuição de frequências
  const graficoPizza = {
    labels: medicamentos.map((m) => m.nome),
    datasets: [
      {
        label: "Frequência (h)",
        data: medicamentos.map((m) => m.frequencia || 0),
        backgroundColor: [
          "#1976d2",
          "#43a047",
          "#fbc02d",
          "#e53935",
          "#8e24aa",
          "#039be5",
        ],
      },
    ],
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Relatório de Pacientes e Medicamentos</h2>

      <div className="form-group">
        <label>Selecione um paciente:</label>
        <select
          className="form-input"
          onChange={(e) => carregarMedicamentos(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>
            Escolher paciente...
          </option>
          {pacientes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </select>
      </div>

      {pacienteSelecionado && (
        <>
          <div className="card-relatorio">
            <h3>Informações do Paciente</h3>
            <p><strong>Nome:</strong> {pacienteSelecionado.nome}</p>
            <p><strong>Idade:</strong> {pacienteSelecionado.idade} anos</p>
            <p><strong>Peso:</strong> {pacienteSelecionado.peso} kg</p>
            <p><strong>Altura:</strong> {pacienteSelecionado.altura} m</p>
            <p><strong>Email:</strong> {pacienteSelecionado.email || "-"}</p>
            <p><strong>Telefone:</strong> {pacienteSelecionado.telefone || "-"}</p>
            <p><strong>Descrição:</strong> {pacienteSelecionado.descricao || "Sem observações"}</p>
          </div>

          <div className="card-relatorio">
            <h3>Medicamentos</h3>
            {medicamentos.length > 0 ? (
              <ul>
                {medicamentos.map((m) => (
                  <li key={m.id}>
                    <strong>{m.nome}</strong> — {m.dosagem || "-"} ({m.frequencia}h)
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhum medicamento cadastrado.</p>
            )}
          </div>

          {/* Gráficos */}
          {/*{medicamentos.length > 0 && (
            <div className="grafico-container">
              <div className="grafico-item">
                <h4>Quantidade por Medicamento</h4>
                <Bar data={graficoBarra} />
              </div>

              <div className="grafico-item">
                <h4>Frequência dos Medicamentos</h4>
                <Pie data={graficoPizza} />
              </div>
            </div>
          )}*/}

          {/* Botões de exportação */}
        <div className="form-actions">
          <button onClick={gerarPDF} className="form-button save">
            Exportar PDF
          </button>
          <button onClick={gerarExcel} className="form-button save">
            Exportar Excel
          </button>
        </div>
      </>
    )}

    {/* <-- este botão aparece sempre */}
    <div className="form-actions">
      <button
        className="form-button cancel"
        onClick={() => navigate("/home")}
      >
        Voltar Home
      </button>
    </div>
  </div>
)}