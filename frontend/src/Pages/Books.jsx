import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import style from "./Books.module.css";
import SearchBar from "../modules/SearchBar/SearchBar.jsx";
import VisualGenres from "../modules/VisualGenres/VisualGenres.jsx";
const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) return <p>Loading books...</p>;
  const Filters = () => {
    return <section className={style.filterSection}></section>;
  };
  return (
    <div className={style.allContainer}>
      <div className={style.topDiv}>
        <h2>Gragnily</h2>
        <SearchBar />
      </div>
      <VisualGenres />
      <Filters />
      <h1>BOOKS</h1>
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
