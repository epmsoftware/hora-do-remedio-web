import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ListaMedicamentos() {
  const navigate = useNavigate();
  const { pacienteId } = useParams();
  const [medicamentos, setMedicamentos] = useState([]);

  const carregarMedicamentos = () => {
    const dados = localStorage.getItem("medicamentos");
    const lista = dados ? JSON.parse(dados) : [];
    const listaFiltrada = lista.filter((m) => m.pacienteId === pacienteId);
    setMedicamentos(listaFiltrada);
  };

  useEffect(() => {
    carregarMedicamentos();
  }, []);

  const excluirMedicamento = (id) => {
    if (!window.confirm("Deseja realmente excluir este medicamento?")) return;
    const listaAtualizada = medicamentos.filter((m) => m.id !== id);
    localStorage.setItem("medicamentos", JSON.stringify(listaAtualizada));
    setMedicamentos(listaAtualizada);
  };

  const toggleAlerta = (id) => {
    const listaAtualizada = medicamentos.map((m) =>
      m.id === id ? { ...m, alertaAtivo: !m.alertaAtivo } : m
    );
    localStorage.setItem("medicamentos", JSON.stringify(listaAtualizada));
    setMedicamentos(listaAtualizada);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
      <h2>Lista de Medicamentos</h2>
      {medicamentos.length === 0 && <p>Nenhum medicamento cadastrado.</p>}

      {medicamentos.map((m) => (
        <div key={m.id} style={{ border: "1px solid #ccc", borderRadius: "10px", padding: "10px", marginBottom: "10px" }}>
          <strong>{m.nome}</strong> {m.validade && `(Validade: ${m.validade})`}
          <p>Dosagem: {m.dosagem}</p>
          <p>Quantidade: {m.quantidade}</p>
          <p>Frequência: {m.frequencia}h</p>
          {m.horarios && <p>Horários: {m.horarios}</p>}
          {m.descricao && <p>Descrição: {m.descricao}</p>}
          <label>
            Alerta:
            <input type="checkbox" checked={m.alertaAtivo} onChange={() => toggleAlerta(m.id)} />
          </label>
          <div style={{ marginTop: "10px" }}>
            <button onClick={() => navigate(`/pacientes/${pacienteId}/medicamentos/cadastro/${m.id}`)} style={{ marginRight: "10px" }}>
              Editar
            </button>
            <button onClick={() => excluirMedicamento(m.id)} style={{ backgroundColor: "red", color: "white" }}>
              Excluir
            </button>
          </div>
        </div>
      ))}

      <button onClick={() => navigate(`/pacientes/${pacienteId}/medicamentos/cadastro`)} style={{ marginTop: "20px" }}>
        Novo Medicamento
      </button>
      <button onClick={() => navigate("/pacientes")} style={{ marginTop: "10px" }}>
        Voltar Pacientes
      </button>
    </div>
  );
}