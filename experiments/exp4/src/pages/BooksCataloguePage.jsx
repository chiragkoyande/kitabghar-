import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { books } from "../data/books";

const normalize = (text) =>
  String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

export default function BooksCataloguePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  const categories = useMemo(() => {
    const unique = new Set(books.map((b) => b.category));
    return ["All", ...Array.from(unique)];
  }, []);

  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        const query = normalize(searchQuery);
        const matchesQuery =
          !query ||
          normalize(book.title).includes(query) ||
          normalize(book.author).includes(query) ||
          normalize(book.category).includes(query);

        const matchesCategory =
          selectedCategory === "All" || book.category === selectedCategory;

        const matchesAvailability =
          availabilityFilter === "all" ||
          (availabilityFilter === "available" && book.availableCopies > 0) ||
          (availabilityFilter === "unavailable" && book.availableCopies === 0);

        return matchesQuery && matchesCategory && matchesAvailability;
      })
      .sort((a, b) => {
        if (sortBy === "az") return a.title.localeCompare(b.title);
        if (sortBy === "za") return b.title.localeCompare(a.title);
        if (sortBy === "copies") return b.availableCopies - a.availableCopies;
        return a.id - b.id;
      });
  }, [searchQuery, selectedCategory, availabilityFilter, sortBy]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setAvailabilityFilter("all");
    setSortBy("default");
  };

  return (
    <div className="catalogue-page">
      <div className="page-header">
        <h1 className="page-title">Browse Kitab Ghar Catalogue</h1>
        <p className="page-subtitle">
          Explore our collection of {books.length} curated physical books available for rental in Badlapur.
        </p>
      </div>

      {/* Filter Controls Bar */}
      <div className="catalogue-controls-bar">
        <div className="search-box-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            id="book-search"
            placeholder="Search by title, author, or keyword (e.g. Murakami, Classics)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className="dropdown-controls">
          <div className="control-group">
            <label htmlFor="availability-filter">Availability:</label>
            <select
              id="availability-filter"
              className="select-control"
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
            >
              <option value="all">All Copies</option>
              <option value="available">Available Now</option>
              <option value="unavailable">Currently Out</option>
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="sort-books">Sort by:</label>
            <select
              id="sort-books"
              className="select-control"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Default Order</option>
              <option value="az">Title (A – Z)</option>
              <option value="za">Title (Z – A)</option>
              <option value="copies">Most Available</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="category-pills">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`category-pill ${selectedCategory === category ? "active" : ""}`}
            data-category={category}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Results Header */}
      <div className="catalogue-results-meta">
        <span className="result-count">
          Showing <strong>{filteredBooks.length}</strong> of {books.length} titles
        </span>
        {(searchQuery || selectedCategory !== "All" || availabilityFilter !== "all") && (
          <button type="button" className="btn-reset-filters" id="reset-filters" onClick={handleClearFilters}>
            Clear all filters ✕
          </button>
        )}
      </div>

      {/* Book Grid or Empty State */}
      {filteredBooks.length > 0 ? (
        <div className="catalogue-grid" id="book-grid">
          {filteredBooks.map((book) => (
            <article key={book.id} className="book-card" data-book-id={book.id}>
              <div className="book-cover-wrap">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="book-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/book-covers/catalogue-000.jpg";
                  }}
                />
                <span
                  className={`availability-tag ${
                    book.availableCopies > 0 ? "available" : "out"
                  }`}
                >
                  {book.availableCopies > 0 ? `${book.availableCopies} available` : "Currently out"}
                </span>
              </div>
              <div className="book-info">
                <span className="book-category">{book.category}</span>
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">by {book.author}</p>
                <p className="book-desc-preview">{book.description}</p>
                <div className="book-card-footer">
                  <Link to={`/books/${book.id}`} className="card-link-btn" aria-label={`View ${book.title}`}>
                    View Details →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state" id="empty-state">
          <div className="empty-icon">📖</div>
          <h3>No matching books found</h3>
          <p>
            We couldn't find any books matching "<strong>{searchQuery}</strong>" in the selected filters.
          </p>
          <button type="button" className="btn-primary" onClick={handleClearFilters}>
            Clear Search & Show All Books
          </button>
        </div>
      )}
    </div>
  );
}
