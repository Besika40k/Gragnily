import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import style from "./OurPickVisual.module.css";
import BookItem from "../BooksSectionComponents/BookItem";
const OurPickVisual = () => {
  const favs = [];
  const [books, setBooks] = useState([]);
  useEffect(() => {
    const params = {
      page: 0,
      limit: 10,
      popularity: true,
    };
    const queryString = new URLSearchParams(params).toString();

    fetch(
      `https://gragnily.onrender.com/api/search/bookFilter?${queryString}`,
      {
        method: "GET",
        credentials: "include",
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch books", response.status);
        }
        return response.json();
      })
      .then((data) => {
        console.log("CHAOS", data);
        if (data.length == 0 || data.Books.length == 0) {
          setBooks([
            {
              _id: 1,
              cover_image_url:
                "https://ecdn.teacherspayteachers.com/thumbitem/Design-your-own-Book-Cover-Printable-Blank-Book-10355131-1698669978/original-10355131-1.jpg",
              title: "ასეთი წიგნი ვერ მოიძებნა",
            },
          ]);
        } else {
          setBooks(data.Books);
          console.log(data.Books);
        }
      })
      .catch((error) => {
        console.error(" Error fetching books:", error);
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

  return (
    <div className={style.ourPickVisual}>
      <div className={style.pickTopDiv}>
        <h2>რჩეული წიგნები</h2>
        <div className={style.buttonsDiv}>
          <Link to={"/books"}>
            <button className={style.fullButton}>სრულად</button>
          </Link>
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
          {books.map((book) => (
            <BookItem
              name={book.title}
              imgUrl={book.cover_image_url}
              bookID={book._id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurPickVisual;
