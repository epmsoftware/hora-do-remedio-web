const express = require("express");
const router = express.Router();
const db = require("../db");

// Listar logs do usuário
router.get("/:usuarioId", (req, res) => {
  db.all("SELECT * FROM logs WHERE usuario_id=? ORDER BY datahora DESC LIMIT 10", [req.params.usuarioId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Adicionar log
router.post("/", (req, res) => {
  const { usuario_id, descricao } = req.body;
  const datahora = new Date().toISOString();
  db.run("INSERT INTO logs (usuario_id, descricao, datahora) VALUES (?, ?, ?)", [usuario_id, descricao, datahora], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

module.exports = router;