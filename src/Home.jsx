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
  const [graficoPacientes, setGraficoPacientes] = useState(null);
  const [graficoMedicamentos, setGraficoMedicamentos] = useState(null);
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

      // 1) pega pacientes do usuário (esta rota já existe)
      const pacientesRes = await axios.get(`http://localhost:3001/api/pacientes/${userId}`);
      const pacientesData = pacientesRes.data || [];

      // grava os pacientes imediatamente (evita sumir a lista se a busca de medicamentos falhar)
      setPacientes(pacientesData);

      // 2) para cada paciente, busca medicamentos pela rota existente /api/medicamentos/:pacienteId
      //    usa Promise.all para executar as requisições em paralelo
      const reqs = pacientesData.map((p) =>
        axios
          .get(`http://localhost:3001/api/medicamentos/${p.id}`)
          .then((res) => res.data)
          .catch((err) => {
            console.warn(`Erro ao carregar medicamentos do paciente ${p.id}:`, err.message || err);
            return []; // retorna array vazio em caso de erro para não quebrar Promise.all
          })
      );

      const medicamentosPorPaciente = await Promise.all(reqs);
      // medicamentosPorPaciente é um array de arrays -> achata para um só array
      const todosMedicamentos = medicamentosPorPaciente.flat();

      setMedicamentos(todosMedicamentos);

      // 3) gera gráfico: labels = nomes dos pacientes, dados = qtd de medicamentos por paciente
      // 🔹 Gráfico 1: Medicamentos por Paciente
        const labelsPacientes = pacientesData.map((p) => p.nome);
        const dadosPacientes = pacientesData.map(
          (p) =>
            medicamentosPorPaciente.find(
              (_, idx) => pacientesData[idx].id === p.id
            )?.length || 0
        );

        setGraficoPacientes({
          labels: labelsPacientes,
          datasets: [
            {
              label: "Medicamentos por Paciente",
              data: dadosPacientes,
              backgroundColor: "#1976d2",
            },
          ],
        });

        // 🔹 Gráfico 2: Quantidade de Medicamentos por Nome
        const contagemPorNome = {};
        todosMedicamentos.forEach((m) => {
          contagemPorNome[m.nome] = (contagemPorNome[m.nome] || 0) + 1;
        });

        const labelsNomes = Object.keys(contagemPorNome);
        const dadosNomes = Object.values(contagemPorNome);

        setGraficoMedicamentos({
          labels: labelsNomes,
          datasets: [
            {
              label: "Quantidade por Nome de Medicamento",
              data: dadosNomes,
              backgroundColor: "#4caf50",
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

            {/* Gráficos */}
            <section className="grafico-area">
              <h3>Medicamentos por Paciente</h3>
              {graficoPacientes ? <Bar data={graficoPacientes} /> : <p>Carregando...</p>}

              <h3 style={{ marginTop: "2rem" }}>Quantidade por Nome de Medicamento</h3>
              {graficoMedicamentos ? <Bar data={graficoMedicamentos} /> : <p>Carregando...</p>}
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