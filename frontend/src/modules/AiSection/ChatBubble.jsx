import React, { useRef, useState, useEffect } from "react";
import style from "./ChatBubble.module.css";
import ReactMarkdown from "react-markdown";

const ChatBubble = ({ text = "", ai = false, loader = false }) => {
  return (
    <div
      className={ai ? style.containerBubbleLeft : style.containerBubbleRight}
    >
      {ai && <div className={style.imgDiv} />}
      <div className={ai ? style.messageLeftDiv : style.messageRightDiv}>
        {loader ? (
          <div className={style.loader}></div>
        ) : (
          <p className={ai ? style.messageLeftP : style.messageRightP}>
            <ReactMarkdown
              components={{
                p: ({ node, ...props }) => (
                  <p className={style.paragraph} {...props} />
                ),
                h1: ({ node, ...props }) => (
                  <h1 className={style.heading} {...props} />
                ),
              }}
            >
              {text}
            </ReactMarkdown>
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
