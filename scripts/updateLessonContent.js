// scripts/updateLessonContent.js
// Uso:
// docker compose exec app node scripts/updateLessonContent.js 3
// (vai ler lesson-content/3.html e aplicar no banco)

const fs = require("fs");
const path = require("path");
const { query } = require("../db/connection");

const id = Number(process.argv[2]);

if (!id || Number.isNaN(id)) {
  console.error("Uso: node scripts/updateLessonContent.js <id>");
  process.exit(1);
}

(async () => {
  try {
    const filePath = path.join(__dirname, "..", "lesson-content", `${id}.html`);

    if (!fs.existsSync(filePath)) {
      console.error(`Arquivo não encontrado: ${filePath}`);
      process.exit(1);
    }

    const html = fs.readFileSync(filePath, "utf8");

    await query(`UPDATE lessons SET content = ? WHERE id = ?`, [html, id]);

    console.log(`✅ Conteúdo da lição ${id} atualizado com sucesso.`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Erro ao atualizar conteúdo:", err.message);
    process.exit(1);
  }
})();
