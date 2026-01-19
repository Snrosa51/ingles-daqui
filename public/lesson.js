// public/lesson.js
function getLessonIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  return id ? Number(id) : null;
}

function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Se você guardar content como HTML “pronto”, você pode renderizar direto.
// Se você guardar texto simples, use escapeHtml e converta \n em <br>.
function renderContent(content) {
  if (!content) return "<p><em>Sem conteúdo.</em></p>";

  // Opção A (segura): tratar como texto
  const safe = escapeHtml(content).replaceAll("\n", "<br>");
  return `<p>${safe}</p>`;

  // Opção B (se você salvar HTML no DB):
  // return content;
}

async function carregarLicao() {
  const id = getLessonIdFromUrl();

  if (!id || Number.isNaN(id)) {
    document.getElementById("lessonTitle").textContent = "ID inválido";
    document.getElementById("lessonMeta").textContent = "";
    document.getElementById("lessonDesc").textContent = "";
    document.getElementById("lessonContent").innerHTML =
      "<p>Abra a lição pela lista inicial.</p>";
    return;
  }

  try {
    const resp = await fetch(`/api/lessons/${id}`, {
      headers: { Accept: "application/json" },
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      throw new Error(`HTTP ${resp.status} ${resp.statusText} ${text}`.slice(0, 300));
    }

    const lesson = await resp.json();

    document.getElementById("lessonTitle").textContent = lesson.title || `Lição ${id}`;
    document.getElementById("lessonMeta").textContent = `Nível: ${lesson.level || "-"}`;
    document.getElementById("lessonDesc").textContent = lesson.description || "";
    document.getElementById("lessonContent").innerHTML = renderContent(lesson.content);

  } catch (err) {
    console.error("Erro ao carregar lição:", err);
    document.getElementById("lessonTitle").textContent = "Erro ao carregar lição";
    document.getElementById("lessonContent").innerHTML =
      "<p>Não foi possível carregar a lição agora. Tente novamente.</p>";
  }
}

document.addEventListener("DOMContentLoaded", carregarLicao);
