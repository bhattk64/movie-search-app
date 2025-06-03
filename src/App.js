import React, { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import MovieList from "./components/MovieList";
import FavoritesList from "./components/FavoritesList";
import "./App.css";

const API_KEY = "662311fc";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("all");
  const [favoriteSearch, setFavoriteSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`);
      const data = await res.json();
      if (data.Response === "True") {
        setResults(data.Search);
      } else {
        setResults([]);
        setError(data.Error);
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = (movie) => {
    if (!favorites.some((fav) => fav.imdbID === movie.imdbID)) {
      setFavorites([...favorites, movie]);
    }
  };

  const removeFromFavorites = (movie) => {
    setFavorites(favorites.filter((fav) => fav.imdbID !== movie.imdbID));
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const getFilteredFavorites = () => {
    let filtered = [...favorites];
    if (favoriteSearch) {
      filtered = filtered.filter((movie) =>
        movie.Title.toLowerCase().includes(favoriteSearch.toLowerCase())
      );
    }
    if (sortOrder === "asc") {
      filtered.sort((a, b) => a.Title.localeCompare(b.Title));
    } else {
      filtered.sort((a, b) => b.Title.localeCompare(a.Title));
    }
    return filtered;
  };

  return (
    <div className="App">
      <h1>🎬 Movie Search App</h1>
    <SearchBar query={query} setQuery={setQuery} onSearch={handleSearch} loading={loading} />


      <div className="view-toggle">
        <button onClick={() => setViewMode("all")}>Show All Results</button>
        <button onClick={() => setViewMode("favorites")}>Show Favorites</button>
      </div>

      {viewMode === "favorites" && (
        <div className="favorite-options">
          <input
            type="text"
            placeholder="Search favorites..."
            value={favoriteSearch}
            onChange={(e) => setFavoriteSearch(e.target.value)}
          />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">Sort A-Z</option>
            <option value="desc">Sort Z-A</option>
          </select>
          <button onClick={clearFavorites}>Clear All Favorites</button>
        </div>
      )}

     {loading && <div className="loading-spinner"></div>}
{error && <div className="error-message">{error}</div>}


      {viewMode === "all" ? (
        <MovieList
          movies={results}
          favorites={favorites}
          onAdd={addToFavorites}
          onRemove={removeFromFavorites}
        />
      ) : (
        <FavoritesList
          movies={getFilteredFavorites()}
          onRemove={removeFromFavorites}
        />
      )}
    </div>
  );
}

export default App;
