// public/lesson.js
function getLessonIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  return id ? Number(id) : null;
}

// ✅ HTML pronto vindo do DB
function renderContent(html) {
  if (!html) return "<p><em>Sem conteúdo.</em></p>";
  return html;
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
    contentEl.innerHTML = renderContent(lesson.content);

  } catch (err) {
    console.error("Erro ao carregar lição:", err);
    titleEl.textContent = "Erro ao carregar lição";
    contentEl.innerHTML = "<p>Não foi possível carregar a lição agora. Tente novamente.</p>";
  }
}

document.addEventListener("DOMContentLoaded", carregarLicao);
