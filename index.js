require('dotenv').config();
const express = require('express');
const path = require('path');
const logger = require('./middlewares/logger');

const lessonRoutes = require('./routes/lessonRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
app.use(express.json());
app.use(logger);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/lessons', lessonRoutes);
app.use('/admin/api', adminRoutes);

app.get('/', (_, res) => res.sendFile(path.join(__dirname, 'views/index.html')));
app.get('/admin', (_, res) => res.sendFile(path.join(__dirname, 'views/admin.html')));

app.listen(process.env.PORT, () =>
  console.log(`Inglês Daqui rodando na porta ${process.env.PORT}`)
);
