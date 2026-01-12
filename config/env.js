function must(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Variável de ambiente ausente: ${name}`);
  return v;
}

module.exports = {
  app: {
    port: Number(process.env.PORT || 3000),
    nodeEnv: process.env.NODE_ENV || "development",
    logLevel: process.env.LOG_LEVEL || "dev",
  },
  db: {
    host: must("DB_HOST"),
    port: Number(process.env.DB_PORT || 3306),
    user: must("DB_USER"),
    pass: must("DB_PASS"),
    name: must("DB_NAME"),
  },
  auth: {
    jwtSecret: must("JWT_SECRET"),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  },
  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
    max: Number(process.env.RATE_LIMIT_MAX || 100),
  }
};
