async function carregarLicao() {
  const container = document.getElementById("lesson-content");

  // Pega o ?id= da URL
  const params = new URLSearchParams(window.location.search);
  const lessonId = params.get("id");

  if (!lessonId) {
    container.innerHTML = "<p>Lição não encontrada.</p>";
    return;
  }

  try {
    const resp = await fetch(`/api/lessons/${lessonId}`);

    if (!resp.ok) {
      container.innerHTML = "<p>Erro ao carregar a lição.</p>";
      return;
    }

    const lesson = await resp.json();

    container.innerHTML = `
      <div class="lesson-box">
        <span class="lesson-level">${lesson.level}</span>
        <h2 class="lesson-title">${lesson.title}</h2>
        <p class="lesson-desc">${lesson.description}</p>

        <hr>

        <div class="lesson-body">
          ${lesson.content || "<p>Conteúdo em construção.</p>"}
        </div>
      </div>
    `;

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Erro de conexão.</p>";
  }
}

document.addEventListener("DOMContentLoaded", carregarLicao);
