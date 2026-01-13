// config/env.js
const path = require("path");
const dotenv = require("dotenv");

// escolhe o arquivo de env (padrão: .env)
const envFile = process.env.ENV_FILE || ".env";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

function must(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

module.exports = {
  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    // ✅ aceita DB_PASSWORD e DB_PASS
    pass: process.env.DB_PASSWORD || process.env.DB_PASS || "",
    name: process.env.DB_NAME || "",
    connLimit: Number(process.env.DB_CONN_LIMIT || 10),
  },
  jwt: {
    secret: must("JWT_SECRET"),
  },
  app: {
    port: Number(process.env.PORT || 3000),
    nodeEnv: process.env.NODE_ENV || "development",
  },
};
