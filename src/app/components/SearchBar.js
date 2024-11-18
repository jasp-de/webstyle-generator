"use client";

export default function SearchBar({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
}) {
  return (
    <div className="controls-section">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search by tags..."
          value={searchTerm}
          s
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="sort-options">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="mostLiked">Most Liked</option>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>
    </div>
  );
}
