
/* =========================
   ENV (ANTES DE TUDO)
========================= */
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(process.cwd(), envFile) });
const envFile = process.env.ENV_FILE || ".env";

console.log("ENV_FILE =", process.env.ENV_FILE);
console.log("NODE_ENV =", process.env.NODE_ENV);
console.log("DB_HOST =", process.env.DB_HOST);

/* =========================
   CONFIG CENTRALIZADA
========================= */
const env = require("./config/env");

/* =========================
   DEPENDÊNCIAS
========================= */
const express = require("express");

/* =========================
   APP
========================= */
const app = express();
const { testConnection } = require("./db/connection");
/* =========================
   MIDDLEWARES BÁSICOS
========================= */
app.use(express.json());

/* =========================
   ARQUIVOS ESTÁTICOS
========================= */
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));

/* =========================
   ROTAS DA API
========================= */
app.use("/admin/api", require("./routes/adminRoutes"));
app.use("/api/lessons", require("./routes/lessonRoutes"));

/* =========================
   FALLBACK 404
========================= */
app.use((req, res) => {
  res.status(404).send("Página não encontrada");
});

/* =========================
   START SERVER (ÚNICO!)
========================= */
(async () => {
  await testConnection();

app.listen(env.app.port, "0.0.0.0", () => {
  console.log(
    `✅ Inglês Daqui rodando | PORT=${env.app.port} | ENV=${env.app.nodeEnv}`
  );
  });
})();
