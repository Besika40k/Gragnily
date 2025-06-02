import React, { useRef } from "react";
import style from "./VisualGenres.module.css";
import genres from "./Genres";

const VisualGenres = ({ setGenre = () => {} }) => {
  const scrollRef = useRef(null);

  return (
    <div className={style.visualGenres}>
      <div className={style.pickTopDiv}>
        <h2>საგანი</h2>
      </div>
      <div ref={scrollRef} className={style.genresContainer}>
        {genres.map((genre) => (
          <div
            onClick={() => setGenre(genre.name)}
            key={genre.name}
            className={style.genre}
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
