import { BrowserRouter, Routes, Route } from "react-router-dom";
import TelaInicial from "./telaInicial";
import LoginCadastro from "./Login";
import Dashboard from "./Dashboard";
import ListaPacientes from "./ListaPacientes";
import CadastroPaciente from "./CadastroPaciente";
import ListaMedicamentos from "./ListaMedicamentos";
import CadastroMedicamento from "./CadastroMedicamento";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TelaInicial />} />
        <Route path="/login" element={<LoginCadastro />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/pacientes" element={<ListaPacientes />} />
        <Route path="/cadastro" element={<CadastroPaciente />} />

        <Route path="/pacientes/:pacienteId/medicamentos" element={<ListaMedicamentos />} />
        <Route path="/pacientes/:pacienteId/medicamentos/cadastro/:medicamentoId?" element={<CadastroMedicamento />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;