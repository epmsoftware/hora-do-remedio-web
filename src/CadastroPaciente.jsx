import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function CadastroPaciente() {
  const navigate = useNavigate();
  const location = useLocation();

  const pacienteEdit = location.state?.paciente || null;

  const [pacientes, setPacientes] = useState([]);
  const [nome, setNome] = useState(pacienteEdit?.nome || "");
  const [idade, setIdade] = useState(pacienteEdit?.idade || "");
  const [peso, setPeso] = useState(pacienteEdit?.peso || "");
  const [altura, setAltura] = useState(pacienteEdit?.altura || "");
  const [email, setEmail] = useState(pacienteEdit?.email || "");
  const [telefone, setTelefone] = useState(pacienteEdit?.telefone || "");
  const [descricao, setDescricao] = useState(pacienteEdit?.descricao || "");

  useEffect(() => {
    const dados = localStorage.getItem("pacientes");
    if (dados) setPacientes(JSON.parse(dados));
  }, []);

  const handleSalvar = () => {
    if (!nome || !idade || !peso || !altura) {
      alert("Preencha os campos obrigatórios!");
      return;
    }

    const novoPaciente = {
      id: pacienteEdit?.id || Date.now().toString(),
      nome,
      idade,
      peso,
      altura,
      email,
      telefone,
      descricao,
    };

    const listaAtualizada = pacientes.filter(p => p.id !== novoPaciente.id);
    listaAtualizada.push(novoPaciente);

    localStorage.setItem("pacientes", JSON.stringify(listaAtualizada));
    alert("Paciente salvo com sucesso!");
    navigate("/pacientes");
  };

  return (
    <div className="container">
      <h2>Cadastro de Paciente</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSalvar();
        }}
      >
        <input
          type="text"
          placeholder="Nome completo *"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          type="number"
          placeholder="Idade *"
          value={idade}
          onChange={(e) => setIdade(e.target.value)}
        />
        <input
          type="number"
          placeholder="Peso (kg) *"
          value={peso}
          onChange={(e) => setPeso(e.target.value)}
        />
        <input
          type="number"
          placeholder="Altura (m) *"
          value={altura}
          onChange={(e) => setAltura(e.target.value)}
        />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />
        <textarea
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        ></textarea>

        <button type="submit">Salvar</button>
        <button type="button" onClick={() => navigate("/pacientes")}>
          Voltar
        </button>
      </form>
    </div>
  );
}