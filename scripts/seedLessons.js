require('dotenv').config();
const db = require('../db/connection');

async function seedContent() {
  await db.query(`
    UPDATE lessons
    SET content = ?
    WHERE title = 'Simple Present'
  `, [`
<h3>📘 Explicação</h3>
<p>O Simple Present é usado para hábitos e rotinas.</p>

<h3>🗣️ Exemplos</h3>
<ul>
  <li>I work every day.</li>
  <li>She studies English.</li>
</ul>

<h3>🎧 Pronúncia</h3>
<audio controls src="/audio/simple-present.mp3"></audio>

<h3>📝 Exercício</h3>
<p>Complete: She ___ (work) here.</p>
`]);

  console.log('✅ Conteúdo da lição atualizado');
  process.exit(0);
}

seedContent();
