require('dotenv').config(); // OK manter (não quebra)
const bcrypt = require('bcryptjs');
const db = require('../db/connection');

async function seedAdmin() {
  console.log('🔐 Iniciando seed do admin...');

  const username = 'Snrosa';
  const password = 'DevSnrosa20@1973';

  // gera hash seguro
  const hash = await bcrypt.hash(password, 10);

  // garante tabela admins
  await db.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB
      DEFAULT CHARSET=utf8mb4
      COLLATE=utf8mb4_unicode_ci;
  `);

  // insere admin apenas se não existir
  const [result] = await db.query(
    `
    INSERT INTO admins (username, password_hash)
    SELECT ?, ?
    WHERE NOT EXISTS (
      SELECT 1 FROM admins WHERE username = ?
    )
    `,
    [username, hash, username]
  );

  if (result.affectedRows === 0) {
    console.log(`ℹ️ Admin '${username}' já existia — nada foi alterado`);
  } else {
    console.log(`✅ Admin '${username}' criado com sucesso`);
  }

  process.exit(0);
}

seedAdmin().catch(err => {
  console.error('❌ Erro no seedAdmin:', err);
  process.exit(1);
});
