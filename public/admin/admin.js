const API = "/admin/api";
const token = localStorage.getItem("token");

/* =========================
   REDIRECIONAMENTO BÁSICO
========================= */

if (token && location.pathname.includes("login")) {
  window.location.href = "/admin/dashboard.html";
}

if (!token && location.pathname.includes("dashboard")) {
  window.location.href = "/admin/login.html";
}

/* =========================
   LOGIN
========================= */

const form = document.getElementById("loginForm");
const errorBox = document.getElementById("error");
const loginBtn = document.getElementById("loginBtn");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    errorBox.innerText = "";

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    // 🔎 Validações básicas (FRONTEND)
   if (!username.trim() || !password.trim()) {
  errorBox.innerText = "Preencha usuário e senha.";
  return;
}

    if (password.length < 6) {
      errorBox.innerText = "A senha deve ter pelo menos 6 caracteres.";
      return;
    }

    // ⏳ feedback visual
    loginBtn.disabled = true;
    loginBtn.innerText = "Entrando...";

    try {
      const res = await fetch("/admin/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        errorBox.innerText = data.message || "Usuário ou senha inválidos.";
        loginBtn.disabled = false;
        loginBtn.innerText = "Entrar";
        return;
      }

      // ✅ sucesso
      localStorage.setItem("token", data.token);
      window.location.href = "/admin/dashboard.html";

    } catch (err) {
      errorBox.innerText = "Erro ao conectar com o servidor.";
      loginBtn.disabled = false;
      loginBtn.innerText = "Entrar";
    }
  });
}


/* =========================
   DASHBOARD
========================= */

const list = document.getElementById("lessonList");

if (list && token) {
  fetch(`${API}/lessons`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => {
      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/admin/login.html";
        return null;
      }
      return res.json();
    })
    .then(lessons => {
      if (!lessons) return;

      list.innerHTML = "";

      lessons.forEach(l => {
        const li = document.createElement("li");
        li.innerText = l.title || "(Sem título)";
        list.appendChild(li);
      });
    })
    .catch(() => {
      localStorage.removeItem("token");
      window.location.href = "/admin/login.html";
    });
}

const logoutBtn = document.getElementById("logout");
if (logoutBtn) {
  logoutBtn.onclick = () => {
    localStorage.removeItem("token");
    window.location.href = "/admin/login.html";
  };
}
