import React from "react";
import style from "./ArticleItem.module.css";

const ArticleItem = ({ imgUrl, date, descr }) => {
  // give this article props such as img url, text, link etc and then return the finished div component
  return (
    <a
      href="https://www.naec.ge/#/ge/index"
      target="_blank"
      className={style.articleItem}
    >
      <div className={style.leftDiv}>
        <div
          style={{
            backgroundImage: `url(https://images6.alphacoders.com/596/thumb-1920-596884.jpg)`,
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
