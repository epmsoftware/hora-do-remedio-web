import { BrowserRouter, Routes, Route } from "react-router-dom";
import TelaInicial from "./TelaInicial";
import LoginCadastro from "./Login";
import Home from "./Home";
import ListaPacientes from "./ListaPacientes";
import CadastroPaciente from "./CadastroPaciente";
import ListaMedicamentos from "./ListaMedicamentos";
import CadastroMedicamento from "./CadastroMedicamento";
import MeioAmbiente from "./MeioAmbiente";
import Whatsapp from "./Whatsapp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TelaInicial />} />
        <Route path="/login" element={<LoginCadastro />} />
        <Route path="/home" element={<Home />} />

        <Route path="/pacientes" element={<ListaPacientes />} />
        <Route path="/cadastro" element={<CadastroPaciente />} />

        <Route path="/pacientes/:pacienteId/medicamentos" element={<ListaMedicamentos />} />
        <Route path="/pacientes/:pacienteId/medicamentos/cadastro/:medicamentoId?" element={<CadastroMedicamento />} />

        <Route path="/meioambiente" element={<MeioAmbiente />} />

        <Route path="/whatsapp" element={<Whatsapp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;