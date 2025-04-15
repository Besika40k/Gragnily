import style from "./Carousel.module.css";
import React, { useRef, useState, useEffect } from "react";
const Carousel = () => {
  const CarouselItems = [
    {
      id: 55,
      img: "https://cdn.pixabay.com/photo/2022/07/03/22/00/cat-7300029_1280.jpg",
      title: "კუნტი მეფე მეოთხე მეორადი 1",
      link: "https://example.com/book1",
    },
    {
      id: 56,
      img: "https://media.istockphoto.com/id/157512060/photo/kitten-plays-with-toy-mouse.webp?s=2048x2048&w=is&k=20&c=suYs_v3_IsBMbYcvs6xIXUAtnYlKhTI50V79h5YMZ7Q=",
      title: "ყველაზე მაგარი კნუტი",
      link: "https://example.com/book1",
    },
  ];
  // for scrolling
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showText, setShowText] = useState(true); // Track text animation
  const scrollRef = useRef(null);

  const scrollRight = () => {
    const scrollAmount = scrollRef.current.offsetWidth;
    console.log("scroll right");
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
      setCurrentIndex((prev) => Math.min(prev + 1, CarouselItems.length - 1));
    }
  };
  const scrollLeft = () => {
    const scrollAmount = scrollRef.current.offsetWidth;
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -scrollAmount - 10,
        behavior: "smooth",
      });
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
  };
  useEffect(() => {
    console.log("Current index changed to:", currentIndex);
    setShowText(false);
    const timeout = setTimeout(() => setShowText(true), 200);
    return () => clearTimeout(timeout);
  }, [currentIndex]);

  return (
    <section className={style.outerContainer}>
      <button onClick={scrollLeft} className={style.scrollLeftButton}>
        <i
          className="material-symbols-outlined"
          style={{ fontVariationSettings: '"wght" 100' }}
        >
          keyboard_arrow_left
        </i>
      </button>
      <div
        style={{ scrollBehavior: "smooth" }}
        ref={scrollRef}
        className={style.imgagesContainer}
      >
        {CarouselItems.map((item, index) => (
          <div
            key={item.id}
            className={style.item}
            style={{
              backgroundImage: `url(${item.img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              left: `${index * 100}%`,
            }}
          ></div>
        ))}
      </div>
      <button onClick={scrollRight} className={style.scrollRightButton}>
        <i
          className="material-symbols-outlined"
          style={{ fontVariationSettings: '"wght" 100' }}
        >
          keyboard_arrow_right
        </i>
      </button>
      <div className={style.rightDiv}>
        <h2 className={showText ? style.show : ""}>
          {CarouselItems[currentIndex]?.title}
        </h2>
        <button className={style.moreBtn}>მეტი</button>
      </div>
    </section>
  );
};

export default Carousel;
