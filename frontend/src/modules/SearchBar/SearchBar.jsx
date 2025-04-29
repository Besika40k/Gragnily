import React from "react";
import style from "./SearchBar.module.css";
import SearchIcon from "./SearchIcon";

const SearchBar = () => {
  const [search, setSearch] = React.useState("");
  const [books, setBooks] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const handleSearch = () => {
    if (!search.trim()) return;
    console.log("searching for", search);
    // c

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
        setBooks(data);
        if (data.length === 0) {
          setLoading(true);
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("yle Error fetching books:", error);
        setLoading(false);
      });
  };

  // change classes on search

  const searchContainerClass = `${style.searchInnerContainer} ${
    books.length > 0 ? style.active : ""
  }`;

  const foundItemsClass = `${style.foundItems} ${
    books.length > 0 ? style.visible : ""
  }`;

  return (
    <div className={style.searchOuterContainer}>
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
              handleSearch();
            }
          }}
        />
        <label
          onClick={handleSearch}
          className={style.searchIcon}
          htmlFor="searchBar"
        >
          <SearchIcon width={40} height={40} fill="#333" />
        </label>
      </div>

      <ul className={foundItemsClass}>
        {loading && <p>Loading...</p>}
        {books.map((book, index) => (
          <li
            key={index}
            style={{ display: "flex", gap: "10px", alignItems: "center" }}
          >
            {/* <div
              style={{
                backgroundImage: `url("${book.cover_image_url}")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "5px",
                width: "50px",
                height: "50px",
              }}
              key={index + 5}
            /> */}
            <img
              src={`${book.cover_image_url}`}
              alt="bookimg"
              style={{ borderRadius: "5px", width: "30px" }}
            />
            <p>
              {book.title} | {book.title_ge}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;
