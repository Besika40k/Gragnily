import React from "react";
import { useEffect, useState } from "react";
import EssayItem from "../../modules/Essays/EssayItem.jsx";
import Loading from "../../modules/Loading.jsx";
import style from "./EssayIndividualPage.module.css";
import { useLocation } from "react-router-dom";

const EssayIndividualPage = () => {
  const location = useLocation();
  const [essay, setEssay] = useState(null);
  const essayId = location.pathname.split("/").pop(); // Extracting the essay ID from the URL
  const [loading, setLoading] = useState(true);

  return (
    <div className={style.essayPage}>
      {loading ? (
        <Loading />
      ) : (
        <div className={style.essayContainer}>
          {essay && <EssayItem essay={essay} />}
        </div>
      )}
    </div>
  );
};
export default EssayIndividualPage;
