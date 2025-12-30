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

    if (!lessons.length) {
      container.innerHTML = '<p>Ainda não há lições cadastradas.</p>';
      return;
    }

    container.innerHTML = ''; // limpa "Carregando..."

    lessons.forEach(lesson => {
      const card = document.createElement('div');
      card.className = 'lesson-card';

      card.innerHTML = `
        <h4>${lesson.title}</h4>
        <p><strong>Nível:</strong> ${lesson.level}</p>
        <p>${lesson.description}</p>
      `;

      container.appendChild(card);
    });

  } catch (error) {
    console.error('Erro ao carregar lições:', error);
    container.innerHTML = '<p>Erro ao carregar lições.</p>';
  }
}

document.addEventListener('DOMContentLoaded', carregarLicoes);
