import React, { useEffect, useState } from "react";
import DefaultLayout from "./DefaultLayout";
import style from "./Articles.module.css";
import ArticlesCarousel from "../modules/ArticlesSection/ArticlesCarousel";
import ArticleItem from "../modules/ArticlesSection/ArticleItem";

const Articles = () => {
  const [articlesArray, setArticlesArray] = useState(["a", "b", "c", "d"]);
  return (
    <DefaultLayout>
      <div className="articles-page">
        <div className={style.topDiv}>
          <h1>პოპულარული</h1>
          <ArticlesCarousel />
        </div>
        <div className={style.bottomDiv}>
          <div className={style.flexContainer}>
            <h3>უახლესი</h3>
            <a href="https://www.naec.ge/#/ge/index" target="_blank">
              <button>მეტის ნახვა</button>
            </a>
          </div>
          <div className={style.articlesContainer}>
            {articlesArray?.map((article) => (
              <ArticleItem
                imgUrk="https://images6.alphacoders.com/596/thumb-1920-596884.jpg"
                date={"19.02.1222"}
                descr="aaaawda awd awdawd awd nawod nawdn awnd awnd ljawnd lawnd awnd onaw dnawnd awnd kaw dnawknd kaw n"
              />
            ))}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Articles;
