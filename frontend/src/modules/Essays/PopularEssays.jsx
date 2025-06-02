import React, { useState, useRef } from "react";
import style from "./PopularEssays.module.css";
import EssaysSvgs from "./EssaysSvgs";
const PopularEssays = () => {
  const scrollRef = useRef(null);
  const [popular, setPopular] = useState([1, 2, 3, 4]);
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
        <h2>პოპულარული</h2>
        <div className={style.buttonsDiv}>
          <button className={style.fullButton}>სრულად</button>
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
          {popular.map((item) => (
            <div className={style.item}>
              <EssaysSvgs name="essay" />
              <h3>a</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default PopularEssays;
