const pathStyle = {
  fill: "var(--icon-background)", // Set the fill color
  transition: "fill 0.3s ease-in-out", // Smooth transition
};
const svgStyle = {
  width: "173px",
  height: "55px",
  filter: "drop-shadow(4px 4px 10px rgba(0, 0, 0, 0.2))", // Apply shadow to the SVG
};

// fill="var(--icon-background)"
//         stroke="var(--icon-outline-color)"
const svgIcons = {
  downloadSvg: (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M25.333 48.6669H38.6663C43.3803 48.6669 45.7373 48.6669 47.2018 47.2024C48.6663 45.7381 48.6663 43.3809 48.6663 38.6669V37.0003C48.6663 32.2863 48.6663 29.9293 47.2018 28.4648C45.9212 27.1841 43.958 27.0234 40.333 27.0032M23.6663 27.0032C20.0413 27.0234 18.0781 27.1841 16.7975 28.4647C15.333 29.9293 15.333 32.2863 15.333 37.0003V38.6669C15.333 43.3809 15.333 45.7381 16.7975 47.2024C17.2971 47.7021 17.9007 48.0313 18.6663 48.2483"
        stroke="var(--icon-line)"
        stroke-width="2.5"
        stroke-linecap="round"
      />
      <path
        d="M32 15.3333V36.9999M32 36.9999L27 31.1666M32 36.9999L37 31.1666"
        stroke="var(--icon-line)"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  ),
  bookmarkSvg: (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17 30.4958V38.8181C17 43.9791 17 46.5596 18.2235 47.6871C18.807 48.2249 19.5436 48.5628 20.3282 48.6524C21.9734 48.8408 23.8946 47.1414 27.7369 43.7429C29.4353 42.2408 30.2847 41.4896 31.2672 41.2918C31.751 41.1943 32.249 41.1943 32.7328 41.2918C33.7153 41.4896 34.5647 42.2408 36.263 43.7429C40.1055 47.1414 42.0267 48.8408 43.6718 48.6524C44.4565 48.5628 45.193 48.2249 45.7765 47.6871C47 46.5596 47 43.9791 47 38.8181V30.4958C47 23.3481 47 19.7743 44.8033 17.5538C42.6067 15.3333 39.071 15.3333 32 15.3333C24.9289 15.3333 21.3934 15.3333 19.1967 17.5538C17.8513 18.9137 17.3299 20.7813 17.1279 23.6666"
        stroke="var(--icon-line)"
        stroke-width="2.5"
        stroke-linecap="round"
      />
      <path
        d="M37 22H27"
        stroke="var(--icon-line)"
        stroke-width="2.5"
        stroke-linecap="round"
      />
    </svg>
  ),
};

function BookPageSVGS({ name }) {
  return svgIcons[name] || <p>Icon not found</p>;
}

export default BookPageSVGS;
