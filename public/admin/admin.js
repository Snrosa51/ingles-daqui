const API = "/api";

const token = localStorage.getItem("token");

if (token && location.pathname.includes("login")) {
  location.href = "/admin/dashboard.html";
}

if (!token && location.pathname.includes("dashboard")) {
  location.href = "/admin/login.html";
}

const form = document.getElementById("loginForm");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      document.getElementById("error").innerText = data.message;
      return;
    }

    localStorage.setItem("token", data.token);
    location.href = "/admin/dashboard.html";
  });
}

const list = document.getElementById("lessonList");

if (list) {
  fetch(`${API}/admin/lessons`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(lessons => {
      lessons.forEach(l => {
        const li = document.createElement("li");
        li.innerText = l.title;
        list.appendChild(li);
      });
    });

  document.getElementById("logout").onclick = () => {
    localStorage.removeItem("token");
    location.href = "/admin/login.html";
  };
}
