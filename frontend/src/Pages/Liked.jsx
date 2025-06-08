import React from "react";
import { Link } from "react-router-dom";
import style from "./Liked.module.css";
import DefaultLayout from "./DefaultLayout";
import FavBooks from "../modules/LikedSection/FavBooks";
import FavEssays from "../modules/LikedSection/FavEssays";

const Liked = () => {
  return (
    <DefaultLayout useAi={false}>
      <section className={style.favBookSection}>
        <FavBooks></FavBooks>
      </section>
      <section className={style.favEssaysSection}>
        <FavEssays />
      </section>
    </DefaultLayout>
  );
};

export default Liked;
