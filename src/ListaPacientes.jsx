import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./pacientes.css";

export default function ListaPacientes() {
  const [pacientes, setPacientes] = useState([]);
  const navigate = useNavigate();

  const carregarPacientes = () => {
    const dados = localStorage.getItem("pacientes");
    setPacientes(dados ? JSON.parse(dados) : []);
  };

  useEffect(() => {
    carregarPacientes();
  }, []);

  const excluirPaciente = (id) => {
    if (!window.confirm("Deseja excluir este paciente?")) return;
    const lista = pacientes.filter((p) => p.id !== id);
    localStorage.setItem("pacientes", JSON.stringify(lista));
    setPacientes(lista);
  };

  return (
    <div className="container">
      <h2>Lista de Pacientes</h2>

      {pacientes.length === 0 ? (
        <p>Nenhum paciente cadastrado.</p>
      ) : (
        <ul>
          {pacientes.map((p) => (
            <li key={p.id} className="card">
              <div>
                <strong>{p.nome}</strong>
                <p>Idade: {p.idade} | Peso: {p.peso} kg | Altura: {p.altura} m</p>
                {p.email && <p>Email: {p.email}</p>}
                {p.telefone && <p>Telefone: {p.telefone}</p>}
                {p.descricao && <p>Obs: {p.descricao}</p>}
              </div>
              <div>
                <button onClick={() => navigate("/cadastro", { state: { paciente: p } })}>
                  Editar
                </button>
                <button onClick={() => excluirPaciente(p.id)}>Excluir</button>
              </div>
              <button
                onClick={() => navigate(`/pacientes/${p.id}/medicamentos`)}
                //style={{ ...btnStyle, backgroundColor: "#1e90ff" }}
              >
                Medicamentos
              </button>
            </li>
          ))}
        </ul>
      )}

      <button onClick={() => navigate("/cadastro")}>Novo Paciente</button>
      <button onClick={() => navigate("/dashboard")}>Voltar ao Dashboard</button>
    </div>
  );
}