import React from "react";
import style from "./Home.module.css";
import AiSection from "../modules/AiSection/AiSection";
import SearchBar from "../modules/SearchBar/SearchBar";
import ArticleSection from "../modules/ArticlesSection/FavArticles";
import OurPickVisual from "../modules/OurPickVisual/OurPickVisual";
import Carousel from "../modules/Carousel/Carousel";

//test
import { useEffect } from "react";
import { useUser } from "../contexts/UserContext";
//test
const Home = () => {
  //test
  const { user } = useUser();
  useEffect(() => {
    console.log("User data from context:", user);
  }, [user]);

  //test
  return (
    <div className={style.home}>
      <div className={style.homeContent}>
        <div className={style.topSection}>
          <h2>Gragnily</h2>
          <SearchBar />
        </div>
        <Carousel />
        <div className={style.ourPickSection}>
          <OurPickVisual />
        </div>
        <div className={style.articlesSection}>
          <ArticleSection />
        </div>
      </div>
      <AiSection />
    </div>
  );
};

export default Home;
