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

const SortButton = ({ identifier }) => {
  return (
    <div className={style.svgBtnDiv}>
      <SvgItem name={mapping[identifier]} />
      <h3>
        {identifier == "sortby"
          ? "SORT BY"
          : identifier.charAt(0).toUpperCase() + identifier.slice(1)}
      </h3>
    </div>
  );
};

const SortComponent = () => {
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
        <SortButton identifier={"author"} />
        <SortButton identifier={"date"} />
        <SortButton identifier={"popularity"} />
        <SortButton identifier={"name"} />
      </section>
      <div onClick={handleShowOptions} className={style.svgBtnDiv}>
        <SvgItem name={"sortBySvg"} />
        <h3>SORT BY</h3>
      </div>
    </div>
  );
};

export default SortComponent;
