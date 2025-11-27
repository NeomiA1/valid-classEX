import { API_BASE } from "./functions.js";

document.addEventListener("DOMContentLoaded", () => {
  const containerSelector = "#wish-list";

  function renderWishList(movies) {
    const container = document.querySelector(containerSelector);
    const countSpan = document.querySelector("#wish-count");
    const emptyState = document.querySelector("#wish-empty");

    if (!container) return;

    // ספירת סרטים
    if (countSpan) {
      const count = movies.length;
      countSpan.textContent = count === 1 ? "1 movie" : `${count} movies`;
    }

    // אם אין סרטים – מציגים empty state
    if (!movies || movies.length === 0) {
      container.innerHTML = "";
      if (emptyState) {
        emptyState.classList.remove("hidden");
      }
      return;
    }

    // יש סרטים – מסתירים empty state
    if (emptyState) {
      emptyState.classList.add("hidden");
    }

    let html = "";

    for (let i = 0; i < movies.length; i++) {
      const m = movies[i];

      html += `
        <div class="movie-card wish-card" data-id="${m.id}">
          <div class="wish-card-header">
            <h3>${m.title}</h3>
            <span class="tag-pill">In your wish list</span>
          </div>
          <p>Rating: ${m.rating} | Duration: ${m.duration} min</p>
        </div>
      `;
    }

    container.innerHTML = html;
  }

  function loadWishList() {
    fetch(`${API_BASE}/Movie/wishlist`)
      .then(res => {
        if (!res.ok) {
          throw new Error("Server error");
        }
        return res.json();
      })
      .then(movies => {
        renderWishList(movies);
      })
      .catch(() => {
        alert("Unable to load wish list.");
      });
  }

  loadWishList();
});
