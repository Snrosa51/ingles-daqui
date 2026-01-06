const API = "/admin/api";
const token = localStorage.getItem("token");
const path = location.pathname;

/* =========================
   PROTEÇÃO DE ROTAS (INICIAL)
========================= */

// Login → Dashboard (se já tem token)
if (token && path.endsWith("/login.html")) {
  window.location.replace("/admin/dashboard.html");
}

// Dashboard → Login (se não tem token)
if (!token && path.endsWith("/dashboard.html")) {
  window.location.replace("/admin/login.html");
}

/* =========================
   LOGIN
========================= */

const form = document.getElementById("loginForm");
const errorBox = document.getElementById("error");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorBox.innerText = "";

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

      // SALVA TOKEN
      localStorage.setItem("token", data.token);

      // REDIRECIONA
      window.location.replace("/admin/dashboard.html");

    } catch (err) {
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
    .then(res => {
      if (res.status === 401) {
        // SÓ AQUI remove token
        localStorage.removeItem("token");
        window.location.replace("/admin/login.html");
        return null;
      }

      if (!res.ok) {
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

  // Logout manual
  document.getElementById("logout").onclick = () => {
    localStorage.removeItem("token");
    window.location.replace("/admin/login.html");
  };
}
