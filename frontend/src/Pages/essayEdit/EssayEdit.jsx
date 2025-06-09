import React, { useRef, useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import MarkdownEditor from "@uiw/react-markdown-editor";
import "./EssayEdit.css";
import Loading from "../../modules/Loading";
const EssayEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sucessSubmit, setSuccessSubmit] = useState(false);

  const [currEssay, setCurrEssay] = useState(undefined);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`https://gragnily.onrender.com/api/essays/getEssay/${id}`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch essay by ID");
        }
        return response.json();
      })
      .then((data) => {
        console.log("📄 Essay data:", data);
        setCurrEssay(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ Error fetching essay:", error);
        setLoading(false);
      });
  }, [id]);

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
  const [previewUrl, setPreviewUrl] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleEssayEdit = async () => {
    let title = formTitle.current.value.trim();
    let subject = formSubject.current.value;
    let content = mdEditorRef.current?.trim();
    let tags = formTags.current.value.trim();
    let allowAI = formAllowAi.current.checked;
    let coverImageFile = formCoverImage.current.files[0];
    let valid = true;

    if (!title) {
      title = currEssay.Essay.title;
    } else {
      invalidTitle.current.style.display = "none";
      formTitle.current.style.outline = "";
      formTitle.current.style.boxShadow = "";
    }

    if (!subject || subject === "Select subject") {
      subject = currEssay.Essay.subject;
    } else {
      invalidSubject.current.style.display = "none";
      formSubject.current.style.outline = "";
      formSubject.current.style.boxShadow = "";
    }

    if (tags && !/^#\w+( +#\w+)*$/.test(tags)) {
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
      content = currEssay.Essay.content;
    } else {
      invalidEssay.current.style.display = "none";
    }
    let noimg = false;
    if (!coverImageFile) {
      noimg = true;
    }

    if (!valid) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const formData = new FormData();
    noimg ? formData.append("cover_image", coverImageFile) : undefined;
    formData.append("title", title);
    formData.append("content", content);
    formData.append("tags", tags);
    formData.append("subject", subject);
    formData.append("allowAI", allowAI);

    fetch(`https://gragnily.onrender.com/api/essays/editEssay/${id}`, {
      method: "PUT",
      credentials: "include",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update essay");
        return res.json();
      })
      .then((data) => {
        console.log("✅ Essay updated successfully:", data);
        navigate("/essay");
      })
      .catch((err) => {
        console.error("❌ Update error:", err.message);
      });
  };
  if (loading) return <Loading />;
  return (
    <section className="outer-container">
      <div className="form-container">
        <Link
          style={{ textDecoration: "none", color: "var(--text-l)" }}
          to="/essay"
        >
          <h4>{"← უკან დაბრუნება"}</h4>
        </Link>
        <h2>შეცვალე შენი ესე</h2>

        <label>ესეს სათაური</label>
        <input
          type="text"
          placeholder={currEssay.Essay.title}
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
        <input type="text" placeholder={currEssay.Essay.tags} ref={formTags} />
        <p className="invalid" ref={invalidTag}>
          ტეგები უნდა იყოს ფორმატში: #ტეგი
        </p>

        <div className="toggle-container">
          <label>დასაშვებია თუ არა AI-სთვის სწავლაში გამოყენება</label>
          <label className="switch">
            <input
              defaultChecked={currEssay.Essay.allowAi}
              type="checkbox"
              ref={formAllowAi}
            />
            <span className="slider round"></span>
          </label>
        </div>

        <div className="file-upload-div">
          <label className="upload-label">ატვირთე ყდის სურათი</label>

          <div className="input-preview-wrapper">
            <label htmlFor="coverImage" className="browse-button">
              აირჩიე
            </label>

            <img
              src={
                previewUrl == "" ? currEssay.Essay.cover_image_url : previewUrl
              }
              alt="წინასწარი ნახვა"
              className="preview-image"
            />
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
            <h3>შეცვალე შენი ესეს ტექსტი!</h3>
            <button>როგორ გამოიყენო markdown?</button>
          </div>
          <MarkdownEditor
            value={currEssay.Essay.content}
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
          <button onClick={handleEssayEdit} className="submit-button">
            გაგზავნა
          </button>
        </div>
      </div>
    </section>
  );
};

export default EssayEdit;
