import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import "./Home.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Home() {
  const [usuario, setUsuario] = useState(null);
  const [menuAberto, setMenuAberto] = useState(false);
  const [pacientes, setPacientes] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);
  const [grafico, setGrafico] = useState(null);
  const navigate = useNavigate();

  // Carregar usuário do Firebase (armazenado localmente)
  useEffect(() => {
    const dados = localStorage.getItem("usuarioLogado");
    if (dados) {
      const user = JSON.parse(dados);
      setUsuario(user);
    } else {
      navigate("/"); // redireciona se não logado
    }
  }, [navigate]);

  // Função para logout
  const handleLogout = () => {
    localStorage.removeItem("usuarioLogado");
    navigate("/");
  };

  // Função auxiliar: fecha o menu e navega
  const irPara = (rota) => {
    setMenuAberto(false);
    navigate(rota);
  };

  // Fecha o menu clicando fora
  useEffect(() => {
    const fecharMenu = (e) => {
      if (
        menuAberto &&
        !e.target.closest(".home-menu") &&
        !e.target.closest(".menu-toggle")
      ) {
        setMenuAberto(false);
      }
    };
    document.addEventListener("click", fecharMenu);
    return () => document.removeEventListener("click", fecharMenu);
  }, [menuAberto]);

  // Carregar pacientes e medicamentos do usuário logado
  useEffect(() => {
    if (!usuario) return;

    const carregarDados = async () => {
      try {
        const userId = usuario?.uid || usuario?.id;

        const pacientesRes = await axios.get(`http://localhost:3001/api/pacientes/${userId}`);
        const pacientesData = pacientesRes.data || [];

        setPacientes(pacientesData);

        const reqs = pacientesData.map((p) =>
          axios
            .get(`http://localhost:3001/api/medicamentos/${p.id}`)
            .then((res) => res.data)
            .catch((err) => {
              console.warn(`Erro ao carregar medicamentos do paciente ${p.id}:`, err.message || err);
              return [];
            })
        );

        const medicamentosPorPaciente = await Promise.all(reqs);
        
        const todosMedicamentos = medicamentosPorPaciente.flat();

        setMedicamentos(todosMedicamentos);

        // Gera gráfico: labels = nomes dos pacientes, dados = qtd de medicamentos por paciente
        const labels = pacientesData.map((p) => p.nome);
        const dados = pacientesData.map(
          (p) => (medicamentosPorPaciente.find((arr, idx) => pacientesData[idx].id === p.id) || []).length
        );

        setGrafico({
          labels,
          datasets: [
            {
              label: "Medicamentos por Paciente",
              data: dados,
              backgroundColor: "#1976d2",
            },
          ],
        });
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    carregarDados();
  }, [usuario]);

  // Acessibilidade (modo alto contraste)
  const toggleAcessibilidade = () => {
    document.body.classList.toggle("alto-contraste");
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <button className="menu-toggle" onClick={() => setMenuAberto(!menuAberto)}>
          ☰
        </button>

        <div className="home-header-text">
          <h1>Hora do Remédio</h1>
          <p>Gerenciamento de Pacientes</p>
        </div>

        {usuario && (
          <div className="perfil-area">
            <img src={usuario.foto || "/assets/user.png"} alt="Foto do usuário" className="foto-perfil" />
            <span className="nome-usuario">{usuario.nome || "Usuário"}</span>

            {/*<button onClick={handleLogout} className="logout-btn-top">
              Sair
            </button>*/}

          </div>
        )}
      </header>

      {/* Menu lateral */}
      <nav className={`home-menu ${menuAberto ? "open" : ""}`}>
        <ul>
          <li><button onClick={() => irPara("/home")}>Home</button></li>
          <li><button onClick={() => irPara("/pacientes")}>Pacientes</button></li>
          <li><button onClick={() => irPara("/meioambiente")}>Meio Ambiente</button></li>
          <li><button onClick={() => { setMenuAberto(false); alert("Função de Configurações em breve"); }}>Configurações</button></li>
          <li><button onClick={handleLogout} className="logout-btn">Sair</button></li>
        </ul>
      </nav>

      {/* Conteúdo principal */}
      <main className="home-content">
        {usuario ? (
          <>
            <h2>Bem-vindo, {usuario.nome || "Usuário"}!</h2>

            {/* Cards resumo */}
            <div className="cards-resumo">
              <div className="card">
                <h3>Pacientes</h3>
                <p>{pacientes.length}</p>
              </div>
              <div className="card">
                <h3>Medicamentos</h3>
                <p>{medicamentos.length}</p>
              </div>
            </div>

            {/* Gráfico simples */}
            <section className="grafico-area">
              <h3>Medicamentos por Paciente</h3>
              {grafico ? (
                <Bar data={grafico} />
              ) : (
                <p>Carregando gráfico...</p>
              )}
            </section>

            {/* Acessibilidade */}
            <button className="btn-acessibilidade" onClick={toggleAcessibilidade}>
              ♿ Acessibilidade
            </button>

          </>
        ) : (
          <p>Carregando usuário...</p>
        )}
      </main>
    </div>
  );
}