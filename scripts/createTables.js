require("./_loadEnv");
const db = require('../db/connection');

async function createTables() {
  try {
    console.log('📦 Criando tabela lessons...');

    await db.query(`
      CREATE TABLE IF NOT EXISTS lessons (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        level VARCHAR(10) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Tabela lessons pronta');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro ao criar tabelas:', err);
    process.exit(1);
  }
}

createTables();
