import React, { useState, useEffect, useRef } from "react";
import style from "./SortComponent.module.css";

import SvgItem from "./FilterSvgs";

// TODO : pass on a function to set books with a certain filter one the correct data is fetched here

const mapping = {
  author: "authorSvg",
  date: "dateSvg",
};

const SortButton = ({ identifier }) => {
  return (
    <div className={style.svgBtnDiv}>
      <SvgItem name={mapping[identifier]} />
      <h3>{identifier.charAt(0).toUpperCase() + identifier.slice(1)}</h3>
    </div>
  );
};

const SortComponent = () => {
  return <h1>sort component</h1>;
};

export default SortComponent;
