require('dotenv').config();
const db = require('../db/connection');

async function seedLessonContent() {
  try {
    // Exemplo: conteúdo para a lição ID = 1 (Simple Present)
    const content = `
<h3>📘 Explicação</h3>
<p>O Simple Present é usado para hábitos, rotinas e fatos gerais.</p>

<h3>🗣️ Exemplos</h3>
<ul>
  <li>I work every day.</li>
  <li>She studies English.</li>
  <li>They live in Brazil.</li>
</ul>

<h3>🎧 Pronúncia</h3>
<audio controls src="/audio/simple-present.mp3"></audio>

<h3>📝 Exercício</h3>
<p>Complete: She ___ (work) here.</p>
`;

    const lessonId = 1;

    await db.query(
      `
      UPDATE lessons
      SET content = ?
      WHERE id = ?
      `,
      [content, lessonId]
    );

    console.log('✅ Conteúdo da lição atualizado com sucesso');
    process.exit(0);

  } catch (err) {
    console.error('❌ Erro ao rodar seedLessonContent:', err);
    process.exit(1);
  }
}

seedLessonContent();
