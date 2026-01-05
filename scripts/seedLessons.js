require('dotenv').config();
const db = require('../db');

async function seedLessons() {
  const lessons = [
    {
      title: 'Introdução ao Inglês',
      level: 'A1',
      description: 'Primeiros contatos com o inglês básico.'
    },
    {
      title: 'Verbo To Be',
      level: 'A1',
      description: 'Uso do verbo to be no presente simples.'
    },
    {
      title: 'Simple Present',
      level: 'A2',
      description: 'Formação de frases afirmativas e negativas.'
    }
  ];

  for (const lesson of lessons) {
    await db.query(
      `INSERT INTO lessons (title, level, description)
       SELECT ?, ?, ?
       WHERE NOT EXISTS (
         SELECT 1 FROM lessons WHERE title = ?
       )`,
      [lesson.title, lesson.level, lesson.description, lesson.title]
    );
  }

  console.log('✅ Seed de aulas concluído');
  process.exit();
}

seedLessons().catch(err => {
  console.error('❌ Erro no seed:', err);
  process.exit(1);
});
