import React from "react";
import { useEffect, useState } from "react";
import EssayItem from "../../modules/Essays/EssayItem.jsx";
import Loading from "../../modules/Loading.jsx";
import style from "./EssayIndividualPage.module.css";
import { useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";

const EssayIndividualPage = () => {
  const location = useLocation();
  const [essay, setEssay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState(null);
  const essayId = location.pathname.split("/").pop();

  useEffect(() => {
    setLoading(true);
    fetch(`https://gragnily.onrender.com/api/essays/getEssay/${essayId}`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch essay", response.status);
        }
        return response.json();
      })
      .then((data) => {
        setEssay(data);
        console.log("Fetched essay:", data);
        setLoading(false);
        //fetch author data
        // fetch(`https://gragnily.onrender.com/api/essays/getEssay/${essayId}`, {
        //   method: "GET",
        //   credentials: "include",
        // })
        //   .then((response) => {
        //     if (!response.ok) {
        //       throw new Error("Failed to fetch essay", response.status);
        //     }
        //     return response.json();
        //   })
        //   .then((data) => {
        //     setAuthor(data);
        //     setLoading(false);
        //     console.log("Fetched essay:", data);
        //   })
        //   .catch((error) => {
        //     console.error("Error fetching essay:", error);
        //     setLoading(false);
        //   });
      })
      .catch((error) => {
        console.error("Error fetching essay:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className={style.essayPage}>
      {loading ? (
        <Loading />
      ) : (
        <div className={style.essayContainer}>
          <div className={style.innerContainer}>
            <div className={style.flexDiv}>
              <h1>{essay.title}</h1>
              <div className={style.flexDiv}>
                <button>Read</button>
                <button>Download</button>
                <button>Like</button>
              </div>
            </div>
            <h2>author name</h2>
            <div className={style.essayContent}>
              <ReactMarkdown>{essay.content}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default EssayIndividualPage;
