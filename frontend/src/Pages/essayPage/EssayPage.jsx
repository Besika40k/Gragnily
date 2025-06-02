import React, { useEffect, useState } from "react";
import DefaultLayout from ".././DefaultLayout.jsx";
import EssayFilters from "../../modules/Essays/EssayFilters.jsx";
import PopularEssays from "../../modules/Essays/PopularEssays.jsx";
import EssaysSvgs from "../../modules/Essays/EssaysSvgs.jsx";
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

  let currPage = 1; // used in requesting essay data

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

    //setLoading(false) after sucessful fetch
    const params = {
      page: currPage,
      limit: 21,
      ...filters,
    };
  }, [currPage, filters]);

  return (
    <DefaultLayout>
      <div className="essay-page">
        <EssayFilters changeFilters={changeFilters} />
        <PopularEssays />
        <div className={style.flexDiv}>
          <h3>უახლესი</h3>
          <div className={style.addEssayContainer}>
            <h4>დაამატე ესე</h4>
            <EssaysSvgs name="plus" />
          </div>
        </div>
        {/*
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
        <Pages pageSetFunction={pageSetFunction} /> */}
      </div>
    </DefaultLayout>
  );
};
export default EssayPage;
