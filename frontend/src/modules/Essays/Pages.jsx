import React, { useState } from "react";
import style from "./Pages.module.css";
const Pages = ({ maxPage, activePage, setActivePage }) => {
  const [totalPages, setTotalPages] = useState(maxPage);
  console.log(maxPage, "vbbbbbbbb");
  return (
    <footer>
      {(() => {
        const pages = [];

        // Show previous page if valid
        if (activePage > 1) {
          pages.push(activePage - 1);
        }

        // Always show active page
        pages.push(activePage);

        // Show next page if valid and not same as totalPages
        if (activePage + 1 < totalPages) {
          pages.push(activePage + 1);
        }

        // Show ellipsis if there's a gap before the last page
        if (activePage + 2 < totalPages) {
          pages.push("...");
        }

        // Always show last page if it's not already shown
        if (activePage !== totalPages) {
          pages.push(totalPages);
        }

        return pages.map((page, index) => {
          console.log(page, "aaaaaaaaaaaaaaaaaaaaaaaaaaa");
          if (page === "...") {
            return (
              <span key={index} className={style.ellipsis}>
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => setActivePage(page)}
              className={page === activePage ? style.activePage : style.page}
            >
              {page}
            </button>
          );
        });
      })()}
    </footer>
  );
};
export default Pages;
