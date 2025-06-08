import React, { useState, useEffect, useRef } from "react";
import style from "./SortComponent.module.css";

import SvgItem from "./FilterSvgs";

// TODO : pass on a function to set books with a certain filter one the correct data is fetched here

const mapping = {
  author: "authorSvg",
  date: "dateSvg",
  sortby: "sortBySvg",
  popularity: "popularSvg",
  name: "nameSvg",
};
const geoMapping = {
  author: "ავტორი",
  date: "თარიღი",
  sortby: "გაფილტვრა",
  popularity: "პოპულარობა",
  name: "სახელი",
};
const SortButton = ({ identifier, filterBooks = () => {} }) => {
  return (
    <div
      onClick={() => {
        filterBooks(identifier);
      }}
      className={style.svgBtnDiv}
    >
      <SvgItem name={mapping[identifier]} />
      <h3>{geoMapping[identifier]}</h3>
    </div>
  );
};

const SortComponent = ({ filterBooks = () => {} }) => {
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef(null);

  const handleShowOptions = () => {
    console.log("show options");
    setShowOptions((prev) => !prev);
  };

  return (
    // {/* the hidden filters section */}

    // {/*always shown section, with control on rotation of the svg*/}
    <div className={style.sortComponent}>
      <section
        ref={optionsRef}
        className={`${style.optionsSection} ${showOptions ? style.show : ""}`}
      >
        <SortButton
          filterBooks={() => filterBooks("author")}
          identifier={"author"}
        />
        <SortButton
          filterBooks={() => filterBooks("date")}
          identifier={"date"}
        />
        <SortButton
          filterBooks={() => filterBooks("popularity")}
          identifier={"popularity"}
        />
        <SortButton
          filterBooks={() => filterBooks("name")}
          identifier={"name"}
        />
      </section>
      <div onClick={handleShowOptions} className={style.svgBtnDiv}>
        <SvgItem name={"sortBySvg"} />
        <h3>გაფილტვრა</h3>
      </div>
    </div>
  );
};

export default SortComponent;
