// config/env.js
const path = require("path");
const dotenv = require("dotenv");

// escolhe o arquivo de env (padrão: .env)
const envFile = process.env.ENV_FILE || ".env";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

// config/env.js
function must(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function opt(name, def = "") {
  return process.env[name] ?? def;
}

module.exports = {
  app: {
    port: Number(opt("PORT", 3000)),
    nodeEnv: opt("NODE_ENV", "development"),
  },

  db: {
    host: opt("DB_HOST", "127.0.0.1"),
    port: Number(opt("DB_PORT", 3306)),
    user: must("DB_USER"),
    // ✅ aceita DB_PASSWORD e DB_PASS (compatibilidade)
    pass: opt("DB_PASSWORD") || opt("DB_PASS") || "",
    name: must("DB_NAME"),
    connLimit: Number(opt("DB_CONN_LIMIT", 10)),
  },

  auth: {
    jwtSecret: must("JWT_SECRET"),
    adminToken: opt("ADMIN_TOKEN", ""),
    adminUser: opt("ADMIN_USER", ""),
    adminPassword: opt("ADMIN_PASSWORD", ""),
  },
};
