require('dotenv').config();
const db = require('../db/connection');

async function seedLessons() {
  try {
    console.log('📘 Iniciando seed de aulas...');

    // 1️⃣ Garante que a tabela existe
    await db.query(`
      CREATE TABLE IF NOT EXISTS lessons (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL UNIQUE,
        level VARCHAR(10) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB
      DEFAULT CHARSET=utf8mb4
      COLLATE=utf8mb4_unicode_ci;
    `);

    // 2️⃣ Aulas padrão
    const lessons = [
      {
        title: 'Inglês Básico – Cumprimentos',
        level: 'A1',
        description: 'Aprenda cumprimentos básicos em inglês.'
      },
      {
        title: 'Verbo To Be',
        level: 'A1',
        description: 'Uso do verbo to be no presente simples.'
      },
      {
        title: 'Simple Present',
        level: 'A2',
        description: 'Estrutura e uso do Simple Present.'
      }
    ];

    // 3️⃣ Insere somente se não existir
    for (const lesson of lessons) {
      await db.query(
        `
        INSERT INTO lessons (title, level, description)
        SELECT ?, ?, ?
        WHERE NOT EXISTS (
          SELECT 1 FROM lessons WHERE title = ?
        )
        `,
        [lesson.title, lesson.level, lesson.description, lesson.title]
      );
    }

    console.log('✅ Seed de aulas criado/verificado com sucesso');
    process.exit(0);

  } catch (err) {
    console.error('❌ Erro no seedLessons:', err);
    process.exit(1);
  }
}

seedLessons();
