const fs = require("fs");
const path = require("path");
const { query } = require("../../db/connection");

const CONTENT_DIR = path.join(__dirname, "..", "..", "content", "lessons");

function listLessonFiles() {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs.readdirSync(CONTENT_DIR)
    .filter(f => /^\d{4}\.html$/.test(f))
    .sort();
}

function idFromFilename(filename) {
  return Number(filename.replace(".html", ""));
}

function validateHtml(html, filename) {
  // Regras simples para evitar erros e manter padrão.
  // (Você pode endurecer depois)
  if (!html || html.trim().length < 10) {
    throw new Error(`Conteúdo vazio ou muito curto em ${filename}`);
  }

  // Proteções básicas: impedir <script> no conteúdo
  if (/<script\b/i.test(html)) {
    throw new Error(`Proibido <script> em ${filename}`);
  }
}

(async () => {
  try {
    const files = listLessonFiles();

    if (files.length === 0) {
      console.log("Nenhum arquivo encontrado em:", CONTENT_DIR);
      process.exit(0);
    }

    let updated = 0;

    for (const f of files) {
      const id = idFromFilename(f);
      const filePath = path.join(CONTENT_DIR, f);
      const html = fs.readFileSync(filePath, "utf8");

      validateHtml(html, f);

      const result = await query(
        "UPDATE lessons SET content = ? WHERE id = ?",
        [html, id]
      );

      // mysql2 retorna um OkPacket; dependendo da config você pode checar affectedRows
      updated++;
      console.log(`✅ Sync lição ${id} (${f})`);
    }

    console.log(`\nFinalizado. Arquivos sincronizados: ${updated}`);
    process.exit(0);

  } catch (err) {
    console.error("❌ Erro no sync:", err.message);
    process.exit(1);
  }
})();
