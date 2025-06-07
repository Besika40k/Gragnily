import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import MarkdownEditor from "@uiw/react-markdown-editor";
import "./EssayUpload.css";

const EssayUpload = () => {
  const [sucessSubmit, setSuccessSubmit] = useState(false);

  const mdEditorRef = useRef("");
  const formTitle = useRef();
  const formSubject = useRef();
  const formTags = useRef();
  const formAllowAi = useRef();

  const invalidTitle = useRef();
  const invalidEssay = useRef();
  const invalidSubject = useRef();
  const invalidTag = useRef();
  const formCoverImage = useRef();

  const handleEssayUpload = async () => {
    const title = formTitle.current.value.trim();
    const subject = formSubject.current.value;
    const content = mdEditorRef.current?.trim();
    const tags = formTags.current.value.trim();
    const allowAI = formAllowAi.current.checked;
    let coverImageFile = formCoverImage.current.files[0];
    let valid = true;

    // Validate Title
    if (!title) {
      invalidTitle.current.innerText = "Your essay title must not be empty";
      invalidTitle.current.style.display = "block";
      formTitle.current.style.outline = "1px solid red";
      formTitle.current.style.boxShadow = "0 0 5px rgba(255, 0, 0, 0.4)";
      valid = false;
    } else {
      invalidTitle.current.style.display = "none";
      formTitle.current.style.outline = "";
      formTitle.current.style.boxShadow = "";
    }

    // Validate Subject
    if (!subject || subject === "Select subject") {
      invalidSubject.current.innerText = "You must select a subject";
      invalidSubject.current.style.display = "block";
      formSubject.current.style.outline = "1px solid red";
      formSubject.current.style.boxShadow = "0 0 5px rgba(255, 0, 0, 0.4)";
      valid = false;
    } else {
      invalidSubject.current.style.display = "none";
      formSubject.current.style.outline = "";
      formSubject.current.style.boxShadow = "";
    }
    //// Validate Tags Format
    if (tags && !/^#\w+( +#\w+)*$/.test(tags)) {
      invalidTag.current.innerText =
        "Tags must start with # and be separated by a single space (e.g., #math #history)";
      invalidTag.current.style.display = "block";
      formTags.current.style.outline = "1px solid red";
      formTags.current.style.boxShadow = "0 0 5px rgba(255, 0, 0, 0.4)";
      valid = false;
    } else {
      invalidTag.current.style.display = "none";
      formTags.current.style.outline = "";
      formTags.current.style.boxShadow = "";
    }

    // Validate Essay Content
    if (!content) {
      invalidEssay.current.innerText = "Essay content must not be empty";
      invalidEssay.current.style.display = "block";
      // You can style the markdown container div
      valid = false;
    } else {
      invalidEssay.current.style.display = "none";
    }

    if (!coverImageFile) {
      // fetch default image from public assets folder
      const response = await fetch("../../assets/defaultEssayimg.webp"); // adjust path as needed
      const blob = await response.blob();

      coverImageFile = new File([blob], "default.jpg", { type: blob.type });
    }

    if (!valid) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // getting data ready and sending a request

    const formData = new FormData();
    formData.append("cover_image", coverImageFile); // must match: "cover_image"
    formData.append("title", title);
    formData.append("content", content);
    formData.append("tags", tags);
    formData.append("subject", subject);
    formData.append("allowAI", allowAI);
    console.log(typeof allowAI);
    console.log(formData, "aaaaaaaaaaaaaa");
    try {
      const response = await fetch(
        "https://gragnily.onrender.com/api/essays/postEssay",
        {
          method: "POST",
          credentials: "include", // allows cookies/session headers
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to upload essay: ${errorText}`);
      }

      const result = await response.json();
      console.log("✅ Essay uploaded successfully:", result);

      // Optional: redirect, clear form, or show success
    } catch (error) {
      console.error("❌ Upload error:", error.message);
      // Optional: display error to user
    }
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
        <input type="text" placeholder="Enter essay title" ref={formTitle} />
        <p className="invalid" ref={invalidTitle}>
          your title is invalid, it must contain alphabet letters and numbers,
          must start with a letter
        </p>
        <label>Exam Subject</label>
        <select ref={formSubject}>
          <option value="">Select subject</option>
          <option value="English">English</option>
          <option value="Science">Science</option>
          <option value="Math">Math</option>
          <option value="Other">Other</option>
        </select>
        <p className="invalid" ref={invalidSubject}>
          you must select one of the options
        </p>
        <label>Optional Metadata Tags</label>
        <input
          type="text"
          placeholder="Add tags (e.g., history, research)"
          ref={formTags}
        />
        <p className="invalid" ref={invalidTag}>
          tags must be of the format #tagname
        </p>
        <div className="toggle-container">
          <label>Allow essay to be used for AI learning</label>
          <label className="switch">
            <input type="checkbox" ref={formAllowAi} />
            <span className="slider round"></span>
          </label>
        </div>
        <label>Upload Cover Image</label>
        <input type="file" accept="image/*" ref={formCoverImage} />
        <div className="markdown-div">
          <div className="flex-div">
            <h3>You can write your essay here!</h3>
            <button>how to use markdown?</button>
          </div>
          <MarkdownEditor
            value={mdEditorRef.current}
            height="500px"
            maxHeight="500px"
            theme={"dark"}
            onChange={(value) => {
              mdEditorRef.current = value;
            }}
          />
        </div>
        <p className="invalid" ref={invalidEssay}>
          essay content must not be empty
        </p>
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
