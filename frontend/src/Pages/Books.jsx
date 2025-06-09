import React, { useEffect, useState, useRef, act } from "react";
// import { Link } from "react-router-dom";
import style from "./Books.module.css";
import Loading from "../modules/Loading.jsx";
import VisualGenres from "../modules/VisualGenres/VisualGenres.jsx";
import DefaultLayout from "./DefaultLayout.jsx";
import SortComponent from "../modules/BooksSectionComponents/SortComponent.jsx";
import BookItem from "../modules/BooksSectionComponents/BookItem.jsx";

const Books = () => {
  const defaultFilters = {
    popularity: "", // Optional
    name: "", // Optional
    date: "", // Optional
    // author: "", // Optional
  };
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [books, setBooks] = useState([]);
  const [selectedGenre2, setSelectedGenre2] = useState(null);
  const [filters, setFilters] = useState({
    popularity: "", // Optional
    name: "", // Optional
    date: "", // Optional
    // author: "", // Optional
  });
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const filterContainerRef = useRef();

  useEffect(() => {
    setLoading(true);
    //send request fetch books
    const params = {
      page: activePage,
      limit: 18,
      ...filters,
    };
    const queryString = new URLSearchParams(params).toString();
    fetch(`https://gragnily.onrender.com/api/search/bookFilter?${queryString}`)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setBooks(data.Books);
          setTotalPages(data.pages);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching books:", err);
      });
  }, [filters, activePage]);

  const handleFiltersVisibility = () => {
    console.log("aa");
    setShowFilters((prev) => !prev);
  };

  const filterBooks = (identifier) => {
    console.log("filtering books by", identifier);
    // send request to fetch books with a certain filter
    setFilters((prev) => {
      const newFilters = { ...prev };
      // toggle the filter
      if (newFilters["subject"] === "") {
        newFilters["subject"] = identifier; // or any value you want to set
      } else {
        newFilters["subject"] = ""; // reset the filter
      }
      return newFilters;
    });
    //loading = true
    // set books
  };

  const setGenre = (genre) => {
    setActivePage(1);
    if (genre != "no genre") {
      setFilters((prev) => {
        const newFilters = { ...prev };
        newFilters.subject = genre;

        return newFilters;
      });
    } else {
      setFilters(defaultFilters);
    }

    console.log(filters);
  };

  // loading until the data is fetched
  if (loading) return <Loading />;

  const Filters = () => {
    return (
      <section className={style.filterSection}>
        <h1>წიგნები</h1>
        <SortComponent filterBooks={filterBooks} />
      </section>
    );
  };
  return (
    <DefaultLayout>
      <VisualGenres
        selectedGenre={selectedGenre2}
        setSelectedGenre={setSelectedGenre2}
        setGenre={setGenre}
      />
      <Filters />
      <section className={style.sortedBooksSection}>
        {books.map((book) => (
          <BookItem
            key={book._id}
            bookID={book._id}
            name={book.title}
            imgUrl={book.cover_image_url}
          />
          // key, name, imgUrl, bookID
        ))}
      </section>
      <footer>
        {(() => {
          const pages = [];

          // Show previous page if valid
          if (activePage > 1) {
            pages.push(activePage - 1);
          }

          // Always show active page
          pages.push(activePage);

          // Show next page if valid and not same as totalPages
          if (activePage + 1 < totalPages) {
            pages.push(activePage + 1);
          }

          // Show ellipsis if there's a gap before the last page
          if (activePage + 2 < totalPages) {
            pages.push("...");
          }

          // Always show last page if it's not already shown
          if (activePage !== totalPages) {
            pages.push(totalPages);
          }

          return pages.map((page, index) => {
            if (page === "...") {
              return (
                <span key={index} className={style.ellipsis}>
                  ...
                </span>
              );
            }

            return (
              <button
                key={page}
                onClick={() => setActivePage(page)}
                className={page === activePage ? style.activePage : style.page}
              >
                {page}
              </button>
            );
          });
        })()}
      </footer>
    </DefaultLayout>
  );
};

export default Books;
