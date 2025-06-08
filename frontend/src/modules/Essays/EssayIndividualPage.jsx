import React from "react";
import { useEffect, useState, useRef } from "react";
import EssayItem from "../../modules/Essays/EssayItem.jsx";
import Loading from "../../modules/Loading.jsx";
import style from "./EssayIndividualPage.module.css";
import { useLocation } from "react-router-dom";
import html2pdf from "html2pdf.js";
import ReactMarkdown from "react-markdown";
import DefaultLayout from "../../Pages/DefaultLayout.jsx";
import BookPageSVGS from "../../Pages/BookPageSVGS.jsx";
import { useUser } from "../../contexts/UserContext.jsx";
const EssayIndividualPage = () => {
  const location = useLocation();
  const [essay, setEssay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState("no author");
  const [essayCount, setEssayCount] = useState(1);
  const [liked, setLiked] = useState(false);
  const pdfRef = useRef();
  const bookmarkBtn = useRef();

  const { user, updateUser } = useUser();

  const essayId = location.pathname.split("/").pop();

  let numOfEssays = 1;
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
        setEssay(data.Essay);
        setAuthor(data.Essay.author_id.username);
        setEssayCount(data.numOfEssays);
        setLiked(data.liked);
        console.log(data.Essay._id, data.liked);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching essay:", error);
        setLoading(false);
      });
  }, []);

  const handleBookmark = () => {
    console.log(liked);
    fetch("https://gragnily.onrender.com/api/likes/like", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        type: "essay",
        objectId: essay._id,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then((data) => {
        console.log("Like successful:", data);
        setLiked((prev) => !prev);
        console.log(liked);
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  const handleDownload = () => {
    const element = pdfRef.current;
    console.log(element, "download clicked");
    html2pdf()
      .set({
        margin: 10,
        filename: "markdown.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .save();
  };

  return (
    <div className={style.essayPage}>
      {loading ? (
        <Loading />
      ) : (
        <DefaultLayout topSection={true}>
          <div className={style.essayContainer}>
            <img
              src={essay.cover_image_url}
              alt="Cover"
              className={style.imageFloat}
            />
            <div className={style.flexDiv}>
              <h1>{essay.title}</h1>
              <div className={style.flexDiv}>
                <button className={style.dissapear} onClick={handleDownload}>
                  <BookPageSVGS
                    className={style.svgButton}
                    name={"downloadSvg"}
                  />
                </button>
                <button
                  className={style.dissapear}
                  ref={bookmarkBtn}
                  onClick={handleBookmark}
                >
                  {user.email == "" ? undefined : liked ? (
                    <BookPageSVGS
                      className={style.svgButton}
                      name="likedLikeSVG"
                    />
                  ) : (
                    <BookPageSVGS className={style.svgButton} name="likeSVG" />
                  )}
                </button>
              </div>
            </div>
            <div className={style.authorDiv}>
              <img src="" alt="" />
              <h2>
                {author} -
                <span
                  style={{
                    fontSize: "0.8em",
                    color: "#3c3c3cc1",
                    marginLeft: "5px",
                  }}
                >
                  {`${essayCount} ესე`}
                </span>
              </h2>
            </div>
            <div ref={pdfRef} className={style.markdownContainer}>
              <ReactMarkdown
                components={{
                  p: ({ node, ...props }) => (
                    <p className={style.paragraph} {...props} />
                  ),
                  h1: ({ node, ...props }) => (
                    <h1 className={style.heading} {...props} />
                  ),
                }}
              >
                {essay.content}
              </ReactMarkdown>
            </div>
          </div>
        </DefaultLayout>
      )}
    </div>
  );
};
export default EssayIndividualPage;
