const express = require("express");
const router = express.Router();
const db = require("../db");

// Listar medicamentos de um paciente
router.get("/:pacienteId", (req, res) => {
  db.all("SELECT * FROM medicamentos WHERE paciente_id=?", [req.params.pacienteId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Adicionar/Atualizar medicamento
router.post("/", (req, res) => {
  const { id, paciente_id, nome, validade, quantidade, frequencia, dosagem, horarios, descricao, alertaAtivo } = req.body;

  if (id) {
    db.run(
      `UPDATE medicamentos SET nome=?, validade=?, quantidade=?, frequencia=?, dosagem=?, horarios=?, descricao=?, alertaAtivo=? WHERE id=?`,
      [nome, validade, quantidade, frequencia, dosagem, horarios, descricao, alertaAtivo, id],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ updated: this.changes });
      }
    );
  } else {
    db.run(
      `INSERT INTO medicamentos (paciente_id, nome, validade, quantidade, frequencia, dosagem, horarios, descricao, alertaAtivo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [paciente_id, nome, validade, quantidade, frequencia, dosagem, horarios, descricao, alertaAtivo],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID });
      }
    );
  }
});

// Deletar medicamento
router.delete("/:id", (req, res) => {
  db.run("DELETE FROM medicamentos WHERE id=?", [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

module.exports = router;