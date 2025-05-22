import React, { useRef } from "react";
import style from "./VisualGenres.module.css";
import school1 from "../../assets/school1.png";

const VisualGenres = () => {
  const genres = [
    {
      id: 1,
      name: "ფიზიკა",
      svg: (
        <svg
          width="100"
          height="100"
          viewBox="0 0 67 67"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.75586 59.5372V7.44741C7.75586 3.53787 10.9248 0.368164 14.8351 0.368164H54.2409C56.9635 0.368164 59.1705 2.57519 59.1705 5.29775V54.1693C58.6145 57.0308 29.7673 58.0082 7.75586 59.5372Z"
            fill="#B4D9D7"
          />
          <path
            d="M14.7755 0.368164V57.8221L7.75586 59.5372V7.44741C7.75586 3.53787 10.9248 0.368164 14.8351 0.368164"
            fill="#54ADA0"
          />
          <path
            d="M55.7086 55.8217H57.517C58.4297 55.8217 59.1695 55.0819 59.1695 54.1692C59.1695 53.2566 58.4297 52.5167 57.517 52.5167H14.7746C10.8974 52.5167 7.75488 55.6592 7.75488 59.5364C7.75488 63.4136 10.8974 66.5561 14.7746 66.5561H57.517C58.4297 66.5561 59.1695 65.8162 59.1695 64.9036C59.1695 63.9909 58.4297 63.2511 57.517 63.2511H55.7086V55.8217Z"
            fill="#54ADA0"
          />
          <path
            d="M15.2125 63.2526H57.2121V55.8218H15.2125C13.1606 55.8218 11.4971 57.4853 11.4971 59.5372C11.4971 61.589 13.1606 63.2526 15.2125 63.2526Z"
            fill="#F5CD94"
          />
        </svg>
      ),
      img: school1,
    },
  ];
  for (let i = 1; i <= 10; i++) {
    const newGenre = {
      ...genres[0],
      id: i + 1,
    };
    genres.push(newGenre);
  }

  const scrollRef = useRef(null);

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 300, // Adjust this value as needed
        behavior: "smooth",
      });
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -350,
        behavior: "smooth",
      });
    }
  };
  return (
    <div className={style.visualGenres}>
      <div className={style.pickTopDiv}>
        <h2>საგანი</h2>
      </div>
      <div ref={scrollRef} className={style.genresContainer}>
        {genres.map((genre) => (
          <div key={genre.id} className={style.genre}>
            {genre.svg}
            <img src={genre.img} alt={genre.name} />
            <h3>{genre.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};
export default VisualGenres;
