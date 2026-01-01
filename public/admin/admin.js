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

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        document.getElementById("error").innerText =
          data.message || "Erro ao fazer login";
        return;
      }

      localStorage.setItem("token", data.token);
      window.location.href = "/admin/dashboard.html";

    } catch (err) {
      document.getElementById("error").innerText =
        "Erro de conexão com o servidor";
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
        localStorage.removeItem("token");
        window.location.href = "/admin/login.html";
        return;
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

  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
    logoutBtn.onclick = () => {
      localStorage.removeItem("token");
      window.location.href = "/admin/login.html";
    };
  }
}
