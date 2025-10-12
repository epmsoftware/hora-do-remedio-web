const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./hora_remedio.db");

// Criar tabelas se não existirem
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    email TEXT,
    senha TEXT,
    foto TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS pacientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER,
    nome TEXT,
    idade INTEGER,
    peso REAL,
    altura REAL,
    email TEXT,
    telefone TEXT,
    descricao TEXT,
    FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS medicamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    paciente_id INTEGER,
    nome TEXT,
    validade TEXT,
    quantidade INTEGER,
    frequencia INTEGER,
    dosagem TEXT,
    horarios TEXT,
    descricao TEXT,
    alertaAtivo INTEGER DEFAULT 1,
    FOREIGN KEY(paciente_id) REFERENCES pacientes(id)
  )`);
});

module.exports = db;