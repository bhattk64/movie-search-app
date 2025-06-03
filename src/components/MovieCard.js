import React from "react";

function MovieCard({ movie, isFavorite, onAdd, onRemove }) {
  return (
    <div className="movie-card">
      <img src={movie.Poster} alt={movie.Title} />
      <h3>{movie.Title}</h3>
      <p>{movie.Year}</p>
      {isFavorite ? (
        <button onClick={() => onRemove(movie)}>Remove from Favorites</button>
      ) : (
        <button onClick={() => onAdd(movie)}>Add to Favorites</button>
      )}
    </div>
  );
}

export default MovieCard;
