import React, { useEffect, useState, useRef } from "react";
// import { Link } from "react-router-dom";
import style from "./Books.module.css";
import Loading from "../modules/Loading.jsx";
import VisualGenres from "../modules/VisualGenres/VisualGenres.jsx";
import DefaultLayout from "./DefaultLayout.jsx";
import SortComponent from "../modules/BooksSectionComponents/SortComponent.jsx";
const Books = () => {
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFiters] = useState(false);
  const filterContainerRef = useRef();

  const handleFiltersVisibility = () => {
    console.log("aa");
    setShowFiters((prev) => !prev);
  };

  // loading until the data is fetched
  if (loading) return <Loading />;

  const Filters = () => {
    return (
      <section className={style.filterSection}>
        <h1>წიგნები</h1>
        <SortComponent />
      </section>
    );
  };
  return (
    <DefaultLayout>
      <VisualGenres />
      <Filters />
    </DefaultLayout>
  );
};

export default Books;
