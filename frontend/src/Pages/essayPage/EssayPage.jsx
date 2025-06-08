import React, { useEffect, useState } from "react";
import DefaultLayout from ".././DefaultLayout.jsx";
import EssayFilters from "../../modules/Essays/EssayFilters.jsx";
import PopularEssays from "../../modules/Essays/PopularEssays.jsx";
import EssaysSvgs from "../../modules/Essays/EssaysSvgs.jsx";
import Pages from "../../modules/Essays/Pages.jsx";
import EssayItem from "../../modules/Essays/EssayItem.jsx";
import Loading from "../../modules/Loading.jsx";
import style from "./EssayPage.module.css";
import { Link } from "react-router-dom";

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
  const [loading, setLoading] = useState(true);
  const [maxPage, setMaxPage] = useState(1);
  const [activePage, setActivePage] = useState(1);

  const changeFilters = (newFilters) => {
    if (newFilters != filters) {
      setFilters(newFilters);
    }
  };

  // const [activePage, setActivePage] = useState(1);
  //   const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    setLoading(true);
    //write logic of fetching essays based on filters and current page

    const params = {
      page: activePage,
      limit: 21,
      ...filters,
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
          setMaxPage(data.pages);
          setEssays(data.Books);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error(" Error fetching books:", error);
      });
  }, [activePage, filters]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <DefaultLayout>
          <div className="essay-page">
            <EssayFilters setFilters={setFilters} filters={filters} />
            <PopularEssays />

            <div className={style.flexDiv}>
              <h3 style={{ fontSize: "1.5em" }}>უახლესი</h3>
              <Link
                style={{ textDecoration: "none", color: "var(--text-l)" }}
                to="/essay/upload"
              >
                <div className={style.addEssayContainer}>
                  <h4>დაამატე ესე</h4>
                  <EssaysSvgs name="plusSVG" />
                </div>
              </Link>
            </div>

            <div className={style.essaysContainer}>
              {essays.map((essay) => (
                <EssayItem
                  key={essay._id}
                  title={essay.title}
                  _id={essay._id}
                  cover_image_url={essay.cover_image_url}
                />
              ))}
            </div>
            <Pages
              maxPage={maxPage}
              activePage={activePage}
              setActivePage={setActivePage}
            />
          </div>
        </DefaultLayout>
      )}
    </>
  );
};
export default EssayPage;
