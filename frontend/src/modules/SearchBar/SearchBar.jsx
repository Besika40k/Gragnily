import React, { useState, useEffect, useRef } from "react";
import style from "./SearchBar.module.css";
import SearchIcon from "./SearchIcon";
import { Link, useLocation } from "react-router-dom";

const SearchBar = ({}) => {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]);
  const [essays, setEssays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const location = useLocation();
  const isEssays = location.pathname === "/essay";
  const isBooks = location.pathname === "/books";
  let both = false;
  if (!(isEssays || isBooks)) {
    both = true;
  }
  console.log(isEssays, isBooks, "LOCATION TESTING");
  const searchBarRef = useRef(null);

  const handleSearch = () => {
    if (!search.trim()) {
      setBooks([]);
      setArticles([]);
      setIsSearchOpen(false);
      return;
    }
    console.log("searching for", search);

    setLoading(true);

    const params = {
      query: search.trim(),
    };
    const queryString = new URLSearchParams(params).toString();
    console.log("searching for", queryString);
    fetch(`https://gragnily.onrender.com/api/search/?${queryString}`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch search", response.status);
        }
        return response.json();
      })
      .then((data) => {
        console.log("CHAOS", data);
        if (data.books.length == 0 || data.essays.length == 0) {
          if (data.books.length == 0) {
            setBooks([
              {
                _id: 1,
                cover_image_url:
                  "https://ecdn.teacherspayteachers.com/thumbitem/Design-your-own-Book-Cover-Printable-Blank-Book-10355131-1698669978/original-10355131-1.jpg",
                title: "ასეთი წიგნი ვერ მოიძებნა",
              },
            ]);
          } else {
            if (isBooks) {
              setBooks(data.books);
            }
          }
          if (data.essays.length == 0) {
            setEssays([
              {
                _id: 1,
                cover_image_url:
                  "https://ecdn.teacherspayteachers.com/thumbitem/Design-your-own-Book-Cover-Printable-Blank-Book-10355131-1698669978/original-10355131-1.jpg",
                title: "ასეთი ესე ვერ მოიძებნა",
              },
            ]);
          } else {
            if (isEssays) {
              setEssays(data.essays);
            }
          }
        } else {
          if (isBooks) {
            setBooks(data.books);
          }
          if (isEssays) {
            setEssays(data.essays);
          }
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error(" Error fetching books:", error);
        setLoading(false);
      });
  };

  // Close search bar if clicked outside
  useEffect(() => {
    let timeoutId;

    const handleClickOutside = (event) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target)
      ) {
        setBooks([]);
        timeoutId = setTimeout(() => {
          setIsSearchOpen(false);
        }, 500);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      clearTimeout(timeoutId); // Clean up timeout
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const searchContainerClass = `${style.searchInnerContainer} ${
    isSearchOpen ? style.active : ""
  }`;

  const foundItemsClass = `${style.foundItems} ${
    books.length > 0 ? style.visible : ""
  }`;

  return (
    <div className={style.searchOuterContainer} ref={searchBarRef}>
      <div className={searchContainerClass}>
        <input
          placeholder="მოძებნე აქ"
          className={style.searchBar}
          type="text"
          name="searchBar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              console.log("Enter pressed");
              setIsSearchOpen(true);
              handleSearch();
            }
          }}
        />

        <label
          onClick={() => {
            setIsSearchOpen(true);
            handleSearch();
          }} // Open search bar when the icon is clicked
          className={style.searchIcon}
          htmlFor="searchBar"
        >
          <SearchIcon width={40} height={40} fill="#333" />
        </label>
      </div>

      <ul className={foundItemsClass}>
        {loading && <p>Loading...</p>}
        {books
          ?.slice(0, isBooks && !isEssays ? 4 : isBooks && isEssays ? 2 : 0)
          .map((book, index) => (
            <Link
              key={index}
              className={style.bookLinkStyling}
              to={`/books/:${book._id}`}
            >
              <li
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <img
                  src={`${book.cover_image_url}`}
                  alt="bookimg"
                  style={{ borderRadius: "5px", width: "30px" }}
                />
                <p>{book.title}</p>
              </li>
            </Link>
          ))}
        {essays
          ?.slice(0, isEssays && !isBooks ? 4 : isEssays && isBooks ? 2 : 0)
          .map((essay, index) => (
            <Link
              key={index}
              className={style.bookLinkStyling}
              to={`/books/:${essay._id}`}
            >
              <li
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <img
                  src={`${essay.cover_image_url}`}
                  alt="bookimg"
                  style={{ borderRadius: "5px", width: "30px" }}
                />
                <p>{essay.title}</p>
              </li>
            </Link>
          ))}
      </ul>
    </div>
  );
};

export default SearchBar;
