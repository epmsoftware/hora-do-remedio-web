import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Unificado.css";

export default function CadastroPaciente() {
  const navigate = useNavigate();
  const location = useLocation();

  const pacienteEdit = location.state?.paciente || null;

  /*const [pacientes, setPacientes] = useState([]);*/
  const [nome, setNome] = useState(pacienteEdit?.nome || "");
  const [idade, setIdade] = useState(pacienteEdit?.idade || "");
  const [peso, setPeso] = useState(pacienteEdit?.peso || "");
  const [altura, setAltura] = useState(pacienteEdit?.altura || "");
  const [email, setEmail] = useState(pacienteEdit?.email || "");
  const [telefone, setTelefone] = useState(pacienteEdit?.telefone || "");
  const [descricao, setDescricao] = useState(pacienteEdit?.descricao || "");

  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  const userId = usuario?.uid;

  /*const chavePacientes = `pacientes_${userId}`;*/

  useEffect(() => {
    if (!userId) {
      alert("Usuário não autenticado.");
      navigate("/login");
    }
  }, [userId, navigate]);

  // Função para aplicar máscara (exibição)
  const formatarTelefone = (valor) => {
    if (!valor) return "";
    valor = valor.replace(/\D/g, "");
    if (valor.length <= 10)
      return valor.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    else return valor.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
  };

  const handleTelefoneChange = (e) => {
    const valor = e.target.value.replace(/\D/g, "");
    setTelefone(formatarTelefone(valor));
  };

  const handleSalvar = async () => {
    if (!nome || !idade || !peso || !altura) {
      alert("Preencha os campos obrigatórios!");
      return;
    }

    // Converter telefone mascarado para formato internacional (para WhatsApp)
    const telefoneLimpo = telefone.replace(/\D/g, "");
    const telefoneWhatsApp =
      telefoneLimpo.length >= 10 ? `55${telefoneLimpo}` : "";

    if (telefoneWhatsApp && telefoneWhatsApp.length < 12) {
      alert("Telefone inválido. Exemplo: (11) 99999-8888");
      return;
    }

    const pacienteData = {
      id: pacienteEdit?.id || undefined,
      usuario_id: userId,
      nome,
      idade,
      peso,
      altura,
      email,
      telefone: telefoneWhatsApp, // salvo já no formato 5511999998888
      descricao,
    };

    try {
      await axios.post("http://localhost:3001/api/pacientes", pacienteData);
      alert("Paciente salvo com sucesso!");
      navigate("/pacientes");
    } catch (error) {
      console.error("Erro ao salvar paciente:", error);
      alert("Erro ao salvar paciente!");
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Cadastro de Paciente</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSalvar();
        }}
      >
        <input type="text" className="form-input" placeholder="Nome completo *" value={nome} onChange={(e) => setNome(e.target.value)} />
        <input type="number" className="form-input" placeholder="Idade *" value={idade} onChange={(e) => setIdade(e.target.value)} />
        <input type="number" className="form-input" placeholder="Peso (kg) *" value={peso} onChange={(e) => setPeso(e.target.value)} />
        <input type="number" className="form-input" placeholder="Altura (m) *" value={altura} onChange={(e) => setAltura(e.target.value)} />
        <input type="email" className="form-input" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="text" className="form-input" placeholder="Telefone (ex: (11) 99999-8888)" value={telefone} onChange={handleTelefoneChange} maxLength={15} />
        <textarea className="form-input form-textarea" placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
        <div className="form-actions">
          <button type="submit" className="form-button save">Salvar</button>
          <button type="button" className="form-button cancel" onClick={() => navigate("/pacientes")}>Voltar</button>
        </div>
      </form>
    </div>
  );
}