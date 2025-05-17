import React, { useEffect, useState, useRef } from "react";
// import { Link } from "react-router-dom";
import style from "./Books.module.css";
import SearchBar from "../modules/SearchBar/SearchBar.jsx";
import VisualGenres from "../modules/VisualGenres/VisualGenres.jsx";
import Loading from "../modules/Loading.jsx";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFiters] = useState(false);
  const filterContainerRef = useRef();

  const handleFiltersVisibility = () => {
    console.log("aa");
    setShowFiters((prev) => !prev);
  };

  useEffect(() => {
    fetch("https://gragnily.onrender.com/api/books", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }
        return response.json();
      })
      .then((data) => {
        console.log("CHAOS", data);
        setBooks(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <Loading />;
  const Filters = () => {
    return (
      <section className={style.filterSection}>
        <h1>BOOKS</h1>
        <div className={style.fiterDiv}>
          <div
            ref={filterContainerRef}
            className={`${style.filterContainer} ${
              !showFilters ? style.filterHidden : ""
            }`}
          >
            <div className={style.filter}>
              <h3>filtername</h3>
            </div>
          </div>
          <button onClick={handleFiltersVisibility}>SORT BY</button>
        </div>
      </section>
    );
  };
  return (
    <div className={style.allContainer}>
      <div className={style.topSection}>
        <h2>Gragnily</h2>
        <SearchBar />
      </div>
      <VisualGenres />
      <Filters />
      <section className={style.booksSection}>
        {books.map((book) => (
          <li key={book.id || book._id}>
            {book.title}
            <div
              className={style.book}
              style={{
                backgroundImage: `url('${book.cover_image_url}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                height: "150px",
                width: "150px",
              }}
            ></div>
          </li>
        ))}
      </section>
      <div className={style.navigateNumbersDiv}>
        <p>1</p>
        <p>2</p>
      </div>
    </div>
  );
};

export default Books;
