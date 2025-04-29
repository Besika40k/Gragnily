import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const BookPage = () => {
  const { id } = useParams(); // Get the dynamic ID
  const [book, setBook] = useState(null);

  useEffect(() => {
    // Fetch book data (simulate or from API)
    fetch(`https://your-api.com/books/${id}`)
      .then((res) => res.json())
      .then((data) => setBook(data));
  }, [id]);

  if (!book) return <div>Loading...</div>;

  return (
    <div>
      <h1>{book.title}</h1>
      <p>Author: {book.author}</p>
      <p>Description: {book.description}</p>
      {/* Add image, price, reviews, etc. */}
    </div>
  );
};

export default BookPage;
