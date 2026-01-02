const API = "/admin/api";
const token = localStorage.getItem("token");

/* REDIRECIONAMENTO */
if (token && location.pathname.includes("login")) {
  location.href = "/admin/dashboard.html";
}
if (!token && location.pathname.includes("dashboard")) {
  location.href = "/admin/login.html";
}

/* LOGIN */
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

    if (password.length < 6) {
      errorBox.innerText = "Senha deve ter pelo menos 6 caracteres.";
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
        errorBox.innerText = data.message || "Login inválido";
        return;
      }

      localStorage.setItem("token", data.token);
      location.href = "/admin/dashboard.html";

    } catch {
      errorBox.innerText = "Erro de conexão com o servidor.";
    }
  });
}
