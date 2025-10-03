import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function CadastroMedicamento() {
  const navigate = useNavigate();
  const { pacienteId, medicamentoId } = useParams();

  const [medicamentos, setMedicamentos] = useState([]);
  const [nome, setNome] = useState("");
  const [validade, setValidade] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [frequencia, setFrequencia] = useState("");
  const [dosagem, setDosagem] = useState("");
  const [horarios, setHorarios] = useState("");
  const [descricao, setDescricao] = useState("");

  // Carregar medicamentos
  useEffect(() => {
    const dados = localStorage.getItem("medicamentos");
    const lista = dados ? JSON.parse(dados) : [];
    setMedicamentos(lista);

    // Se for edição
    if (medicamentoId) {
      const m = lista.find((med) => med.id === medicamentoId);
      if (m) {
        setNome(m.nome);
        setValidade(m.validade);
        setQuantidade(m.quantidade);
        setFrequencia(m.frequencia);
        setDosagem(m.dosagem);
        setHorarios(m.horarios);
        setDescricao(m.descricao);
      }
    }
  }, [medicamentoId]);

  const handleSalvar = () => {
    if (!nome || !quantidade || !frequencia || !dosagem) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    const novoMedicamento = {
      id: medicamentoId || Date.now().toString(),
      nome,
      validade,
      quantidade,
      frequencia,
      dosagem,
      horarios,
      descricao,
      pacienteId,
      alertaAtivo: true,
    };

    const listaAtualizada = medicamentos.filter((m) => m.id !== novoMedicamento.id);
    listaAtualizada.push(novoMedicamento);
    localStorage.setItem("medicamentos", JSON.stringify(listaAtualizada));

    alert("Medicamento salvo com sucesso!");
    navigate(`/pacientes/${pacienteId}/medicamentos`);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <h2>{medicamentoId ? "Editar Medicamento" : "Novo Medicamento"}</h2>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Nome *"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="date"
          value={validade}
          onChange={(e) => setValidade(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="number"
          placeholder="Quantidade *"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="number"
          placeholder="Frequência (em horas) *"
          value={frequencia}
          onChange={(e) => setFrequencia(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Dosagem *"
          value={dosagem}
          onChange={(e) => setDosagem(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Horários (ex: 08:00, 14:00, 20:00)"
          value={horarios}
          onChange={(e) => setHorarios(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <textarea
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          style={{ width: "100%", padding: "8px", height: "80px" }}
        />
      </div>

      <button onClick={handleSalvar} style={{ padding: "10px 20px", marginRight: "10px" }}>
        Salvar
      </button>
      <button onClick={() => navigate(`/pacientes/${pacienteId}/medicamentos`)} style={{ padding: "10px 20px" }}>
        Voltar
      </button>
    </div>
  );
}