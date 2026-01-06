// public/script.js

async function carregarLicoes() {
  const container = document.getElementById('lesson-list');
  if (!container) return;

  try {
    const resp = await fetch('/api/lessons');

    if (!resp.ok) {
      container.innerHTML = '<p>Não foi possível carregar as lições.</p>';
      return;
    }

    const lessons = await resp.json();

    if (!Array.isArray(lessons) || lessons.length === 0) {
      container.innerHTML = '<p>Ainda não há lições cadastradas.</p>';
      return;
    }

    // limpa "Carregando..."
    container.innerHTML = '';

    lessons.forEach(lesson => {
      const card = document.createElement('div');
      card.className = 'lesson-card';

      card.innerHTML = `
        <div class="lesson-level">${lesson.level}</div>

        <div class="lesson-title">
          ${lesson.title}
        </div>

        <div class="lesson-desc">
          ${lesson.description || 'Descrição em breve'}
        </div>

        <div class="lesson-actions">
          <a href="/lesson.html?id=${lesson.id}">
            Abrir lição
          </a>
        </div>
      `;

      container.appendChild(card);
    });

  } catch (error) {
    console.error('Erro ao carregar lições:', error);
    container.innerHTML = '<p>Erro ao carregar lições.</p>';
  }
}

document.addEventListener('DOMContentLoaded', carregarLicoes);
