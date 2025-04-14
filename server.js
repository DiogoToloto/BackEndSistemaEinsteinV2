const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 5000;

const dbPath = './db.json';

app.use(cors());
app.use(express.json());

// GET - Listar requisições
app.get('/requests', (req, res) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ erro: 'Erro ao ler os dados' });
    const jsonData = JSON.parse(data);
    res.json(jsonData.requests || []);
  });
});

// POST - Nova requisição
app.post('/requests', (req, res) => {
    const data = JSON.parse(fs.readFileSync(dbPath));
  
    // Crie um novo objeto explicitamente
    const newRequest = {
      ...req.body,
      id: Date.now(),
      status: 'pendente', // Garantir que venha preenchido
      createdAt: new Date().toISOString()
    };
  
    if (!data.requests) data.requests = [];
    data.requests.push(newRequest);
  
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    res.status(201).json(newRequest);
  });
  

// PATCH - Atualizar status
app.patch('/requests/:id', (req, res) => {
  const requestId = parseInt(req.params.id);
  const { status } = req.body;

  const data = JSON.parse(fs.readFileSync(dbPath));
  const request = data.requests.find(r => r.id === requestId);

  if (request) {
    request.status = status;
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    res.json(request);
  } else {
    res.status(404).json({ message: 'Requisição não encontrada' });
  }
});

// DELETE - Remover requisição
app.delete('/requests/:id', (req, res) => {
  const requestId = parseInt(req.params.id);
  const data = JSON.parse(fs.readFileSync(dbPath));
  const filtered = data.requests.filter(r => r.id !== requestId);

  data.requests = filtered;
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  res.status(204).end();
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
