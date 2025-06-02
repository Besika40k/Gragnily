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
            <ArticleItem
              imgUrl="https://www.naec.ge/uploads/postImage/3380/%E1%83%98.jpg"
              date={"30.05.2025"}
              descr="კემბრიჯის გამოცდების კომპიუტერულ ვერსიებზე CB FCE და CB CAE რეგისტრაცია იწყება"
              linkUrl="https://www.naec.ge/#/ge/post/3380"
            />
            <ArticleItem
              imgUrl="https://www.naec.ge/uploads/postImage/3372/23779c1e-9e52-4165-aaaf-3cb5b9041e2f.jpg"
              date={"06.05.2025"}
              descr="8 მაისს აბიტურიენტების კითხვებს გეოგრაფიის, სამოქალაქო განათლებისა და სახვითი და გამოყენებითი ხელოვნების ჯგუფების ხელმძღვანელები უპასუხებენ"
              linkUrl="https://www.naec.ge/#/ge/post/3372"
            />
            <ArticleItem
              imgUrl="https://www.naec.ge/uploads/postImage/3379/502495328_1116863070471104_3855207385983351887_n.jpg"
              date="29.05.2025"
              descr="გამოცდები 2025 - საორგანიზაციო ჯგუფის სხდომა"
              linkUrl="https://www.naec.ge/#/ge/post/3379"
            />
            <ArticleItem
              imgUrl="https://naec.ge/uploads/postImage/3328/3.jpg"
              date={"24.04.2025"}
              descr="„ცნობარი აბიტურიენტებისათვის“ 2025"
              linkUrl="https://naec.ge/#/ge/post/3328"
            />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Articles;
