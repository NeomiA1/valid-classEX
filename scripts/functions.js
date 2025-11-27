export const API_BASE = "https://localhost:44350/api";

export function renderMovies(containerSelector, movies) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  let html = "";

  for (let i = 0; i < movies.length; i++) {
    const m = movies[i];
    html += `
      <div class="movie-card" data-id="${m.id}">
        <h3>${m.title}</h3>
        <p>Rating: ${m.rating} | Duration: ${m.duration} min</p>
        <button class="btn-add-wish" data-id="${m.id}">
          Add to Wish List
        </button>
      </div>`;
  }

  container.innerHTML = html;
}

export function saveUser(user) {
  localStorage.setItem("loggedUser", JSON.stringify(user));
}

export function getUser() {
  const u = localStorage.getItem("loggedUser");
  return u ? JSON.parse(u) : null;
}

export function logout() {
  localStorage.removeItem("loggedUser");
}

export function isLoggedIn() {
  return !!getUser();
}

export function setAuthUI() {
  const btnAuth = document.querySelector("#btn-auth");
  const indicator = document.querySelector("#auth-indicator");
  const btnAddMovie = document.querySelector("#btn-add-movie"); // חדש

  if (!btnAuth || !indicator) return;

  const user = getUser();

  if (user) {
    btnAuth.textContent = "Logout";
    indicator.textContent = `Hi, ${user.userName || user.UserName}`;
    indicator.classList.remove("hidden");

    if (btnAddMovie) {
      btnAddMovie.classList.remove("hidden");
    }

  } else {
    btnAuth.textContent = "Login";
    indicator.textContent = "";
    indicator.classList.add("hidden");

    if (btnAddMovie) {
      btnAddMovie.classList.add("hidden");
    }
  }
}


export async function registerUser(userName, email, password) {
  const res = await fetch(`${API_BASE}/Users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userName, email, password })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || "Register failed");
  }

  return true;
}

export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE}/Users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    const errText = await res.text();
    if (!errText && res.status === 401) {
      throw new Error("Invalid email or password");
    }
    throw new Error(errText || "Login failed");
  }

  return await res.json();
}
