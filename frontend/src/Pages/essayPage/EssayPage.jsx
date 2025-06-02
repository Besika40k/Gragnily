import React, { useEffect, useState } from "react";
import DefaultLayout from ".././DefaultLayout.jsx";
import EssayFilters from "../../modules/Essays/EssayFilters.jsx";
import PopularEssays from "../../modules/Essays/PopularEssays.jsx";
import EssaysSvgs from "../../modules/Essays/EssaysSvgs.jsx";
import Pages from "../../modules/Essays/Pages.jsx";
import EssayItem from "../../modules/Essays/EssayItem.jsx";
import style from "./EssayPage.module.css";
const EssayPage = () => {
  const [essays, setEssays] = useState([]);
  const [filters, setFilters] = useState({
    ინგლიური: "",
    ქართული: "",
    ისტორია: "",
    რუსული: "",
    ფრანგული: "",
    გერმანული: "",
  });
  const [loading, setLoading] = useState(false);

  let currPage = 0; // used in requesting essay data

  const changeFilters = (newFilters) => {
    if (newFilters != filters) {
      setFilters(newFilters);
    }
  };

  const pageSetFunction = (page) => {
    if (page !== currPage) {
      currPage = page;
      setLoading(true);
    }
  };
  // const [activePage, setActivePage] = useState(1);
  //   const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    setLoading(true);
    //write logic of fetching essays based on filters and current page

    const params = {
      page: currPage,
      limit: 10,
      //subject
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
          throw new Error(
            "Failed to fetch articles populars",
            response,
            response.status
          );
        }
        return response.json();
      })
      .then((data) => {
        console.log("CHAOS", data);
        if (data.length == 0 || data.Books.length == 0) {
          setEssays([
            {
              _id: 1,
              cover_image_url:
                "https://ecdn.teacherspayteachers.com/thumbitem/Design-your-own-Book-Cover-Printable-Blank-Book-10355131-1698669978/original-10355131-1.jpg",
              title: "არტიკლები ვერ მოიძებნა",
            },
          ]);
        } else {
          setEssays(data.Books);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error(" Error fetching books:", error);
      });
  }, [currPage, filters]);

  return (
    <DefaultLayout>
      <div className="essay-page">
        <EssayFilters changeFilters={changeFilters} />
        <PopularEssays />

        <div className={style.flexDiv}>
          <h3>ესეები</h3>
          <div className={style.addEssayContainer}>
            <h4>დაამატე ესე</h4>
            <EssaysSvgs name="plusSVG" />
          </div>
        </div>

        <div className={style.essaysContainer}>
          {essays.map((essay) => (
            <EssayItem
              key={essay.id}
              title={essay.title}
              linkUrl={essay.linkUrl}
              imgUrl={essay.imgUrl}
            />
          ))}
        </div>
        <Pages pageSetFunction={pageSetFunction} />
      </div>
    </DefaultLayout>
  );
};
export default EssayPage;
