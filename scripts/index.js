import { API_BASE, renderMovies, sendForm } from "./functions.js";

document.addEventListener("DOMContentLoaded", function () {
  const containerSelector = "#movies";
  const container = document.querySelector(containerSelector);

  const wishBtn = document.querySelector("#btn-show-wish");
  const filterRatingBtn = document.querySelector("#btn-filter-rating");
  const filterDurationBtn = document.querySelector("#btn-filter-duration");
  const showAllBtn = document.querySelector("#btn-show-all");
  const registerForm = document.querySelector("#RegisterForm");

  if (registerForm) {
    registerForm.addEventListener("submit", sendForm);
  }

  if (wishBtn) {
    wishBtn.addEventListener("click", function () {
      window.location.href = "wishList.html";
    });
  }

  if (filterRatingBtn) {
    filterRatingBtn.addEventListener("click", function () {
      const input = document.querySelector("#min-rating");
      const raw = input.value.trim();
      const value = Number(raw);

      if (!raw || isNaN(value)) {
        alert("Please enter a valid rating.");
        return;
      }

      fetch(`${API_BASE}/api/movie/rating/${value}`)
        .then(res => res.json())
        .then(movies => {
          window.__ALL_MOVIES__ = movies;
          renderMovies(containerSelector, movies);
        })
        .catch(() => {
          alert("Unable to load movies by rating.");
        });
    });
  }

  if (filterDurationBtn) {
    filterDurationBtn.addEventListener("click", function () {
      const input = document.querySelector("#max-duration");
      const raw = input.value.trim();
      const value = Number(raw);

      if (!raw || isNaN(value)) {
        alert("Please enter a valid duration.");
        return;
      }

      fetch(`${API_BASE}/api/movie/duration?maxDuration=${value}`)
        .then(res => res.json())
        .then(movies => {
          window.__ALL_MOVIES__ = movies;
          renderMovies(containerSelector, movies);
        })
        .catch(() => {
          alert("Unable to load movies by duration.");
        });
    });
  }

  // Show all movies
  if (showAllBtn) {
    showAllBtn.addEventListener("click", function () {
      loadAllMovies();
    });
  }

  if (container) {
    container.addEventListener("click", function (event) {
      const btn = event.target.closest(".btn-add-wish");
      if (!btn) return;

      const id = Number(btn.getAttribute("data-id"));
      const movie = (window.__ALL_MOVIES__ || []).find(m => m.id === id);
      if (!movie) return;

      fetch(`${API_BASE}/api/movie/wishlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movie)
      })
        .then(res => {
          if (res.ok) {
            btn.disabled = true;
            btn.textContent = "Added ✓";
          } else {
            return res.text().then(msg => alert(msg || "Request failed"));
          }
        })
        .catch(() => {
          alert("Network error");
        });
    });
  }

  function loadAllMovies() {
    fetch(`${API_BASE}/api/movie`)
      .then(res => res.json())
      .then(movies => {
        window.__ALL_MOVIES__ = movies;
        renderMovies(containerSelector, movies);
      })
      .catch(() => {
        alert("Unable to load movies.");
      });
  }

  loadAllMovies();
});
