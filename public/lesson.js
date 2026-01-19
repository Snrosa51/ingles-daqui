// public/lesson.js

function getLessonIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  return id ? Number(id) : null;
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
      throw new Error(`Erro HTTP ${resp.status}`);
    }

    const lesson = await resp.json();

    // 🔹 Título e meta
    document.getElementById("lessonTitle").textContent =
      lesson.title || `Lição ${id}`;

    document.getElementById("lessonMeta").textContent =
      `Nível: ${lesson.level || "-"}`;

    document.getElementById("lessonDesc").textContent =
      lesson.description || "";

    // 🔥 A LINHA CRÍTICA (conteúdo vindo do banco)
    document.getElementById("lessonContent").innerHTML =
      lesson.content || "<p><em>Sem conteúdo.</em></p>";

  } catch (err) {
    console.error("Erro ao carregar lição:", err);
    document.getElementById("lessonTitle").textContent =
      "Erro ao carregar lição";
    document.getElementById("lessonContent").innerHTML =
      "<p>Não foi possível carregar a lição agora.</p>";
  }
}

document.addEventListener("DOMContentLoaded", carregarLicao);
