import React from "react";
import style from "./FavArticles.module.css";
import ArticleRow from "./ArticlesRow";

const FavArticles = () => {
  // in home pageg request favorite articles list and return a component as needed with scrollbar and every Articles Row in one row
  return (
    <div style={{ color: "grey", userSelect: "none" }}>
      <h1>scroll bar</h1>
      <p>articles will be here once implemented</p>
    </div>
  );
};

export default FavArticles;
