import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import style from "./AiSection.module.css";
import ChatBubble from "./ChatBubble.jsx";

const AiSection = () => {
  const MIN_WIDTH = 300;
  const MAX_WIDTH = 800;
  const AUTO_HIDE_WIDTH = 1450;

  const [showHistory, setShowHistory] = useState([]);
  const [hideAISection, setHideAISection] = useState(false);
  const [showAi, setShowAi] = useState(true);
  const [width, setWidth] = useState(400);
  const bottomRef = useRef(null);
  const userInput = useRef();
  const isDragging = useRef(false);
  const containerRef = useRef(null);
  const dissapearDiv = useRef(null);
  //resize logic
  const handleMouseDown = () => {
    isDragging.current = true;
    console.log("1111");
    document.body.style.userSelect = "none";
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const newWidth = window.innerWidth - e.clientX;
    if (newWidth > MIN_WIDTH && newWidth < MAX_WIDTH) {
      setWidth(newWidth);
      setShowAi(true);
    } else if (newWidth < 100) {
      setWidth(10);
      setShowAi(false);
    }
  };

  // alternative to media query
  useLayoutEffect(() => {
    const checkScreenSize = () => {
      const shouldHide = window.innerWidth <= AUTO_HIDE_WIDTH;
      setHideAISection(shouldHide);
      setWidth(!shouldHide ? MIN_WIDTH : 10);
      setShowAi(!shouldHide);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleMouseUp = () => {
    isDragging.current = false;
    console.log("2222");
    document.body.style.userSelect = "";
  };

  const handleUserQuestion = async () => {
    const dataToSend = { content: userInput.current.value };
    setShowHistory(
      showHistory.concat([
        <ChatBubble text={`${userInput.current.value}`} ai={false} />,
        <ChatBubble text={``} ai={true} loader={true} />,
      ])
    );
    userInput.current.value = "";
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

        setShowHistory((prev) => {
          const newHistory = [...prev]; // copy the old array
          newHistory.pop(); // remove last item
          newHistory.push(<ChatBubble text={`${data.data}`} ai={true} />);
          return newHistory;
        });
      } else {
        setShowHistory((prev) => {
          const newHistory = [...prev]; // copy the old array
          newHistory.pop(); // remove last item
          newHistory.push(
            <ChatBubble
              text={`სალამი, ჯერ უნდა შეხვიდე ვებსაიტზე რომ AI გამოიყენო!`}
              ai={true}
            />
          );
          return newHistory;
        });
      }
    });
  };
  //scroll when showHistory changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [showHistory]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);
  useEffect(() => {
    fetch("https://gragnily.onrender.com/api/gemini/getHistory", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then(async (response) => {
      const data = await response.json();
      console.log(response, data);
      if (response.ok) {
        console.log("kys", data.data);
        setShowHistory(
          data.data.map((obj, index) => (
            <ChatBubble
              key={index}
              text={`${obj.parts[0].text}`}
              ai={obj.role != "user"}
            />
          ))
        );
        // setShowHistory((prev) => {
        //   const newHistory = [...prev]; // copy the old array
        //   newHistory.pop(); // remove last item
        //   newHistory.push(<ChatBubble text={`${data.data}`} ai={true} />);
        //   return newHistory;
        // });
      }
    });
  }, []);
  return (
    <div
      className={style.aiSection}
      ref={containerRef}
      style={{ width: hideAISection ? "0px" : width }}
    >
      {/* Resizer handle */}
      {showAi ? (
        <>
          <div className={style.containerDiv} ref={dissapearDiv}>
            <h1>AI Section</h1>

            <div className={style.testdiv}>
              <div className={style.chatHistory}>
                {showHistory.map((item) => item)}
                <div ref={bottomRef} />
              </div>

              <div className={style.userInputDiv}>
                <textarea
                  ref={userInput}
                  className={style.textarea}
                  placeholder="Type your message..."
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      console.log("kys");
                      e.preventDefault();
                      handleUserQuestion();
                    }
                  }}
                  onInput={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height = `${Math.min(
                      e.target.scrollHeight,
                      150
                    )}px`;
                  }}
                />
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
        </>
      ) : (
        <button
          onClick={() => {
            setWidth(300);
            setShowAi(true);
            setHideAISection(false);
          }}
          className={style.expandBtn}
        >
          {"<"}
        </button>
      )}
      {showAi ? (
        <div
          className={style.resizer}
          onMouseDown={handleMouseDown}
          title="Drag to resize"
        />
      ) : undefined}
    </div>
  );
};
export default AiSection;
