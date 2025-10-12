import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./Unificado.css";

export default function CadastroMedicamento() {
  const { pacienteId, medicamentoId } = useParams();
  const navigate = useNavigate();

  /*const [medicamentos, setMedicamentos] = useState([]);*/
  const [nome, setNome] = useState("");
  const [validade, setValidade] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [frequencia, setFrequencia] = useState("");
  const [dosagem, setDosagem] = useState("");
  const [horarios, setHorarios] = useState("");
  const [descricao, setDescricao] = useState("");

 /* const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  const userId = usuario?.uid;

  const chaveMedicamentos = `medicamentos_${userId}_${pacienteId}`;
  */
  
  useEffect(() => {
    if (medicamentoId) {
      axios.get(`http://localhost:3001/api/medicamentos/${pacienteId}`)
        .then(res => {
          const med = res.data.find(m => m.id.toString() === medicamentoId.toString());
          if (med) {
            setNome(med.nome);
            setValidade(med.validade);
            setQuantidade(med.quantidade);
            setFrequencia(med.frequencia);
            setDosagem(med.dosagem);
            setHorarios(med.horarios);
            setDescricao(med.descricao);
          }
        })
        .catch(err => console.error(err));
    }
  }, [medicamentoId, pacienteId]);

  const handleSalvar = async () => {
    if (!nome || !quantidade || !frequencia || !dosagem) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    const medData = {
      id: medicamentoId || undefined,
      paciente_id: pacienteId,
      nome,
      validade,
      quantidade,
      frequencia,
      dosagem,
      horarios,
      descricao,
      alertaAtivo: 1,
    };

    try {
      await axios.post("http://localhost:3001/api/medicamentos", medData);
      alert("Medicamento salvo com sucesso!");
      navigate(`/pacientes/${pacienteId}/medicamentos`);
    } catch (error) {
      console.error("Erro ao salvar medicamento:", error);
      alert("Erro ao salvar medicamento!");
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">{medicamentoId ? "Editar Medicamento" : "Cadastro de Medicamento"}</h2>
      <input className="form-input" type="text" placeholder="Nome *" value={nome} onChange={(e) => setNome(e.target.value)} />
      <input className="form-input" type="date" value={validade} onChange={(e) => setValidade(e.target.value)} />
      <input className="form-input" type="number" placeholder="Quantidade *" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
      <input className="form-input" type="number" placeholder="Frequência (em horas) *" value={frequencia} onChange={(e) => setFrequencia(e.target.value)} />
      <input className="form-input" type="text" placeholder="Dosagem *" value={dosagem} onChange={(e) => setDosagem(e.target.value)} />
      <input className="form-input" type="text" placeholder="Horários (ex: 08:00, 14:00, 20:00)" value={horarios} onChange={(e) => setHorarios(e.target.value)} />
      <textarea className="form-input form-textarea" placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
      <div className="form-actions">
        <button className="form-button save" onClick={handleSalvar}>Salvar</button>
        <button className="form-button cancel" onClick={() => navigate(`/pacientes/${pacienteId}/medicamentos`)}>Voltar</button>
      </div>
    </div>
  );
}