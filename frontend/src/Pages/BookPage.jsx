import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const BookPage = () => {
  const { id } = useParams(); // Get the dynamic ID
  const [book, setBook] = useState(null);
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
    <div>
      <h1>{book.title}</h1>
      <img src={book.cover_image_url} alt="" />
    </div>
  );
};

export default BookPage;
