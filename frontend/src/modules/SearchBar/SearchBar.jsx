import React, { useEffect, useRef } from "react";
import style from "./SearchBar.module.css";
import SearchIcon from "./SearchIcon";
import { Link } from "react-router-dom";

const SearchBar = () => {
  const [search, setSearch] = React.useState("");
  const [books, setBooks] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  const searchBarRef = useRef(null);

  const handleSearch = () => {
    if (!search.trim()) return;
    console.log("searching for", search);

    setLoading(true);

    fetch(
      `https://gragnily.onrender.com/api/books/search?searchInput=${encodeURIComponent(
        search
      )}`,
      {
        method: "GET",
        credentials: "include",
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }
        return response.json();
      })
      .then((data) => {
        console.log("CHAOS", data);
        if (data.length == 0) {
          setBooks([
            {
              _id: 1,
              cover_image_url:
                "https://ecdn.teacherspayteachers.com/thumbitem/Design-your-own-Book-Cover-Printable-Blank-Book-10355131-1698669978/original-10355131-1.jpg",
              title: "No such book found",
              title_ge: "ასეთი წიგნი ვერ მოიძებნა",
            },
          ]);
        } else {
          setBooks(data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("yle Error fetching books:", error);
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
          placeholder="Search here"
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
        {books.map((book, index) => (
          <Link
            key={index}
            className={style.bookLinkStyling}
            to={`/books/:${book._id}`}
          >
            <li style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <img
                src={`${book.cover_image_url}`}
                alt="bookimg"
                style={{ borderRadius: "5px", width: "30px" }}
              />
              <p>
                {book.title} | {book.title_ge}
              </p>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;
