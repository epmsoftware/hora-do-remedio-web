import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Unificado.css";

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