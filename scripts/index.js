import {
  API_BASE,
  renderMovies,
  registerUser,
  loginUser,
  saveUser,
  logout,
  setAuthUI,
  isLoggedIn
} from "./functions.js";

document.addEventListener("DOMContentLoaded", () => {

  const modal = document.querySelector("#auth-modal");
  const btnAuth = document.querySelector("#btn-auth");
  const btnClose = document.querySelector("#auth-close");
  const tabReg = document.querySelector("#tab-register");
  const tabLog = document.querySelector("#tab-login");
  const regForm = document.querySelector("#register-form");
  const logForm = document.querySelector("#login-form");
  const regMsg = document.querySelector("#reg-msg");
  const logMsg = document.querySelector("#login-msg");

  function openModal() {
    if (!modal) return;
    modal.classList.remove("hidden");
    modal.style.display = "flex";
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.add("hidden");
    modal.style.display = "none";

    if (regMsg) regMsg.textContent = "";
    if (logMsg) logMsg.textContent = "";
  }

  function showRegister() {
    if (!tabReg || !tabLog || !regForm || !logForm) return;
    tabReg.classList.add("active");
    tabLog.classList.remove("active");
    regForm.classList.remove("hidden");
    logForm.classList.add("hidden");
  }

  function showLogin() {
    if (!tabReg || !tabLog || !regForm || !logForm) return;
    tabLog.classList.add("active");
    tabReg.classList.remove("active");
    logForm.classList.remove("hidden");
    regForm.classList.add("hidden");
  }

 
  if (btnAuth) {
    btnAuth.addEventListener("click", () => {
      if (isLoggedIn()) {
       
        logout();
        setAuthUI();
        window.location.reload();
      } else {
        
        showLogin();
        openModal();
      }
    });
  }


  if (btnClose) {
    btnClose.addEventListener("click", closeModal);
  }
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  if (tabReg) {
    tabReg.addEventListener("click", showRegister);
  }
  if (tabLog) {
    tabLog.addEventListener("click", showLogin);
  }

  if (regForm) {
    regForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (regMsg) regMsg.textContent = "";
      if (logMsg) logMsg.textContent = "";

      const userNameInput = document.querySelector("#reg-username");
      const emailInput = document.querySelector("#reg-email");
      const passwordInput = document.querySelector("#reg-password");

      const userName = userNameInput.value.trim();
      const email = emailInput.value.trim();
      const password = passwordInput.value;

      if (!userName || !email || !password) {
        if (regMsg) regMsg.textContent = "All fields are required.";
        return;
      }

      try {
        await registerUser(userName, email, password);

        if (regMsg) regMsg.textContent = "Registered successfully. You can login now.";

      } catch (err) {
        if (regMsg) regMsg.textContent = err.message;
      }
    });
  }

  if (logForm) {
    logForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (logMsg) logMsg.textContent = "";

      const emailInput = document.querySelector("#login-email");
      const passwordInput = document.querySelector("#login-password");

      const email = emailInput.value.trim();
      const password = passwordInput.value;

      if (!email || !password) {
        if (logMsg) logMsg.textContent = "Email and password are required.";
        return;
      }

      try {
        const user = await loginUser(email, password);
        saveUser(user);
        setAuthUI();
        closeModal();
      } catch (err) {
        if (logMsg) logMsg.textContent = err.message;
      }
    });
  }

  setAuthUI();

  const containerSelector = "#movies";
  const container = document.querySelector(containerSelector);

  const wishBtn = document.querySelector("#btn-show-wish");
  const filterRatingBtn = document.querySelector("#btn-filter-rating");
  const filterDurationBtn = document.querySelector("#btn-filter-duration");
  const showAllBtn = document.querySelector("#btn-show-all");
  const addMovieBtn = document.querySelector("#btn-add-movie");

  if (wishBtn) {
    wishBtn.addEventListener("click", () => {
      if (!isLoggedIn()) {
        alert("Please login first.");
        showLogin();
        openModal();
        return;
      }
  
      window.location.href = "wishList.html";
    });
  }  

  if (filterRatingBtn) {
    filterRatingBtn.addEventListener("click", () => {
      const input = document.querySelector("#min-rating");
      const raw = input.value.trim();
      const value = Number(raw);

      if (!raw || isNaN(value)) {
        alert("Please enter a valid rating.");
        return;
      }

      fetch(`${API_BASE}/Movie/rating/${value}`)
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
    filterDurationBtn.addEventListener("click", () => {
      const input = document.querySelector("#max-duration");
      const raw = input.value.trim();
      const value = Number(raw);

      if (!raw || isNaN(value)) {
        alert("Please enter a valid duration.");
        return;
      }

      fetch(`${API_BASE}/Movie/duration?maxDuration=${value}`)
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

  function loadAllMovies() {
    fetch(`${API_BASE}/Movie`)
      .then(res => res.json())
      .then(movies => {
        window.__ALL_MOVIES__ = movies;
        renderMovies(containerSelector, movies);
      })
      .catch(() => {
        alert("Unable to load movies.");
      });
  }

  if (showAllBtn) {
    showAllBtn.addEventListener("click", () => {
      loadAllMovies();
    });
  }

  if (addMovieBtn) {
    addMovieBtn.addEventListener("click", () => {
      window.location.href = "addMovie.html";
    });
  }

  if (container) {
    container.addEventListener("click", (event) => {
      const btn = event.target.closest(".btn-add-wish");
      if (!btn) return;

      if (!isLoggedIn()) {
        alert("Please login first.");
        showLogin();
        openModal();
        return;
      }

      const id = Number(btn.getAttribute("data-id"));
      const movie = (window.__ALL_MOVIES__ || []).find(m => m.id === id);
      if (!movie) return;

      fetch(`${API_BASE}/Movie/wishlist`, {
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

  loadAllMovies();
});
