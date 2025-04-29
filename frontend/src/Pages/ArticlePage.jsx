import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const ArticlePage = () => {
  const { id } = useParams(); // Get the dynamic ID
  const [article, setArticle] = useState(null);

  useEffect(() => {
    // Fetch article data (simulate or from API)
    fetch(`https://your-api.com/articles/${id}`)
      .then((res) => res.json())
      .then((data) => setArticle(data));
  }, [id]);

  if (!article) return <div>Loading...</div>;

  return (
    <div>
      <h1>{article.title}</h1>
      <p>Author: {article.author}</p>
      <p>Description: {article.description}</p>
    </div>
  );
};

export default ArticlePage;
