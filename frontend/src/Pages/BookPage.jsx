import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import style from "./BookPage.module.css";
import BookPageSVGS from "./BookPageSVGS"; // Import the SVG component

import Loading from "../modules/Loading"; // Import the Loading component

const BookPage = () => {
  const { id } = useParams(); // Get the dynamic ID
  const [book, setBook] = useState(null);
  const [author, setAuthor] = useState("");

  const [authorArr, setAuthorArr] = useState([]);

  const cleanId = id.substring(1, id.length); // Clean the ID to ensure it's a number
  useEffect(() => {
    fetch(`https://gragnily.onrender.com/api/books/${cleanId}`, {
      method: "GET",
      credentials: "include",
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.ok) {
          console.log("Book retriaval successful!", data);
          let authors = "";
          let authorsArr = [];
          const authorPromises = (
            Array.isArray(data.author) ? data.author : [data.author]
          ).map((element) =>
            fetch(
              `https://gragnily.onrender.com/api/authors/${element.author_id}`,
              {
                method: "GET",
                credentials: "include", // Optional if you're using cookies/auth
              }
            )
              .then(async (response) => {
                const data = await response.json();
                if (response.ok) {
                  authors += data.name + " ";
                  authorsArr.push(data);
                } else {
                  console.error("Error fetching author:", data.message);
                }
              })
              .catch((error) => {
                console.error("Network error:", error);
              })
          );

          // Wait for all author fetches to finish
          Promise.all(authorPromises).then(() => {
            setAuthor(authors); // Set authors after all fetches are done
            setAuthorArr(authorsArr);
            console.log("Authors:", authorsArr);
            console.log("Authors:", authorsArr[0]);
          });
          setBook(data);
        } else {
          switch (data.message) {
          }
        }
      })
      .catch((error) => {
        console.error("Network error:", error);
        alert("Something went wrong. Please try again later.");
      });
  }, [cleanId]);

  function InfoItem(props) {
    return (
      <div className={style.infoItem}>
        <h3>{props.title}</h3>
        <p>{props.description}</p>
      </div>
    );
  }

  return book && author ? (
    <div className={style.outerDivContainer}>
      <div className={style.innerDivContainer}>
        <section className={style.bookSection}>
          <div
            className={style.bookImg}
            style={{
              backgroundImage: `url('${book?.cover_image_url}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <div className={style.bookRightDiv}>
            <h1>{book?.title}</h1>
            <h3>{author}</h3>
            <div className={style.buttonsDiv}>
              <button className={style.readButton}>Read</button>
              <BookPageSVGS name="downloadSvg" />
              <BookPageSVGS name="bookmarkSvg" />
            </div>
            <h2>Description</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus
              alias velit harum facere minima. Sint magni maiores nesciunt
              placeat, fugit deserunt alias, vel molestias tenetur culpa
              eveniet. Sapiente non vero asperiores, omnis inventore maxime eius
              ipsa nemo voluptate nobis illo possimus totam aut quaerat eaque
              provident doloremque, ducimus distinctio ipsam.
            </p>
          </div>
        </section>
        {authorArr.map((autora) => {
          console.log("Authoraaaaaaaaaaaaaaaaaaaaaaaaaaaa:", autora);
          return (
            <section key={autora.name} className={style.authorSection}>
              <h2>{autora.name}</h2>
              <div className={style.authorLeftDiv}>
                <div
                  className={style.authorImg}
                  style={{
                    backgroundImage: `url('${
                      autora.profile_picture_url
                        ? autora.profile_picture_url
                        : "https://upload.wikimedia.org/wikipedia/en/f/f7/JoJo_no_Kimyou_na_Bouken_cover_-_vol1.jpg"
                    }')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    height: "100px",
                    width: "100px",
                    borderRadius: "50%",
                    border: "2px solid var(--icon-line)",
                  }}
                ></div>
              </div>
              <div className={style.authorRightDiv}>
                <div className={style.authorTopDiv}>
                  <div className={style.authorTextDiv}>
                    <h3>{autora.name}</h3>
                    <div>
                      <p>bbbbbb</p>
                      {/* {autora.bio} */}
                      <p>ccccc</p>
                      {/* {autora.bio} */}
                    </div>
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Animi, fuga?
                    </p>{" "}
                    {/* {autora.bio} */}
                  </div>
                  <button className={style.viewWorkButton}>
                    View Other Work
                  </button>
                </div>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Voluptas nostrum laboriosam ut eius dolor, ea dignissimos
                  vitae id? Omnis.
                </p>
              </div>
            </section>
          );
        })}

        <section className={style.infoSection}>
          <InfoItem
            key="2"
            title="Published"
            description={book?.publication_year}
          />
          <InfoItem key="3" title="Genre" description={book?.genre.join(",")} />
          <InfoItem
            key="4"
            title="Details"
            description={`Language: ${book?.language}`}
          />
          <InfoItem key="5" title="Publisher" description={book?.publisher} />
        </section>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default BookPage;
