import React from "react";
import { useEffect, useState } from "react";
import EssayItem from "../../modules/Essays/EssayItem.jsx";
import Loading from "../../modules/Loading.jsx";
import style from "./EssayIndividualPage.module.css";
import { useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import DefaultLayout from "../../Pages/DefaultLayout.jsx";
const EssayIndividualPage = () => {
  const location = useLocation();
  const [essay, setEssay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState(null);
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
        setEssay(data);
        console.log("Fetched essay:", data);
        setLoading(false);
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
                <button>Download</button>
                <button>Like</button>
              </div>
            </div>
            <div className={style.authorDiv}>
              <img src="" alt="" />
              <h2>
                author name -{" "}
                <span style={{ fontSize: "0.8em", color: "#3c3c3cc1" }}>
                  {`${numOfEssays} ${numOfEssays === 1 ? "essay" : "essays"}`}
                </span>
              </h2>
            </div>
            <ReactMarkdown
              components={{
                p: ({ node, ...props }) => (
                  <p className={style.paragraph} {...props} />
                ),
                h1: ({ node, ...props }) => (
                  <h1 className={style.heading} {...props} />
                ),
              }}
            >{`# The Value of Simplicity in Modern Technology\n
\n
In an age dominated by rapid innovation and increasingly complex systems, **simplicity has become a rare but valuable asset**. As technology continues to evolve, there is a growing need to revisit the fundamentals of clear design, intuitive interfaces, and minimalism.\n
\n
## Why Simplicity Matters\n
\n
Simplicity enhances usability. When users interact with a product, they shouldn't need a manual to understand how it works. Great products often **"just work"** — they anticipate user needs and present only what's necessary. Consider the success of tools like Google Search or the iPhone: their intuitive design is part of what made them revolutionary.\n
\n
## Benefits of Simple Design\n
\n
- **Efficiency**: Reduces cognitive load and learning time.\n
- **Accessibility**: Makes technology usable by a wider audience.\n
- **Maintainability**: Easier to update and debug.\n
\n
> "Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away."  \n
> — *Antoine de Saint-Exupéry*\n
\n
## Striking a Balance\n
\n
Simplicity does not mean lacking functionality. The goal is to hide complexity behind elegant design. Developers and designers should ask: *What can be removed without hurting the user experience?*\n
\n
## Conclusion\n
\n
In the pursuit of innovation, we must not forget that **clarity, simplicity, and usability** are what make technology truly human-friendly. The future belongs to tools that empower users—not overwhelm them.\n
\n
---\n
\n
*Written in Markdown format.*\n
`}</ReactMarkdown>
          </div>
        </DefaultLayout>
      )}
    </div>
  );
};
export default EssayIndividualPage;
