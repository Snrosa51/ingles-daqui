// scripts/seedLessonsFull.js
// Uso: docker compose exec app node scripts/seedLessonsFull.js

const { query } = require("../db/connection");

const lessons = [
  {
    id: 1,
    title: "Inglês Básico – Cumprimentos",
    level: "A1",
    description: "Aprenda cumprimentos básicos em inglês.",
    content: `
<h3>📘 Explicação</h3>
<p>Cumprimentos são frases usadas para iniciar conversas de forma educada.</p>

<h3>🗣️ Exemplos</h3>
<ul>
  <li>Hello! (Olá!)</li>
  <li>Good morning! (Bom dia!)</li>
  <li>How are you? (Como você está?)</li>
</ul>

<h3>📝 Exercício</h3>
<p>Responda: “Good morning!” → ________</p>
`,
  },
  {
    id: 2,
    title: "Verbo To Be",
    level: "A1",
    description: "Entenda o verbo mais importante do inglês.",
    content: `
<h3>📘 Explicação</h3>
<p>O verbo <strong>to be</strong> significa “ser/estar”.</p>

<h3>🧩 Formas</h3>
<ul>
  <li>I <strong>am</strong></li>
  <li>You/We/They <strong>are</strong></li>
  <li>He/She/It <strong>is</strong></li>
</ul>

<h3>📝 Exercício</h3>
<p>Complete: She ___ a teacher.</p>
`,
  },
  {
    id: 3,
    title: "Simple Present",
    level: "A2",
    description: "Estrutura e uso do Simple Present.",
    content: `
<h3>📘 Explicação</h3>
<p>O <strong>Simple Present</strong> é usado para hábitos, rotinas e fatos gerais.</p>

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
`,
  },
];

(async () => {
  try {
    // 1) Garante que existem registros (upsert)
    for (const l of lessons) {
      await query(
        `
        INSERT INTO lessons (id, title, level, description, content)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          title = VALUES(title),
          level = VALUES(level),
          description = VALUES(description),
          content = VALUES(content)
        `,
        [l.id, l.title, l.level, l.description, l.content]
      );
    }

    console.log("✅ Seed completo: lessons atualizadas com sucesso.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Erro no seed completo:", err.message);
    process.exit(1);
  }
})();
