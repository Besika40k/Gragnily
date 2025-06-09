import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MarkdownEditor from "@uiw/react-markdown-editor";
import "./EssayUpload.css";

const EssayUpload = () => {
  const navigate = useNavigate();
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

  const formCoverImage = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleEssayUpload = async () => {
    const title = formTitle.current.value.trim();
    const subject = formSubject.current.value;
    const content = mdEditorRef.current?.trim();
    const tags = formTags.current.value.trim();
    const allowAI = formAllowAi.current.checked;
    let coverImageFile = formCoverImage.current.files[0];
    let valid = true;

    if (!title) {
      invalidTitle.current.innerText = "ესეს სათაური არ უნდა იყოს ცარიელი";
      invalidTitle.current.style.display = "block";
      formTitle.current.style.outline = "1px solid red";
      formTitle.current.style.boxShadow = "0 0 5px rgba(255, 0, 0, 0.4)";
      valid = false;
    } else {
      invalidTitle.current.style.display = "none";
      formTitle.current.style.outline = "";
      formTitle.current.style.boxShadow = "";
    }

    if (!subject || subject === "Select subject") {
      invalidSubject.current.innerText = "გთხოვ აირჩიო საგანი";
      invalidSubject.current.style.display = "block";
      formSubject.current.style.outline = "1px solid red";
      formSubject.current.style.boxShadow = "0 0 5px rgba(255, 0, 0, 0.4)";
      valid = false;
    } else {
      invalidSubject.current.style.display = "none";
      formSubject.current.style.outline = "";
      formSubject.current.style.boxShadow = "";
    }

    if (tags && !/^#([\w\u10A0-\u10FF]+( +#[\w\u10A0-\u10FF]+)*)$/.test(tags)) {
      invalidTag.current.innerText =
        "ტეგები უნდა დაიწყოს სიმბოლოთი # და გამოყოფილი იყოს ერთი სივრცით (მაგ: #ისტორია #მათემატიკა)";
      invalidTag.current.style.display = "block";
      formTags.current.style.outline = "1px solid red";
      formTags.current.style.boxShadow = "0 0 5px rgba(255, 0, 0, 0.4)";
      valid = false;
    } else {
      invalidTag.current.style.display = "none";
      formTags.current.style.outline = "";
      formTags.current.style.boxShadow = "";
    }

    if (!content) {
      invalidEssay.current.innerText = "ესეს შინაარსი არ უნდა იყოს ცარიელი";
      invalidEssay.current.style.display = "block";
      valid = false;
    } else {
      invalidEssay.current.style.display = "none";
    }

    if (!coverImageFile) {
      const response = await fetch("/assets/defaultEssayimg.png");
      const blob = await response.blob();
      console.log(blob.type);
      coverImageFile = new File([blob], "default.png", { type: blob.type });
    }

    if (!valid) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const formData = new FormData();
    formData.append("cover_image", coverImageFile);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("tags", tags);
    formData.append("subject", subject);
    formData.append("allowAI", allowAI);

    try {
      const response = await fetch(
        "https://gragnily.onrender.com/api/essays/postEssay",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`დაფიქსირდა შეცდომა: ${errorText}`);
      }

      const result = await response.json();
      console.log("✅ ესე წარმატებით აიტვირთა:", result);
      navigate("/essay");
    } catch (error) {
      console.error("❌ ატვირთვის შეცდომა:", error.message);
    }
  };

  return (
    <section className="outer-container">
      <div className="form-container">
        <Link
          style={{ textDecoration: "none", color: "var(--text-l)" }}
          to="/essay"
        >
          <h4>{"← უკან დაბრუნება"}</h4>
        </Link>
        <h2>ატვირთე შენი ესე</h2>

        <label>ესეს სათაური</label>
        <input
          type="text"
          placeholder="შეიყვანე ესეს სათაური"
          ref={formTitle}
        />
        <p className="invalid" ref={invalidTitle}>
          სათაური უნდა შეიცავდეს ასოებს ან რიცხვებს და უნდა დაიწყოს ასოთი
        </p>

        <label>საგანი</label>
        <select ref={formSubject}>
          <option value="Select subject">აირჩიე საგანი</option>
          <option value="ინგლისური">ინგლისური</option>
          <option value="ქართული">ქართული</option>
          <option value="ისტორია">ისტორია</option>
          <option value="რუსული">რუსული</option>
          <option value="ფრანგული">ფრანგული</option>
          <option value="გერმანული">გერმანული</option>
          <option value="სხვა">სხვა</option>
        </select>
        <p className="invalid" ref={invalidSubject}>
          აუცილებლად უნდა აირჩიო ერთი საგანი
        </p>

        <label>სურვილისამებრ: ტეგები</label>
        <input
          type="text"
          placeholder="დაამატე ტეგები (მაგ. #ისტორია #კვლევა)"
          ref={formTags}
        />
        <p className="invalid" ref={invalidTag}>
          ტეგები უნდა იყოს ფორმატში: #ტეგი
        </p>

        <div className="toggle-container">
          <label>დასაშვებია თუ არა AI-სთვის სწავლაში გამოყენება</label>
          <label className="switch">
            <input type="checkbox" ref={formAllowAi} />
            <span className="slider round"></span>
          </label>
        </div>

        <div className="file-upload-div">
          <label className="upload-label">ატვირთე ყდის სურათი</label>

          <div className="input-preview-wrapper">
            <label htmlFor="coverImage" className="browse-button">
              აირჩიე
            </label>

            {previewUrl && (
              <img
                src={previewUrl}
                alt="წინასწარი ნახვა"
                className="preview-image"
              />
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            ref={formCoverImage}
            id="coverImage"
            className="upload-input"
            onChange={handleImageChange}
          />
        </div>

        <div className="markdown-div">
          <div className="flex-div">
            <h3>აქ შეგიძლია დაწერო შენი ესე!</h3>
            <Link
              style={{ textDecoration: "none" }}
              to={"/essays/6844ba9d01d27fb5f2ff1ca0"}
            >
              <button>როგორ გამოიყენო markdown?</button>
            </Link>
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
          ესეს შინაარსი არ უნდა იყოს ცარიელი
        </p>

        <div className="button-diva">
          <button onClick={handleEssayUpload} className="submit-button">
            გაგზავნა
          </button>
        </div>
      </div>
    </section>
  );
};

export default EssayUpload;
