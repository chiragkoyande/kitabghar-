import fs from "node:fs/promises";
import { catalogue } from "../server/data/catalogue.js";

const books = catalogue.map((b, i) => ({ id: i + 1, ...b }));

const content = `/**
 * Kitab Ghar · Experiment 2 ES6 JavaScript Catalogue & Popups
 * Standalone ES6 Features: Arrow Functions, Arrays, Events & Bootstrap Modals
 */
const books = [
${books.map((b) => "  " + JSON.stringify(b)).join(",\n")}
];

// Normalize strings to strip accents for robust search
const normalize = (str) => (str || "").normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").toLowerCase().trim();

// Application state
let searchQuery = "";
let selectedCategory = "";
let selectedAvailability = "";
let sortMode = "popular";
let selectedBookId = null;

// DOM Elements
const searchInput = document.getElementById("book-search");
const searchSuggestions = document.getElementById("search-suggestions");
const categoryContainer = document.getElementById("category-filters");
const availabilitySelect = document.getElementById("availability-filter");
const sortSelect = document.getElementById("sort-books");
const bookGrid = document.getElementById("book-grid");
const emptyState = document.getElementById("empty-state");
const resultCount = document.getElementById("result-count");
const resetBtn = document.getElementById("reset-filters");
const modalBookContent = document.getElementById("modal-book-content");
const modalElement = document.getElementById("bookModal");
const bookModal = window.bootstrap && window.bootstrap.Modal ? new window.bootstrap.Modal(modalElement) : null;
const confirmRentalBtn = document.getElementById("confirm-rental");

// Filter and sort books using ES6 arrow functions and array methods
const getVisibleBooks = () => {
  const query = normalize(searchQuery);
  return books
    .filter((book) => {
      if (!query) return true;
      const titleNorm = normalize(book.title);
      const authorNorm = normalize(book.author);
      const catNorm = normalize(book.category);
      return titleNorm.includes(query) || authorNorm.includes(query) || catNorm.includes(query);
    })
    .filter((book) => !selectedCategory || book.category === selectedCategory)
    .filter((book) => {
      if (selectedAvailability === "available") return book.availableCopies > 0;
      if (selectedAvailability === "unavailable") return book.availableCopies === 0;
      return true;
    })
    .sort((a, b) => {
      if (sortMode === "az") return a.title.localeCompare(b.title);
      if (sortMode === "category") return a.category.localeCompare(b.category) || a.title.localeCompare(b.title);
      if (sortMode === "recent") return b.publicationYear - a.publicationYear;
      return (b.availableCopies > 0 ? 1 : 0) - (a.availableCopies > 0 ? 1 : 0) || a.id - b.id;
    });
};

// Render catalogue cards using template literals and map()
const renderBooks = () => {
  const visible = getVisibleBooks();
  resultCount.textContent = \`\${visible.length} titles\`;
  if (visible.length === 0) {
    bookGrid.hidden = true;
    emptyState.hidden = false;
    return;
  }
  bookGrid.hidden = false;
  emptyState.hidden = true;
  bookGrid.innerHTML = visible.map((book) => \`
    <button class="book-card" type="button" data-book-id="\${book.id}" aria-label="View \${book.title}">
      <div class="book-cover cover-coffee">
        \${book.coverImage ? \`<img src="\${book.coverImage}" alt="\${book.title} cover" class="book-cover-image" loading="lazy">\` : \`<span>KITAB GHAR</span><strong>\${book.title}</strong><small>\${book.category}</small>\`}
      </div>
      <div class="book-card-info">
        <span class="book-card__category">\${book.category}</span>
        <h3>\${book.title}</h3>
        <p class="book-author">\${book.author}</p>
        <span class="availability-badge \${book.availableCopies > 0 ? "available" : "unavailable"}">
          \${book.availableCopies > 0 ? \`\${book.availableCopies} available\` : "Currently out"}
        </span>
      </div>
    </button>
  \`).join("");
};

// Search suggestions generator using array filter and map
const updateSuggestions = () => {
  if (!searchQuery.trim()) { searchSuggestions.innerHTML = ""; return; }
  const q = normalize(searchQuery);
  const matchingAuthors = [...new Set(books.filter((b) => normalize(b.author).includes(q)).map((b) => b.author))].slice(0, 4);
  searchSuggestions.innerHTML = matchingAuthors.map((author) => \`
    <button class="suggestion btn btn-sm btn-outline-secondary me-1 mb-1" type="button" data-author="\${author}">
      \${author}
    </button>
  \`).join("");
};

// Build book popup details with template literals
const showBookDetails = (book) => {
  if (!book) return;
  selectedBookId = book.id;
  const isAvailable = book.availableCopies > 0;
  modalBookContent.innerHTML = \`
    <div class="row g-3">
      <div class="col-12 col-md-4 text-center">
        <div class="detail-cover mb-2">
          \${book.coverImage ? \`<img src="\${book.coverImage}" alt="\${book.title}" class="img-fluid rounded shadow-sm">\` : \`<span>KITAB GHAR</span><strong>\${book.title}</strong>\`}
        </div>
        <span class="availability-badge \${isAvailable ? "available" : "unavailable"}">
          \${isAvailable ? \`\${book.availableCopies} Copies in Badlapur\` : "Currently out · Waitlist only"}
        </span>
      </div>
      <div class="col-12 col-md-8">
        <span class="badge bg-warning text-dark mb-1">\${book.category}</span>
        <h4 class="h5 fw-bold mb-1">\${book.title}</h4>
        <p class="text-muted small mb-2">By \${book.author} · \${book.language} · \${book.publicationYear}</p>
        <p class="small mb-3">\${book.description}</p>
        <div class="d-flex gap-2">
          <button class="btn btn-brand rent-trigger" type="button" \${isAvailable ? "" : "disabled"} data-rent-id="\${book.id}">
            \${isAvailable ? "Rent this book →" : "Join rental waitlist"}
          </button>
          <button class="btn btn-outline-secondary" type="button" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  \`;
  if (bookModal) bookModal.show();
};

// Event listeners and delegation
document.addEventListener("DOMContentLoaded", () => {
  renderBooks();
  searchInput.addEventListener("input", (e) => { searchQuery = e.target.value; updateSuggestions(); renderBooks(); });
  searchSuggestions.addEventListener("click", (e) => { const author = e.target.dataset.author; if (author) { searchInput.value = author; searchQuery = author; searchSuggestions.innerHTML = ""; renderBooks(); } });
  categoryContainer.addEventListener("click", (e) => { const btn = e.target.closest("[data-category]"); if (btn) { categoryContainer.querySelectorAll("[data-category]").forEach((b) => b.classList.remove("active")); btn.classList.add("active"); selectedCategory = btn.dataset.category; renderBooks(); } });
  availabilitySelect.addEventListener("change", (e) => { selectedAvailability = e.target.value; renderBooks(); });
  sortSelect.addEventListener("change", (e) => { sortMode = e.target.value; renderBooks(); });
  resetBtn.addEventListener("click", () => { searchInput.value = ""; searchQuery = ""; selectedCategory = ""; selectedAvailability = ""; sortMode = "popular"; availabilitySelect.value = ""; sortSelect.value = "popular"; categoryContainer.querySelectorAll("[data-category]").forEach((b) => b.classList.remove("active")); categoryContainer.querySelector("[data-category='']")?.classList.add("active"); searchSuggestions.innerHTML = ""; renderBooks(); });
  bookGrid.addEventListener("click", (e) => { const card = e.target.closest("[data-book-id]"); if (card) { const id = Number(card.dataset.bookId); const book = books.find((b) => b.id === id); showBookDetails(book); } });
  modalBookContent.addEventListener("click", (e) => { const rentBtn = e.target.closest(".rent-trigger"); if (rentBtn && !rentBtn.disabled) { const id = Number(rentBtn.dataset.rentId); const book = books.find((b) => b.id === id); if (book && book.availableCopies > 0) { confirmRentalBtn.onclick = () => { book.availableCopies -= 1; renderBooks(); showBookDetails(book); }; confirmRentalBtn.click(); } } });
});
`;

await fs.writeFile("experiments/exp2/script.js", content);
console.log("experiments/exp2/script.js written successfully");
