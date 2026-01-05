require('dotenv').config();
const db = require('../db/connection');

async function seedLessons() {
  try {
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
        'INSERT INTO lessons (title, level, description) VALUES (?, ?, ?)',
        [lesson.title, lesson.level, lesson.description]
      );
    }

    console.log('✅ Seed de aulas concluído com sucesso!');
    process.exit(0);

  } catch (err) {
    console.error('❌ Erro ao rodar seed:', err);
    process.exit(1);
  }
}

seedLessons();
