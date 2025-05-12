import React, { useState, useRef, useEffect, use } from "react";
import style from "./AiSection.module.css";
import ChatBubble from "./ChatBubble.jsx";

const AiSection = () => {
  const [showHistory, setShowHistory] = useState([]);
  let history = [];

  const userInput = useRef();

  const handleUserQuestion = async () => {
    const dataToSend = { content: userInput.current.value };
    fetch("https://gragnily.onrender.com/api/gemini/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
      credentials: "include", // Allow cookies to be sent
    }).then(async (response) => {
      const data = await response.json();
      console.log(response, data);
      if (response.ok) {
        console.log("Login successful!", data.data);

        setShowHistory(
          showHistory.concat([
            <ChatBubble text={`${userInput.current.value}`} ai={false} />,
            <ChatBubble text={`${data.data}`} ai={true} />,
          ])
        );
        // Fetch and update the user data in the context after login
      }
    });
  };

  return (
    <div className={style.aiSection}>
      <h1>AI Section</h1>
      <div className={style.testdiv}>
        <div className={style.chatHistory}>
          {showHistory.map((item) => item)}
        </div>

        <div className={style.userInputDiv}>
          <input ref={userInput} type="text" name="userQuestion" />
          <div onClick={handleUserQuestion} className={style.sendSvgDiv}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22 2L11 13"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M22 2L15 22L11 13L2 9L22 2Z"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AiSection;
