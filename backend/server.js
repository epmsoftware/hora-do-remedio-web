const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pacientesRoutes = require("./routes/pacientes");
const medicamentosRoutes = require("./routes/medicamentos");
const logsRoutes = require("./routes/logs");

app.use("/api/pacientes", pacientesRoutes);
app.use("/api/medicamentos", medicamentosRoutes);
app.use("/api/logs", logsRoutes);

const PORT = 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));