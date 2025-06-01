import React, { useState, useEffect, useRef } from "react";
import style from "./ArticlesCarousel.module.css";
const ArticlesCarousel = () => {
  const [articles, setArticles] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  // on load request data for carousel
  useEffect(() => {
    setActiveIndex(0);
    const imageDiv = image.current;
    const textDiv = text.current;
    imageDiv.style.backgroundImage = `url(https://wallpapercat.com/w/full/2/0/6/1215980-3840x2160-desktop-4k-goku-background-image.jpg)`;
    textDiv.innerHTML = "გოკუ ყველაზე მაგარი ტიპია რომელიც ამ სამყაროში ყოფილა";
  }, []);

  const image = useRef(null);
  const text = useRef(null);

  const handlePageChange = (index) => {
    setActiveIndex(index);
    console.log("Changing page to", index);
    const imageDiv = image.current;
    const textDiv = text.current;
    imageDiv.style.backgroundImage = `url(${
      index === 0
        ? "https://wallpapercat.com/w/full/2/0/6/1215980-3840x2160-desktop-4k-goku-background-image.jpg"
        : index === 1
        ? "https://external-preview.redd.it/JXCmh59qYx7bPON7vm5njWGzSepPJzrWvGg7LomJjA8.png?format=pjpg&auto=webp&s=5be24a01b75d58fc28fcc62f8520ca37da2a222a"
        : "https://4kwallpapers.com/images/wallpapers/invincible-2023-3840x2160-13436.jpg"
    })`;
    textDiv.innerHTML = "გოკუ ყველაზე მაგარი ტიპია რომელიც ამ სამყაროში ყოფილა";
    // change the image and text based on the index
  };
  return (
    <div className={style.carouselContainer}>
      <div ref={image} className={style.imageDiv}>
        <div className={style.textDiv}>
          <p ref={text}></p>
        </div>
      </div>
      <div className={style.dotDiv}>
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={`${style.dot} ${
              activeIndex === index ? style.activeDot : ""
            }`}
            onClick={() => handlePageChange(index)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ArticlesCarousel;
