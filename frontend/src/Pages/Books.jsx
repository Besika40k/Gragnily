import React, { useEffect, useState, useRef } from "react";
// import { Link } from "react-router-dom";
import style from "./Books.module.css";
import SearchBar from "../modules/SearchBar/SearchBar.jsx";
import VisualGenres from "../modules/VisualGenres/VisualGenres.jsx";
import Loading from "../modules/Loading.jsx";
import SortComponent from "../modules/BooksSectionComponents/SortComponent.jsx";
import AiSection from "../modules/AiSection/AiSection.jsx";

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
        <h1>წიგნები</h1>
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
          <button onClick={handleFiltersVisibility}>დაალაგე</button>
        </div>
      </section>
    );
  };
  return (
    <div className={style.allContainer}>
      <div className={style.content}>
        <div className={style.topSection}>
          <h2>Gragnily</h2>
          <SearchBar />
        </div>
        <VisualGenres />
        <Filters />
      </div>

      <AiSection />
    </div>
  );
};

export default Books;
