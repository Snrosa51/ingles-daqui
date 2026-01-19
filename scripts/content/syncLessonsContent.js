/**
 * Sync de conteúdo HTML (pronto) do Git para o DB.
 *
 * Uso:
 *   node scripts/content/syncLessonsContent.js        -> sincroniza TODAS as lições (arquivos 0001.html, 0002.html...)
 *   node scripts/content/syncLessonsContent.js 3      -> sincroniza SÓ a lição 3 (arquivo 0003.html)
 *
 * Regras:
 * - Arquivos em: content/lessons/0001.html, 0002.html...
 * - Bloqueia <script> por segurança básica
 */

const fs = require("fs");
const path = require("path");
const { query } = require("../../db/connection");

const CONTENT_DIR = path.join(__dirname, "..", "..", "content", "lessons");

function padId(id) {
  return String(id).padStart(4, "0");
}

function idFromFilename(filename) {
  return Number(filename.replace(".html", ""));
}

function listLessonFiles() {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => /^\d{4}\.html$/.test(f))
    .sort();
}

function validateHtml(html, filename) {
  if (!html || html.trim().length < 10) {
    throw new Error(`Conteúdo vazio ou muito curto em ${filename}`);
  }
  if (/<script\b/i.test(html)) {
    throw new Error(`Proibido <script> em ${filename}`);
  }
}

async function syncOne(id) {
  const filename = `${padId(id)}.html`;
  const filePath = path.join(CONTENT_DIR, filename);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Arquivo não encontrado: ${filePath}`);
  }

  const html = fs.readFileSync(filePath, "utf8");
  validateHtml(html, filename);

  const result = await query("UPDATE lessons SET content = ? WHERE id = ?", [
    html,
    id,
  ]);

  // mysql2 pode retornar OkPacket com affectedRows
  if (result && typeof result.affectedRows === "number" && result.affectedRows === 0) {
    console.warn(`⚠️ Nenhuma linha atualizada. Existe lição id=${id} na tabela lessons?`);
  } else {
    console.log(`✅ Sync lição ${id} (${filename})`);
  }
}

async function syncAll() {
  const files = listLessonFiles();

  if (files.length === 0) {
    console.log("Nenhum arquivo encontrado em:", CONTENT_DIR);
    return;
  }

  let ok = 0;

  for (const f of files) {
    const id = idFromFilename(f);
    const filePath = path.join(CONTENT_DIR, f);
    const html = fs.readFileSync(filePath, "utf8");

    validateHtml(html, f);
    await query("UPDATE lessons SET content = ? WHERE id = ?", [html, id]);

    ok++;
    console.log(`✅ Sync lição ${id} (${f})`);
  }

  console.log(`\nFinalizado. Arquivos sincronizados: ${ok}`);
}

(async () => {
  try {
    const arg = process.argv[2];

    if (arg) {
      const id = Number(arg);
      if (!Number.isInteger(id) || id <= 0) {
        throw new Error(`ID inválido: "${arg}". Use um número inteiro > 0.`);
      }
      await syncOne(id);
    } else {
      await syncAll();
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Erro no sync:", err.message);
    process.exit(1);
  }
})();
