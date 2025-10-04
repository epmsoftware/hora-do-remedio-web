import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./cadastro.css"; // importa o CSS unificado

export default function ListaMedicamentos() {
  const navigate = useNavigate();
  const { pacienteId } = useParams();
  const [medicamentos, setMedicamentos] = useState([]);

  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  const userId = usuario?.uid;

  const chaveMedicamentos = `medicamentos_${userId}_${pacienteId}`;

  const carregarMedicamentos = () => {
    if (!userId) {
      alert("Usuário não autenticado.");
      navigate("/login");
      return;
    }

    const dados = localStorage.getItem(chaveMedicamentos);
    const lista = dados ? JSON.parse(dados) : [];
    setMedicamentos(lista);
  };

  useEffect(() => {
    carregarMedicamentos();
  }, []);

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

  return (
    <div className="form-container">
      <h2 className="form-title">Lista de Medicamentos</h2>

      {medicamentos.length === 0 && <p>Nenhum medicamento cadastrado.</p>}

      {medicamentos.map((m) => (
        <div key={m.id} className="form-card">
          <strong>{m.nome}</strong> {m.validade && <p>Validade: {new Date(m.validade).toLocaleDateString("pt-BR")}</p>}
          <p>Dosagem: {m.dosagem}</p>
          <p>Quantidade: {m.quantidade}</p>
          <p>Frequência: {m.frequencia}h</p>
          {m.horarios && <p>Horários: {m.horarios}</p>}
          {m.descricao && <p>Descrição: {m.descricao}</p>}

          <label>
            Alerta:
            <input
              type="checkbox"
              checked={m.alertaAtivo}
              onChange={() => toggleAlerta(m.id)}
            />
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
        onClick={() =>
          navigate(`/pacientes/${pacienteId}/medicamentos/cadastro`)
        }
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