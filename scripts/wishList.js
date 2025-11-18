import { API_BASE, renderMovies } from "./functions.js";

document.addEventListener("DOMContentLoaded", function () {
  fetch(`${API_BASE}/api/movie/wishlist`)
    .then(function (res) { return res.json(); })
    .then(function (list) {
      renderMovies("#wish-list", list);
    })
    .catch(function (err) {
      console.log("Wish List Load Error:", err);
    });
});
