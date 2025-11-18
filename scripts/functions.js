export const API_BASE = "https://localhost:44350";

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

export function sendForm(event) {
  event.preventDefault();

  const nameInput = document.querySelector("#name");
  const emailInput = document.querySelector("#email");
  const passwordInput = document.querySelector("#password");
  const ageInput = document.querySelector("#age");

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const age = Number(ageInput.value.trim());

  if (!name) {
    alert("Name is required.");
    nameInput.focus();
    return;
  }
  if (name.length < 2) {
    alert("Name must be at least 2 characters.");
    nameInput.focus();
    return;
  }

  if (!email) {
    alert("Email is required.");
    emailInput.focus();
    return;
  }
  if (!email.includes("@") || !email.includes(".")) {
    alert("Please enter a valid email address.");
    emailInput.focus();
    return;
  }

  if (!password) {
    alert("Password is required.");
    passwordInput.focus();
    return;
  }
  if (password.length < 6) {
    alert("Password must be at least 6 characters.");
    passwordInput.focus();
    return;
  }

  if (!ageInput.value.trim()) {
    alert("Age is required.");
    ageInput.focus();
    return;
  }
  if (isNaN(age)) {
    alert("Age must be a number.");
    ageInput.focus();
    return;
  }
  if (age < 18 || age > 100) {
    alert("Age must be between 18 and 100.");
    ageInput.focus();
    return;
  }

  alert("Registration successful!");
  event.target.reset();
}