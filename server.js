const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database(path.join(__dirname, 'formulario.db'), (err) => {
  if (err) return console.error(err.message);
  console.log('Conectado ao banco SQLite.');
});

db.run(`
  CREATE TABLE IF NOT EXISTS contatos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    email TEXT
  )
`);

app.post('/send-form', (req, res) => {
  const { nome, email } = req.body;
  const query = 'INSERT INTO contatos (nome, email) VALUES (?, ?)';
  db.run(query, [nome, email], function(err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: 'Erro ao enviar mensagem.' });
    }
    res.json({ message: 'Mensagem enviada com sucesso!' });
  });
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
