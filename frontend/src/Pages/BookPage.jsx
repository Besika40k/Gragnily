import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import style from "./BookPage.module.css"; // Import your CSS module
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
        console.log(response, data);
        if (response.ok) {
          console.log("Book retriaval successful!", data);
          console.log("Book data", typeof data.author);
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
                  console.log("Author data", authors);
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
            console.log("Authors array", authorsArr);
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

  if (!book) return <div>Loading...</div>;
  console.log("book data", book._id);

  return (
    <div className={style.outerDivContainer}>
      <div className={style.innerDivContainer}>
        <section className={style.bookSection}>
          <div
            className={style.bookImg}
            style={{
              backgroundImage: `url('${book.cover_image_url}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              height: "300px",
              width: "200px",
            }}
          ></div>
          <div className={style.bookRightDiv}>
            <h1>{book.title}</h1>
            <h3>{author}</h3>
            <div className={style.buttonsDiv}>
              <button className={style.readButton}>Read</button>
              {/* svg for download
              svg for bookmark */}
            </div>
            <h2>Description</h2>
            <p></p>
          </div>
        </section>

        <section className={style.authorSection}></section>
        <section className={style.infoSection}></section>
      </div>
    </div>
  );
};

export default BookPage;
