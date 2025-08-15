const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const db = new sqlite3.Database('formulario.db');
const cors = require('cors');
app.use(cors()); // Permite requisições de outros domínios
app.use(bodyParser.urlencoded({ extended: true })); // Para processar dados de formulários  

app.use(bodyParser.json());
app.use(express.static('.')); // serve arquivos do front-end

// Cria tabela se não existir
db.run(`CREATE TABLE IF NOT EXISTS forms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT,
  email TEXT,
  mensagem TEXT
)`);

app.post('/send-form', (req, res) => {
  const { nome, email, mensagem } = req.body;

  const stmt = db.prepare('INSERT INTO forms (nome, email, mensagem) VALUES (?, ?, ?)');
  stmt.run(nome, email, mensagem, function(err) {
    if (err) {
      console.error(err);
      return res.json({ message: 'Erro ao salvar no banco.' });
    }
    res.json({ message: 'Formulário enviado com sucesso!' });
  });
  stmt.finalize();
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));


