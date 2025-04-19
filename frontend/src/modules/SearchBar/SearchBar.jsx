import React from "react";
import style from "./SearchBar.module.css";
const SearchBar = () => {
  return (
    <div className={style.searchOuterContainer}>
      <div className={style.searchInnerContainer}>
        <input
          placeholder="Search here"
          className={style.searchBar}
          type="text"
          name="seachBar"
        />
        <label className={style.searchIcon} htmlFor="seachBar">
          icon
        </label>
      </div>
      <ul className={style.foundItems}>
        <li> item 1 pages 55 aithoraaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaa </li>
        <li> item 1 pages 55 aithor me</li>
        <li> item 1 pages 55 aithor me</li>
      </ul>
    </div>
  );
};
export default SearchBar;
