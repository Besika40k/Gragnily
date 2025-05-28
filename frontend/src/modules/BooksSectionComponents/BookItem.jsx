import React, { useState, useEffect } from "react";
import style from "./BookItem.module.css";
import Color from "color-thief-react";
import { Link } from "react-router-dom";
const SvgItem = ({ color, imageUrl }) => {
  return (
    <svg
      width="119"
      height="188"
      viewBox="0 0 109 168"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ borderTopRightRadius: "20px", overflow: "none" }}
    >
      <path
        d="M0.324219 150.176V18.7853C0.324219 8.92393 6.99325 0.928711 15.2224 0.928711H98.1512C103.881 0.928711 108.525 6.49568 108.525 13.363V136.636C107.355 143.854 46.6469 146.319 0.324219 150.176Z"
        fill="#565656"
      />
      <path
        d="M15.097 0.928711V145.85L0.324219 150.176V18.7853C0.324219 8.92393 6.99324 0.928711 15.2223 0.928711"
        fill={color}
      />
      <path
        d="M101.238 140.804H105.044C106.965 140.804 108.521 138.938 108.521 136.636C108.521 134.334 106.965 132.468 105.044 132.468H15.0931C6.93363 132.468 0.320312 140.394 0.320312 150.174C0.320312 159.954 6.93363 167.88 15.0931 167.88H105.044C106.965 167.88 108.521 166.014 108.521 163.712C108.521 161.41 106.965 159.544 105.044 159.544H101.238V140.804Z"
        fill={color}
      />
      <path
        d="M16.0153 159.548H104.403V140.804H16.0153C11.6972 140.804 8.19629 145 8.19629 150.176C8.19629 155.351 11.6972 159.548 16.0153 159.548Z"
        fill="#F5CD94"
      />
      <image href={imageUrl} x="8" y="1" width="100%" height="78%" />
    </svg>
  );
};

const BookItem = ({ name, imgUrl, bookID }) => {
  return (
    <Link style={{ textDecoration: "none" }} to={`/books/:${bookID}`}>
      <div className={style.bookItem}>
        <div className={style.bookTopDiv}>
          <Color src={imgUrl} crossOrigin="anonymous" format="hex">
            {({ data, loading, error }) => {
              if (loading) return <p>Loading...</p>;
              if (error) return <p>Error loading color</p>;
              return <SvgItem color={data} imageUrl={imgUrl} />;
            }}
          </Color>
        </div>
        <h3>{name}</h3>
      </div>
    </Link>
  );
};
export default BookItem;
