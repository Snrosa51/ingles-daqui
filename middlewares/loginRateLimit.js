const rateLimit = require('express-rate-limit');

const loginRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 5, // 5 tentativas por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Muitas tentativas de login. Tente novamente em 5 minutos."
  }
});

module.exports = loginRateLimit;
