import React, { useState, useRef, useEffect } from "react";
import style from "./PopularEssays.module.css";
import { Link } from "react-router-dom";
const PopularEssays = () => {
  const scrollRef = useRef(null);
  const [popular, setPopular] = useState([]);
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 300, // Adjust this value as needed
        behavior: "smooth",
      });
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -350,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const params = {
      page: 0,
      limit: 15,
      popularity: "true",
    };
    const queryString = new URLSearchParams(params).toString();
    console.log("getting data", queryString);
    fetch(
      `https://gragnily.onrender.com/api/search/essayFilter?${queryString}`,
      {
        method: "GET",
        credentials: "include",
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch articles populars", response.status);
        }
        return response.json();
      })
      .then((data) => {
        console.log("CHAOS", data);
        if (data.length == 0 || data.Books.length == 0) {
          setPopular([
            {
              _id: 1,
              cover_image_url:
                "https://ecdn.teacherspayteachers.com/thumbitem/Design-your-own-Book-Cover-Printable-Blank-Book-10355131-1698669978/original-10355131-1.jpg",
              title: "არტიკლები ვერ მოიძებნა",
            },
          ]);
        } else {
          setPopular(data.Books);
        }
      })
      .catch((error) => {
        console.error(" Error fetching books:", error);
      });
  }, []);

  return (
    <div className={style.ourPickVisual}>
      <div className={style.pickTopDiv}>
        <h2>პოპულარული ესეები</h2>
        <div className={style.buttonsDiv}>
          <Link to={"/articles"}>
            <button className={style.fullButton}>სრულად</button>
          </Link>
          <button onClick={scrollLeft} className={style.scrollLeftButton}>
            <i className="material-icons">keyboard_arrow_left</i>
          </button>
          <button onClick={scrollRight} className={style.scrollRightButton}>
            <i className="material-icons">keyboard_arrow_right</i>
          </button>
        </div>
      </div>
      <div className={style.scrollWrapper}>
        <div
          style={{ scrollBehavior: "smooth" }}
          ref={scrollRef}
          className={style.pickBottomDiv}
        >
          {popular.map((item) => {
            const patternId = `imagePattern-${item._id}`;
            return (
              <Link to={`/essays/${item._id}`}>
                <div key={item._id} className={style.item}>
                  <svg
                    width="100"
                    height="160"
                    viewBox="0 0 41 53"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      filter: "drop-shadow(2px 2px 6px rgba(0, 0, 0, 0.5))",
                    }}
                  >
                    <defs>
                      <pattern
                        id={patternId}
                        patternUnits="userSpaceOnUse"
                        width="41"
                        height="53"
                      >
                        <image
                          href={item.cover_image_url}
                          x="0"
                          y="0"
                          width="41"
                          height="53"
                          preserveAspectRatio="xMidYMid slice"
                        />
                      </pattern>
                    </defs>
                    <path
                      d="M40.7871 49.2786C40.7871 50.9326 39.4411 52.2786 37.7871 52.2786H14.0331H3.78711C2.13311 52.2786 0.787109 50.9326 0.787109 49.2786V3.27856C0.787109 1.62456 2.13311 0.278564 3.78711 0.278564H28.7871V11.2786C28.7871 11.8306 29.2351 12.2786 29.7871 12.2786H40.7871V49.2786ZM30.7871 10.2786V1.69256L39.3731 10.2786H30.7871Z"
                      fill={`url(#${patternId})`}
                    />
                  </svg>
                  <h3>{item.title}</h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default PopularEssays;
