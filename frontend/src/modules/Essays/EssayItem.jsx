import React from "react";
import style from "./EssayItem.module.css";
import { Link } from "react-router-dom";

const EssayItem = ({
  _id = "kys",
  cover_image_url = "",
  title = "არტიკლები ვერ მოიძებნა",
}) => {
  const patternId = `imagePattern-${_id}`;
  return (
    <Link to={`/essays/${_id}`}>
      <div key={_id} className={style.item}>
        <svg
          width="110"
          height="160"
          viewBox="0 0 41 53"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            filter: "drop-shadow(2px 2px 6px rgba(0, 0, 0, 0.5))",
          }}
        >
          <defs>
            <pattern
              id={patternId}
              patternUnits="userSpaceOnUse"
              width="41"
              height="53"
            >
              <image
                href={cover_image_url}
                x="0"
                y="0"
                width="41"
                height="53"
                preserveAspectRatio="xMidYMid slice"
              />
            </pattern>
          </defs>
          <path
            d="M40.7871 49.2786C40.7871 50.9326 39.4411 52.2786 37.7871 52.2786H14.0331H3.78711C2.13311 52.2786 0.787109 50.9326 0.787109 49.2786V3.27856C0.787109 1.62456 2.13311 0.278564 3.78711 0.278564H28.7871V11.2786C28.7871 11.8306 29.2351 12.2786 29.7871 12.2786H40.7871V49.2786ZM30.7871 10.2786V1.69256L39.3731 10.2786H30.7871Z"
            fill={`url(#${patternId})`}
          />
        </svg>
        <h3>{title.length > 40 ? title.slice(0, 40) + "…" : title}</h3>
      </div>
    </Link>
  );
};

export default EssayItem;
