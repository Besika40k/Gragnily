import React, { useState, useEffect, useRef } from "react";

import { Link, useNavigate } from "react-router-dom";
import BookItem from "../BooksSectionComponents/BookItem";
import style from "./FavBooks.module.css";
import { useUser } from "../../contexts/UserContext";

const FavBooks = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  if (user.email == "") {
    navigate("/");
    return;
  }

  const [books, setBooks] = useState([]);
  useEffect(() => {
    fetch(
      `https://gragnily.onrender.com/api/likes/get?type=${encodeURIComponent(
        "book"
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setBooks(data.books);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching likes:", error);
      });
  }, []);

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

  const handleItemDelete = (bookID) => {
    fetch("https://gragnily.onrender.com/api/likes/like", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        type: "book",
        objectId: bookID,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then((data) => {
        console.log("Like successful:", data);
        setBooks((prevBooks) =>
          prevBooks.filter((book) => book._id !== bookID)
        );
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  return (
    <div className={style.ourPickVisual}>
      <div className={style.pickTopDiv}>
        <h2 style={{ fontSize: "2rem" }}>მოწონებული წიგნები</h2>
        <div className={style.buttonsDiv}>
          <button onClick={scrollLeft} className={style.scrollLeftButton}>
            <i className="material-icons">keyboard_arrow_left</i>
          </button>
          <button onClick={scrollRight} className={style.scrollRightButton}>
            <i className="material-icons">keyboard_arrow_right</i>
          </button>
        </div>
      </div>
      <div className={style.scrollWrapper}>
        <div
          style={{ scrollBehavior: "smooth" }}
          ref={scrollRef}
          className={style.pickBottomDiv}
        >
          {books.length == 0 ? (
            <p>თქვენი მოწონებული წიგნები აქ გამოჩნდებიან (◜ᴗ◝) </p>
          ) : (
            books.map((book) => (
              <div key={book._id} className={style.bookDiv}>
                <div className={style.hoverDiv}>
                  <div className={style.bookItemDiv}>
                    <BookItem
                      name={""}
                      imgUrl={book.cover_image_url}
                      bookID={book._id}
                    />
                  </div>
                  <div className={style.buttonDiv}>
                    <button
                      onClick={() => {
                        handleItemDelete(book._id);
                      }}
                      className={style.deleteMeButton}
                    >
                      ამოშლა
                    </button>
                  </div>
                </div>
                <div className={style.bookInfo}>
                  <p>წიგნი : {book.title}</p>
                  <p>Favorited on your mom</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FavBooks;
