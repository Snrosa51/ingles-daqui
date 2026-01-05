const API = "/admin/api";
const token = localStorage.getItem("token");

/* =========================
   PROTEÇÃO DE ROTAS
========================= */

// Se já está logado, não deixa voltar para o login
if (token && location.pathname.includes("login")) {
  window.location.href = "/admin/dashboard.html";
}

// Se NÃO está logado, bloqueia dashboard
if (!token && location.pathname.includes("dashboard")) {
  window.location.href = "/admin/login.html";
}

/* =========================
   LOGIN
========================= */

const form = document.getElementById("loginForm");
const errorBox = document.getElementById("error");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (!username || !password) {
      errorBox.innerText = "Preencha usuário e senha.";
      return;
    }

    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        errorBox.innerText = data.message || "Usuário ou senha inválidos";
        return;
      }

      localStorage.setItem("token", data.token);
      window.location.href = "/admin/dashboard.html";

    } catch {
      errorBox.innerText = "Erro de conexão com o servidor";
    }
  });
}

/* =========================
   DASHBOARD
========================= */

const list = document.getElementById("lessonList");

if (list) {
  fetch(`${API}/lessons`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(async res => {
      if (res.status === 401) {
        // SÓ aqui remove token
        localStorage.removeItem("token");
        window.location.href = "/admin/login.html";
        return null;
      }

      if (!res.ok) {
        // erro do servidor ≠ logout
        throw new Error("Erro ao carregar aulas");
      }

      return res.json();
    })
    .then(data => {
      if (!data) return;

      list.innerHTML = "";
      data.forEach(lesson => {
        const li = document.createElement("li");
        li.innerText = lesson.title || "(Sem título)";
        list.appendChild(li);
      });
    })
    .catch(err => {
      console.error(err);
      list.innerHTML = "<li>Erro ao carregar aulas</li>";
    });

  // logout manual
  document.getElementById("logout").onclick = () => {
    localStorage.removeItem("token");
    window.location.href = "/admin/login.html";
  };
}
