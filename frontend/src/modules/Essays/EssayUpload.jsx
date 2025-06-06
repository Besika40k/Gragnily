import React, { useState } from "react";
import MarkdownEditor from "@uiw/react-markdown-editor";
import { Link } from "react-router-dom";
import "./EssayUpload.css"; // Import the CSS file

const EssayUpload = () => {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [tags, setTags] = useState("");
  const [aiConsent, setAiConsent] = useState(false);
  const mdStr = `# write markdown here`;
  let essayText = "";

  const handleEssayUpload = () => {
    return;
  };

  return (
    <section className="outer-container">
      <div className="form-container">
        <Link
          style={{ textDecoration: "none", color: "var(--text-l)" }}
          to="/essay"
        >
          <h4>{"← go back"}</h4>
        </Link>
        <h2>Upload Your Essay</h2>

        <label>Essay Title</label>
        <input
          type="text"
          placeholder="Enter essay title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Exam Subject</label>
        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option value="">Select subject</option>
          <option value="English">English</option>
          <option value="Science">Science</option>
          <option value="Math">Math</option>
          <option value="Other">Other</option>
        </select>

        <label>Optional Metadata Tags</label>
        <input
          type="text"
          placeholder="Add tags (e.g., history, research)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <div className="toggle-container">
          <label>Allow essay to be used for AI learning</label>
          <label className="switch">
            <input
              type="checkbox"
              checked={aiConsent}
              onChange={() => setAiConsent(!aiConsent)}
            />
            <span className="slider round"></span>
          </label>
        </div>
        <div className="markdown-div">
          <div className="flex-div">
            <h3>You can write your essay here!</h3>
            <button>how to use markdown?</button>
          </div>
          <MarkdownEditor
            value={mdStr}
            height="300px"
            maxHeight="300px"
            theme={"dark"}
            onChange={(value, viewUpdate) => {
              essayText = value;
            }}
          />
        </div>
        <div className="button-diva">
          <button onClick={handleEssayUpload} className="submit-button">
            გააგზავნე ესე
          </button>
        </div>
      </div>
    </section>
  );
};

export default EssayUpload;
