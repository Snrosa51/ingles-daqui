// public/lesson.js
function getLessonIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  return id ? Number(id) : null;
}

/**
 * Sanitização mínima (não é perfeita, mas evita o básico):
 * - remove <script>...</script>
 * - remove atributos on*="..." (onclick, onload, etc.)
 *
 * Se um dia você quiser segurança forte mesmo:
 * use DOMPurify no front.
 */
function sanitizeHtml(html = "") {
  let out = String(html);

  // remove <script>...</script>
  out = out.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

  // remove atributos on*=
  out = out.replace(/\son\w+\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi, "");

  return out;
}

// Como você salva HTML no DB, renderiza direto (com sanitização mínima)
function renderContent(content) {
  if (!content) return "<p><em>Sem conteúdo.</em></p>";

  // limpeza leve de caracteres estranhos (opcional)
  let html = String(content);

  // remove um "n" solto que apareceu no seu conteúdo
  html = html.replace(/\n\s*n\s*<li>/g, "\n  <li>");

  return sanitizeHtml(html);
}

async function carregarLicao() {
  const id = getLessonIdFromUrl();

  const titleEl = document.getElementById("lessonTitle");
  const metaEl = document.getElementById("lessonMeta");
  const descEl = document.getElementById("lessonDesc");
  const contentEl = document.getElementById("lessonContent");

  if (!id || Number.isNaN(id)) {
    titleEl.textContent = "ID inválido";
    metaEl.textContent = "";
    descEl.textContent = "";
    contentEl.innerHTML = "<p>Abra a lição pela lista inicial.</p>";
    return;
  }

  try {
    const resp = await fetch(`/api/lessons/${id}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      throw new Error(`HTTP ${resp.status} ${resp.statusText} ${text}`.slice(0, 300));
    }

    const lesson = await resp.json();

    titleEl.textContent = lesson.title || `Lição ${id}`;
    metaEl.textContent = `Nível: ${lesson.level || "-"}`;
    descEl.textContent = lesson.description || "";

    // ✅ aqui está o ponto principal: renderizar como HTML
    contentEl.innerHTML = renderContent(lesson.content);

  } catch (err) {
    console.error("Erro ao carregar lição:", err);
    titleEl.textContent = "Erro ao carregar lição";
    metaEl.textContent = "";
    descEl.textContent = "";
    contentEl.innerHTML = "<p>Não foi possível carregar a lição agora. Tente novamente.</p>";
  }
}

document.addEventListener("DOMContentLoaded", carregarLicao);
