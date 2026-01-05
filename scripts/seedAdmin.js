require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../db/connection');

async function seedAdmin() {
  const username = 'Snrosa';
  const password = 'DevSnrosa20@1973';

  const hash = await bcrypt.hash(password, 10);

  await db.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(
    `INSERT INTO admins (username, password_hash)
     SELECT ?, ?
     WHERE NOT EXISTS (
       SELECT 1 FROM admins WHERE username = ?
     )`,
    [username, hash, username]
  );

  console.log('✅ Admin seed criado/verificado com sucesso');
  process.exit(0);
}

seedAdmin().catch(err => {
  console.error('❌ Erro no seedAdmin:', err);
  process.exit(1);
});
