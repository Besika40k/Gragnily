import { useEffect, useRef, useState } from "react";
import style from "./DefaultLayout.module.css";
import SearchBar from "../modules/SearchBar/SearchBar.jsx";

import AiSection from "../modules/AiSection/AiSection.jsx";

const DefaultLayout = ({ children, topSection = true }) => {
  const allContainerRef = useRef(null);
  const contentRef = useRef(null);
  const [resizeState, setResizeState] = useState(false);
  const resizeContainers = (full) => {
    console.log("resizeContainers called");
    if (allContainerRef.current && contentRef.current) {
      if (full) {
        allContainerRef.current.style.paddingRight = "20px";
        contentRef.current.style.width = "100%";
        setResizeState((current) => !current);
      } else {
        allContainerRef.current.style.paddingRight = "100px";
        contentRef.current.style.width = "85%";
        setResizeState((current) => !current);
      }
    }
  };
  useEffect(() => {
    console.log("aaaaaaaaaaa", allContainerRef.current.style.width);
  }, []);
  return (
    <div ref={allContainerRef} className={style.allContainer}>
      <div ref={contentRef} className={style.content}>
        {topSection && (
          <div className={style.topSection}>
            <h2>Gragnily</h2>
            <SearchBar />
          </div>
        )}
        {children}
      </div>
      <AiSection resizeFunction={resizeContainers} />
    </div>
  );
};
//
export default DefaultLayout;
