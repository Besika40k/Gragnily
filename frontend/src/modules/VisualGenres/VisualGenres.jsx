import React, { useRef, useState } from "react";
import style from "./VisualGenres.module.css";
import genres from "./Genres";

const VisualGenres = ({
  setGenre = () => {},
  selectedGenre,
  setSelectedGenre,
}) => {
  const scrollRef = useRef(null);
  const handleClick = (genreName) => {
    if (genreName == selectedGenre) {
      setGenre("no genre");
      setSelectedGenre(null);
    } else {
      setGenre(genreName);
      setSelectedGenre(genreName);
    }
  };

  return (
    <div className={style.visualGenres}>
      <div className={style.pickTopDiv}>
        <h2>საგანი</h2>
      </div>
      <div ref={scrollRef} className={style.genresContainer}>
        {genres.map((genre) => (
          <div
            onClick={() => handleClick(genre.name)}
            key={genre.name}
            className={`${style.genre} ${
              selectedGenre === genre.name ? style.active : ""
            }`}
          >
            {genre.svg}
            <div
              style={{ backgroundImage: `url(${genre.img})` }}
              className={style.imgDiv}
            ></div>
            <h3>{genre.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisualGenres;
