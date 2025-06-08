import React, { useState, useEffect, useRef } from "react";
import EssayItem from "../Essays/EssayItem";
import style from "./FavEssays.module.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";

const FavEssays = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.email == "") {
      navigate("/");
      return;
    }
  }, []);

  const [essays, setEssays] = useState([]);
  //   const [page, setPage] = useState(1);
  //   const [hasMore, setHasMore] = useState(true); // If there's more data to load
  //   const loader = useRef(null);

  useEffect(() => {
    const fetchEssays = async () => {
      fetch(
        `https://gragnily.onrender.com/api/likes/get?type=${encodeURIComponent(
          "essay"
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setEssays(data.essays);
        })
        .catch((error) => {
          console.error("Error fetching likes:", error);
        });
    };
    fetchEssays();
    // if (hasMore) {
    //   fetchEssays();
    // }
  }, []);

  //   useEffect(() => {
  //     const observer = new IntersectionObserver(
  //       (entries) => {
  //         if (entries[0].isIntersecting && hasMore) {
  //           setPage((prev) => prev + 1);
  //         }
  //       },
  //       { threshold: 1 }
  //     );

  //     if (loader.current) {
  //       observer.observe(loader.current);
  //     }

  //     return () => {
  //       if (loader.current) observer.unobserve(loader.current);
  //     };
  //   }, [hasMore]);
  const handleItemDelete = (essayID) => {
    fetch("https://gragnily.onrender.com/api/likes/like", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        type: "essay",
        objectId: essayID,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then((data) => {
        console.log("Like successful:", data);
        setEssays((prevEssays) =>
          prevEssays.filter((essay) => essay._id !== essayID)
        );
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };
  return (
    <div className={style.essaysContainer}>
      <h1 className={style.essaysTitle}>მოწონებული ესეები</h1>
      <div className={style.essaysGrid}>
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
                <button
                  onClick={() => {
                    handleItemDelete(essay._id);
                  }}
                  className={style.deleteMeButton}
                >
                  ამოშლა
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* {hasMore && <div ref={loader} className={style.loadingSentinel} />} use this if we get to the point where infinite scrolling is nessesary */}
    </div>
  );
};

export default FavEssays;
