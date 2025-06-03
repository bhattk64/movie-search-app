import React from "react";
import MovieCard from "./MovieCard";

function FavoritesList({ movies, onRemove }) {
  return (
    <div className="favorites-list">
      {movies.map((movie) => (
        <MovieCard
          key={movie.imdbID}
          movie={movie}
          isFavorite={true}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}

export default FavoritesList;
