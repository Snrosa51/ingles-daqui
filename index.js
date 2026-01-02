require('dotenv').config();
const express = require('express');
const path = require('path');
const logger = require('./middlewares/logger');

const lessonRoutes = require('./routes/lessonRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(logger);

// arquivos estáticos (ADMIN + CSS + JS)
app.use(express.static(path.join(__dirname, 'public')));

// APIs públicas
app.use('/api/lessons', lessonRoutes);

// APIs administrativas (JWT)
app.use('/admin/api', adminRoutes);

// site público
app.get('/', (_, res) =>
  res.sendFile(path.join(__dirname, 'views/index.html'))
);

// redireciona /admin para login
app.get('/admin', (_, res) => {
  res.redirect('/admin/login.html');
});

app.listen(PORT,'0.0.0.0', () =>
  console.log(`Inglês Daqui rodando na porta ${PORT}`)
);
