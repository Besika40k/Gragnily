import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import style from "./Books.module.css";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("https://gragnily-backend.onrender.com/api/books")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }
        return response.json();
      })
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading books...</p>;

  return (
    <div className={style.allContainer}>
      <section className={style.filterSection}></section>
      <h1>BOOKS</h1>
      <section className={style.booksSection}>
        {books.books.map((book) => (
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
            <iframe src={book.pdf_url} width="100%" height="600px"></iframe>
          </li>
        ))}
      </section>
    </div>
  );
};

export default Books;
