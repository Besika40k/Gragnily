import React from "react";
import style from "./ArticleItem.module.css";

const ArticleItem = ({ imgUrl, date, descr, linkUrl }) => {
  // give this article props such as img url, text, link etc and then return the finished div component
  return (
    <a href={linkUrl} target="_blank" className={style.articleItem}>
      <div className={style.leftDiv}>
        <div
          style={{
            backgroundImage: `url(${imgUrl})`,
          }}
          className={style.imgDiv}
        ></div>
        <p>{date}</p>
      </div>
      <p className={style.rightP}>{descr}</p>
    </a>
  );
};

export default ArticleItem;
