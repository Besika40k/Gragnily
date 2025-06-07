import React from "react";
import style from "./UserPage.module.css";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Loading from "../modules/Loading";

import PasswordReset from "../modules/UserVerification/PasswordReset.jsx";

// user dat
import { useUser } from "../contexts/UserContext";

const UserPage = () => {
  const { user, updateUser } = useUser();

  const [loading, setLoading] = useState(false);
  // on load get user data

  const [deleteVisability, setDeleteVisability] = useState(false);

  // image upload
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const aboutMe = useRef(null);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleCancel = () => {
    setPreview(null);
  };
  const handleUpload = () => {
    if (!image) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("new_profile", image);
    setPreview(null);
    fetch("https://gragnily.onrender.com/api/users/updateuserprofile", {
      method: "PUT",
      body: formData,
      credentials: "include",
    })
      .then(async (res) => {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          console.log("Success:", data);
          // user.profile_picture_url = data.profile_picture_url;
          const newUser = { ...user, profile_picture_url: data.url };
          updateUser(newUser); // Update the user context with the new profile picture URL
          setLoading(false);
        } else {
          const text = await res.text();
          console.warn("Non-JSON response:", text);
        }
      })
      .catch((err) => console.error("Error:", err));
  };

  const updateUserInfo = (e) => {
    e.preventDefault(); // prevent reload

    const form = e.target; // the form element
    const username = form.elements.username.value;
    const email = form.elements.email.value;
    // TODO update this when it is added
    const aboutme = aboutMe.current.value;
    let updatedUser = {};
    if (username != "") {
      updatedUser.username = username;
    }
    if (email != "") {
      updatedUser.email = email;
    }
    if (aboutme != "") {
      console.log(aboutme);
      updatedUser.about_me = aboutme;
    }
    console.log(updatedUser, "aaaaaaa");
    fetch("https://gragnily.onrender.com/api/users/updateuser", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
      credentials: "include", // Allow cookies to be sent
    })
      .then(async (response) => {
        const data = await response.json();

        if (response.ok) {
          console.log("User updated successful!", data);

          // Fetch and update the user data in the context after info update
          fetch("https://gragnily.onrender.com/api/users/getuser", {
            method: "GET",
            credentials: "include", // This will allow cookies to be sent
          })
            .then((userResponse) => {
              if (!userResponse.ok) {
                throw new Error("Error fetching user data");
              }
              return userResponse.json();
            })
            .then((userData) => {
              updateUser(userData); // Update the user context with the fetched data
              console.log(userData);
              window.location.reload(); // Reload the page to reflect changes
            })
            .catch((err) => {
              console.log("Error fetching user data:", err.message);
            });
        } else {
          switch (data.message) {
            case "User Not Found!":
              alert("❌ User not found");
              break;
            case "Invalid Password!":
              alert("❌ Invalid password.");
              break;
            default:
              alert("Server-side error");
              break;
          }
        }
      })
      .catch((error) => {
        console.error("Network error:", error);
        alert("Something went wrong. Please try again later.");
      });
  };
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className={style.userPage}>
          <section className={style.userPfpSection}>
            <div
              style={{
                backgroundImage: `url(
                ${preview ? preview : user.profile_picture_url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className={style.userPfp}
              key={10030}
            >
              {!preview && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    id="upload-btn"
                    hidden
                  />
                  <label htmlFor="upload-btn">Choose Photo</label>
                </>
              )}
              {preview && (
                <div className={style.uploadBtnContainer}>
                  <button onClick={handleUpload}>Save</button>
                  <button onClick={handleCancel}>Cancel</button>
                </div>
              )}
            </div>
            <div className={style.aboutMeDiv}>
              <p>About Me:</p>

              <textarea
                ref={aboutMe}
                name="aboutMe"
                id="aboutMe"
                placeholder={`${
                  user.about_me
                    ? user.about_me
                    : "Placeholder.. 200 characters max"
                }`}
              ></textarea>
            </div>
          </section>

          <section className={style.formsSection}>
            <form
              className={style.changeInfoForm}
              action="sumbit"
              onSubmit={updateUserInfo}
            >
              <div className={style.formGroup}>
                <label htmlFor="username">Change Username</label>
                <input
                  className={style.leftInput}
                  type="text"
                  id="username"
                  name="username"
                  placeholder={user.username}
                />
              </div>
              <div className={style.formGroup}>
                <label htmlFor="email">Change Email</label>
                <input
                  className={style.leftInput}
                  type="email"
                  id="email"
                  name="email"
                  placeholder={user.email}
                />
              </div>

              <button className={style.sumbitButton} type="submit">
                Update
              </button>
            </form>
            <form className={`${style.rightForm}, ${style.changeInfoForm}`}>
              <div className={style.formGroup}>
                <label htmlFor="password">Change Password</label>
                <Link to="/forgot-password-in">
                  <input
                    type="button"
                    id="password"
                    name="password"
                    value="Change"
                    className={style.changeButtons}
                  />
                </Link>
                <label htmlFor="deleteUser">Delete User</label>
                <input
                  onClick={() => setDeleteVisability(true)}
                  className={style.deleteButton}
                  type="button"
                  id="deleteUser"
                  name="deleteUser"
                  value="DELETE"
                />
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
};

export default UserPage;
