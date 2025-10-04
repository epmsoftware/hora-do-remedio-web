import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./cadastro.css";

export default function CadastroMedicamento() {
  const { pacienteId, medicamentoId } = useParams();
  const navigate = useNavigate();

  const [medicamentos, setMedicamentos] = useState([]);
  const [nome, setNome] = useState("");
  const [validade, setValidade] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [frequencia, setFrequencia] = useState("");
  const [dosagem, setDosagem] = useState("");
  const [horarios, setHorarios] = useState("");
  const [descricao, setDescricao] = useState("");

  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  const userId = usuario?.uid;

  const chaveMedicamentos = `medicamentos_${userId}_${pacienteId}`;

  useEffect(() => {
  if (!userId) {
    alert("Usuário não autenticado.");
    navigate("/login");
    return;
  }

  if (!pacienteId) {
    alert("Paciente não especificado.");
    navigate("/pacientes");
    return;
  }

  const dados = localStorage.getItem(chaveMedicamentos);
  let lista = [];

  try {
    lista = dados ? JSON.parse(dados) : [];
  } catch (error) {
    console.error("Erro ao ler medicamentos do localStorage:", error);
    lista = [];
  }

  setMedicamentos(lista);

  if (medicamentoId) {
    const med = lista.find((m) => m.id.toString() === medicamentoId.toString());
    if (med) {
      setNome(med.nome);
      setValidade(med.validade);
      setQuantidade(med.quantidade);
      setFrequencia(med.frequencia);
      setDosagem(med.dosagem);
      setHorarios(med.horarios);
      setDescricao(med.descricao);
    }
  }
}, [medicamentoId, userId, pacienteId, chaveMedicamentos]);

  const handleSalvar = () => {
    if (!nome || !quantidade || !frequencia || !dosagem) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    const novoMedicamento = {
      id: medicamentoId || Date.now().toString(),
      pacienteId,
      nome,
      validade,
      quantidade,
      frequencia,
      dosagem,
      horarios,
      descricao,
      alertaAtivo: true,
    };

    // Atualiza lista: remove antigo se estiver editando
    const listaAtualizada = medicamentos.filter((m) => m.id !== novoMedicamento.id);
    listaAtualizada.push(novoMedicamento);

    localStorage.setItem(chaveMedicamentos, JSON.stringify(listaAtualizada));
    alert("Medicamento salvo com sucesso!");
    navigate(`/pacientes/${pacienteId}/medicamentos`);
  };

  return (
    <div className="form-container">
      <h2 className="form-title">
        {medicamentoId ? "Editar Medicamento" : "Cadastro de Medicamento"}
      </h2>

      <input
        className="form-input"
        type="text"
        placeholder="Nome *"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />

      <input
        className="form-input"
        type="date"
        value={validade}
        onChange={(e) => setValidade(e.target.value)}
      />

      <input
        className="form-input"
        type="number"
        placeholder="Quantidade *"
        value={quantidade}
        onChange={(e) => setQuantidade(e.target.value)}
      />

      <input
        className="form-input"
        type="number"
        placeholder="Frequência (em horas) *"
        value={frequencia}
        onChange={(e) => setFrequencia(e.target.value)}
      />

      <input
        className="form-input"
        type="text"
        placeholder="Dosagem *"
        value={dosagem}
        onChange={(e) => setDosagem(e.target.value)}
      />

      <input
        className="form-input"
        type="text"
        placeholder="Horários (ex: 08:00, 14:00, 20:00)"
        value={horarios}
        onChange={(e) => setHorarios(e.target.value)}
      />

      <textarea
        className="form-input form-textarea"
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      />

      <div className="form-actions">
        <button className="form-button save" onClick={handleSalvar}>
          Salvar
        </button>
        <button
          className="form-button cancel"
          onClick={() => navigate(`/pacientes/${pacienteId}/medicamentos`)}
        >
          Voltar
        </button>
      </div>
    </div>
  );
}