require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../db/connection');

async function seedAdmin() {
  const username = 'Snrosa';
  const password = 'DevSnrosa20@1973';

  const hash = await bcrypt.hash(password, 10);

  await db.query(
    `INSERT INTO admins (username, password_hash)
     SELECT ?, ?
     WHERE NOT EXISTS (
       SELECT 1 FROM admins WHERE username = ?
     )`,
    [username, hash, username]
  );

  console.log('✅ Admin seed criado/confirmado');
  process.exit(0);
}

seedAdmin().catch(err => {
  console.error('❌ Erro no seedAdmin:', err);
  process.exit(1);
});
