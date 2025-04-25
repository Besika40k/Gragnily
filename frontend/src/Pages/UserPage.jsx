import React from "react";
import style from "./UserPage.module.css";

import { useState, useEffect } from "react";

const UserPage = () => {
  const [user, setUser] = useState("");

  // on load get user data
  useEffect(() => {
    fetch("https://gragnily.onrender.com/api/users/getuser", {
      method: "GET",
      credentials: "include", // this allows cookies to be sent
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Not logged in");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.profile_picture_url);
        setUser(data); // Store user data
      })
      .catch((err) => {
        console.log(
          "User not logged in or error fetching user info:",
          err.message
        );
      });
  }, []);

  // image upload
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = () => {
    if (!image) return;
    const formData = new FormData();
    formData.append("new_profile", image);

    fetch("https://gragnily.onrender.com/api/users/updateuserprofie", {
      method: "POST",
      body: formData,
    })
      .then(async (res) => {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          console.log("Success:", data);
        } else {
          const text = await res.text();
          console.warn("Non-JSON response:", text);
        }
      })
      .catch((err) => console.error("Error:", err));
  };

  return (
    <div className={style.userPage}>
      <div className={style.userInfo}>
        <div
          style={{
            backgroundImage: `url(${user.profile_picture_url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "50%",
            flexShrink: 0,
            width: "100px",
            height: "100px",
            minHeight: "10vh",
          }}
          key={10030}
        ></div>
        <div className={style.textInfo}>
          <h2>Username: {user.username}</h2>
          <h2>Email: {user.email}</h2>
          <h2>Password: *******</h2>
        </div>
      </div>
      <div>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {preview && (
          <img src={preview} alt="Preview" style={{ maxWidth: "200px" }} />
        )}
        <button onClick={handleUpload}>Upload</button>
      </div>
      <form action="sumbit">
        <div className={style.formGroup}>
          <label htmlFor="username">Change Username</label>
          <input type="text" id="username" name="username" />
        </div>
        <div className={style.formGroup}>
          <label htmlFor="email">Change Email</label>
          <input type="email" id="email" name="email" />
        </div>
        <div className={style.formGroup}>
          <label htmlFor="password">Change Password</label>
          <input type="password" id="password" name="password" />
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UserPage;
