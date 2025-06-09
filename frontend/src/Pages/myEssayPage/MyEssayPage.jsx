import React, { useEffect, useState } from "react";

import style from "./MyEssayPage.module.css";
import { Link } from "react-router-dom";
import DefaultLayout from "../DefaultLayout";
import EssayItem from "../../modules/Essays/EssayItem";
import Pages from "../../modules/Essays/Pages";
import Loading from "../../modules/Loading";
const MyEssayPage = () => {
  const [essays, setEssays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [maxPage, setMaxPage] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const [currentlyDelete, setCurrentlyDelete] = useState(false);
  const handleItemDelete = (id) => {
    fetch(`https://gragnily.onrender.com/api/essays/deleteEssay/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete essay", response, response.status);
        }
        return response.json();
      })
      .then((data) => {
        console.log("🗑️ Essay deleted:", data);

        // Optional: update local state
        setEssays((prevEssays) =>
          prevEssays.filter((essay) => essay._id !== id)
        );
      })
      .catch((error) => {
        console.error("❌ Error deleting essay:", error);
      });
  };

  useEffect(() => {
    fetch("https://gragnily.onrender.com/api/essays/getUserEssays", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Failed to fetch user essays",
            response,
            response.status
          );
        }
        return response.json();
      })
      .then((data) => {
        console.log("USER ESSAYS:", data);

        if (!data || data.length === 0) {
          setEssays([
            {
              _id: 1,
              cover_image_url:
                "https://ecdn.teacherspayteachers.com/thumbitem/Design-your-own-Book-Cover-Printable-Blank-Book-10355131-1698669978/original-10355131-1.jpg",
              title: "თქვენ ჯერ არ გავქთ დაწერილი ესეები",
            },
          ]);
        } else {
          setEssays(data);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ Error fetching user essays:", error);
        setLoading(false);
      });
  }, []);

  return (
    <DefaultLayout>
      {loading ? (
        <Loading></Loading>
      ) : (
        <>
          <div className={style.flexDiv}>
            <h3 style={{ fontSize: "1.5em" }}>ჩემი ესეები</h3>
          </div>

          <div className={style.essaysContainer}>
            {essays.length == 0 ? (
              <h2 style={{ color: "var(--text-main-l)" }}>
                თქვენ არ გაქვთ ესეები
              </h2>
            ) : undefined}
            {essays?.map((essay) => (
              <div key={essay._id} className={style.essayDiv}>
                <div className={style.hoverDiv}>
                  <div className={style.essayItemDiv}>
                    <EssayItem
                      key={essay._id}
                      title={essay.title}
                      _id={essay._id}
                      cover_image_url={essay.cover_image_url}
                    />
                  </div>
                  <div className={style.buttonDiv}>
                    {!currentlyDelete ? (
                      <>
                        <Link
                          style={{ textDecoration: "none" }}
                          to={`/essays/${essay._id}`}
                        >
                          <button className={style.deleteMeButton}>
                            ნახვა
                          </button>
                        </Link>
                        <Link
                          style={{ textDecoration: "none" }}
                          to={`/essays/edit/${essay._id}`}
                        >
                          <button className={style.deleteMeButton}>
                            შეცვლა
                          </button>
                        </Link>
                        <button
                          onClick={() => {
                            setCurrentlyDelete(true);
                          }}
                          className={style.deleteMeButton}
                        >
                          წაშლა
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            handleItemDelete(essay._id);
                          }}
                          className={`${style.deleteMeButton} ${style.redBtn}`}
                        >
                          წაშლა
                        </button>
                        <button
                          onClick={() => {
                            setCurrentlyDelete(false);
                          }}
                          className={style.deleteMeButton}
                        >
                          გაუქმება
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Pages
            maxPage={maxPage}
            activePage={activePage}
            setActivePage={setActivePage}
          />
        </>
      )}
    </DefaultLayout>
  );
};

export default MyEssayPage;
