// db/connection.js
const mysql = require("mysql2/promise");
const env = require("../config/env");

const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.pass,
  database: env.db.name,

  waitForConnections: true,
  connectionLimit: env.db.connLimit || 10,
  queueLimit: 0,

  // Datas em formato legível
  dateStrings: true,
 // ✅ IMPORTANTE: desliga TLS/SSL dentro da rede Docker (evita erro do certificado autoassinado)
  ssl: false,
  // (Opcional) se precisar de timezone:
  //timezone: "Z",
});

async function testConnection() {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log("✅ MySQL conectado com sucesso (pool)!");
  } catch (err) {
    console.error("❌ Falha ao conectar no MySQL:", err.message);
    // Em produção, você geralmente quer encerrar para o deploy falhar “alto”
    process.exit(1);
  }
}

// Helper simples pra queries (melhora ergonomia do projeto)
async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

module.exports = {
  pool,
  query,
  testConnection,
};

