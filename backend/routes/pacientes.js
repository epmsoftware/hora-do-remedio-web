const express = require("express");
const router = express.Router();
const db = require("../db");

// Listar pacientes
router.get("/:usuarioId", (req, res) => {
  const usuarioId = req.params.usuarioId;
  db.all("SELECT * FROM pacientes WHERE usuario_id = ?", [usuarioId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Adicionar/Atualizar paciente
router.post("/", (req, res) => {
  const { id, usuario_id, nome, idade, peso, altura, email, telefone, descricao } = req.body;

  if (id) {
    db.run(
      `UPDATE pacientes SET nome=?, idade=?, peso=?, altura=?, email=?, telefone=?, descricao=? WHERE id=?`,
      [nome, idade, peso, altura, email, telefone, descricao, id],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ updated: this.changes });
      }
    );
  } else {
    db.run(
      `INSERT INTO pacientes (usuario_id, nome, idade, peso, altura, email, telefone, descricao)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [usuario_id, nome, idade, peso, altura, email, telefone, descricao],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID });
      }
    );
  }
});

// Deletar paciente
router.delete("/:id", (req, res) => {
  db.run("DELETE FROM pacientes WHERE id=?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

module.exports = router;