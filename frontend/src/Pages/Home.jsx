import React from "react";
import style from "./Home.module.css";
import AiSection from "../modules/AiSection/AiSection";
import SearchBar from "../modules/SearchBar/SearchBar";
import ArticleSection from "../modules/ArticlesSection/FavArticles";
import OurPickVisual from "../modules/OurPickVisual/OurPickVisual";
import Carousel from "../modules/Carousel/Carousel";
import DefaultLayout from "./DefaultLayout.jsx";
import PopularEssays from "../modules/Essays/PopularEssays";
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

  return (
    <DefaultLayout>
      <Carousel />
      <div className={style.ourPickSection}>
        <OurPickVisual />
      </div>
      <div className={style.articlesSection}>
        <PopularEssays />
      </div>
    </DefaultLayout>
  );
};

export default Home;
