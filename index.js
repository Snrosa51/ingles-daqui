require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// =======================
// Middlewares básicos
// =======================
app.use(express.json());

// =======================
// Arquivos estáticos
// =======================
// CSS, JS, imagens (se existirem)
app.use(express.static(path.join(__dirname, 'public')));

// =======================
// Páginas públicas HTML
// =======================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views'));
});

/*app.get('/sobre', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'sobre.html'));
});

app.get('/contato', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'contato.html'));
});

app.get('/links-uteis', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'links-uteis.html'));
});
*/
// =======================
// ROTAS DA API
// =======================
app.use('/admin/api', require('./routes/adminRoutes'));
app.use('/api/lessons', require('./routes/lessonRoutes'));

// =======================
// Fallback 404
// =======================
app.use((req, res) => {
  res.status(404).send('Página não encontrada');
});

// =======================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Inglês The Key rodando na porta ${PORT}`);
});
