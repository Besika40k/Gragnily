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
    imageDiv.style.backgroundImage = `url(https://www.naec.ge/uploads/postImage/3372/23779c1e-9e52-4165-aaaf-3cb5b9041e2f.jpg)`;
    textDiv.innerHTML =
      "8 მაისს აბიტურიენტების კითხვებს გეოგრაფიის, სამოქალაქო განათლებისა და სახვითი და გამოყენებითი ხელოვნების ჯგუფების ხელმძღვანელები უპასუხებენ";
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
        ? "https://www.naec.ge/uploads/postImage/3372/23779c1e-9e52-4165-aaaf-3cb5b9041e2f.jpg"
        : index === 1
        ? "https://www.naec.ge/uploads/postImage/3368/494689582_9558095797622851_2694272269557914972_n.jpg"
        : "https://www.naec.ge/uploads/postImage/3258/2.png"
    })`;
    textDiv.innerHTML =
      index === 0
        ? "8 მაისს აბიტურიენტების კითხვებს გეოგრაფიის, სამოქალაქო განათლებისა და სახვითი და გამოყენებითი ხელოვნების ჯგუფების ხელმძღვანელები უპასუხებენ"
        : index === 1
        ? "შეფასებისა და გამოცდების ეროვნული ცენტრი აგრძელებს საქართველოს სხვადასხვა რეგიონში დამამთავრებელი კლასის მოსწავლეებისათვის საინფორმაციო შეხვედრების გამართვას."
        : "საგანმანათლებლო პროგრამების რეიტინგულ სიაში ცვლილებების შეტანა (გადანაცვლება, წაშლა, დამატება) გამოსაცდელებს შეუძლიათ 23 აგვისტოს 18:00 საათამდე. ამ ვადის ამოწურვის შემდეგ საგანმანათლებლო პროგრამების პრიორიტეტულ ჩამონათვალში აბიტურიენტები ცვლილებებს ვეღარ შეიტანენ.";
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
