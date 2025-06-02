import React, { useState } from "react";
import style from "./EssayFilters.module.css";
import EssaySvgs from "./EssaysSvgs.jsx";
const EssayFilters = ({ changeFilters }) => {
  const [filters, setFilters] = useState({
    ინგლიური: "",
    ქართული: "",
    ისტორია: "",
    რუსული: "",
    ფრანგული: "",
    გერმანული: "",
  });

  return (
    <section className={style.filtersSection}>
      {Object.entries(filters).map((filter, index) => (
        <div
          onClick={() => {
            console.log(
              "filter clicked",
              filter,
              filters[filter[0]],
              filters[filter[1]]
            );
            let newFilters = { ...filters };
            newFilters[filter[0]] =
              filters[filter[0]] == "true" ? "false" : "true";
            setFilters(newFilters);
            changeFilters(newFilters);
          }}
          className={`${style.filterItem} ${
            filters[filter[0]] == "true" ? style.activeFilter : style.filterItem
          }`}
          key={index}
        >
          <div
            className={`${style.checkDiv} ${
              filters[filter[0]] == "true" ? style.activeCheck : style.checkDiv
            }`}
          >
            <EssaySvgs name="checkedSVG" />
          </div>
          <p>{filter[0]}</p>
        </div>
      ))}
    </section>
  );
};
export default EssayFilters;
