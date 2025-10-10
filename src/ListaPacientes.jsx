import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Unificado.css";

export default function ListaPacientes() {
  const [pacientes, setPacientes] = useState([]);
  const navigate = useNavigate();

  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  const userId = usuarioLogado?.uid;

  useEffect(() => {
    if (!userId) {
      alert("Usuário não autenticado.");
      navigate("/login");
      return;
    }

    const chave = `pacientes_${userId}`;
    const dados = localStorage.getItem(chave);

    try {
      setPacientes(dados ? JSON.parse(dados) : []);
    } catch (e) {
      console.error("Erro ao carregar pacientes:", e);
      setPacientes([]);
    }
  }, [userId, navigate]);

  const excluirPaciente = (id) => {
    if (!window.confirm("Deseja excluir este paciente?")) return;

    const chave = `pacientes_${userId}`;
    const listaAtualizada = pacientes.filter((p) => p.id.toString() !== id.toString());

    localStorage.setItem(chave, JSON.stringify(listaAtualizada));
    setPacientes(listaAtualizada);
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Lista de Pacientes</h2>

      {pacientes.length === 0 ? (
        <p>Nenhum paciente cadastrado.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, width: "100%" }}>
          {pacientes.map((p) => (
            <li key={p.id} className="form-card">
              <div>
                <strong>{p.nome}</strong>
                <p>
                  Idade: {p.idade} | Peso: {p.peso} kg | Altura: {p.altura} m
                </p>
                {p.email && <p>Email: {p.email}</p>}
                {p.telefone && <p>Telefone: {p.telefone}</p>}
                {p.descricao && <p>Obs: {p.descricao}</p>}
              </div>

              <div className="form-actions">
                <button
                  className="form-button save"
                  onClick={() => navigate("/cadastro", { state: { paciente: p } })}
                >
                  Editar
                </button>

                <button
                  className="form-button cancel"
                  style={{ backgroundColor: "red" }}
                  onClick={() => excluirPaciente(p.id)}
                >
                  Excluir
                </button>

                <button
                  className="form-button save"
                  style={{ backgroundColor: "green" }}
                  onClick={() => navigate(`/pacientes/${p.id}/medicamentos`)}
                >
                  Medicamentos
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="form-actions">
        <button className="form-button save" onClick={() => navigate("/cadastro")}>
          Novo Paciente
        </button>
        <button className="form-button cancel" onClick={() => navigate("/home")}>
          Voltar ao Home
        </button>
      </div>
    </div>
  );
}