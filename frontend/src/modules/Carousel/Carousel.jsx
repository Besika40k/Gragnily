import style from "./Carousel.module.css";
import React, { useRef, useState, useEffect } from "react";
const Carousel = () => {
  const CarouselItems = [
    {
      id: 55,
      img: "https://www.naec.ge/uploads/postImage/3380/%E1%83%98.jpg",
      title:
        "კემბრიჯის გამოცდების კომპიუტერულ ვერსიებზე CB FCE და CB CAE რეგისტრაცია იწყება",
      link: "https://www.naec.ge/#/ge/post/3380",
    },
    {
      id: 56,
      img: "https://www.naec.ge/uploads/postImage/3372/23779c1e-9e52-4165-aaaf-3cb5b9041e2f.jpg",
      title:
        "8 მაისს აბიტურიენტების კითხვებს გეოგრაფიის, სამოქალაქო განათლებისა და სახვითი და გამოყენებითი ხელოვნების ჯგუფების ხელმძღვანელები უპასუხებენ",
      link: "https://www.naec.ge/#/ge/post/3372",
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
