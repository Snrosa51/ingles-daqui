require("./_loadEnv");
const db = require('../db/connection');

async function seedLessons() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS lessons (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        level VARCHAR(10) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_lesson (title, level)
      )
    `);

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

    for (const lesson of lessons) {
      await db.query(
        `
        INSERT INTO lessons (title, level, description)
VALUES (?, ?, ?)
ON DUPLICATE KEY UPDATE
description = VALUES(description);
        `,
        [
          lesson.title,
          lesson.level,
          lesson.description,
          lesson.title,
          lesson.level
        ]
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

