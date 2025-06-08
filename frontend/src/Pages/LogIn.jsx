import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../modules/AuthLayout";
import { useUser } from "../contexts/UserContext"; // Import the context
import "./Login.css"; // Make sure CSS is imported

const LogIn = () => {
  const { user, updateUser } = useUser(); // Access updateUser function from context
  const navigate = useNavigate();
  let noclose = false;
  const closePopup = () => {
    if (noclose) {
      noclose = false;
      return;
    }
    const errorPopup = document.getElementById("emailVerify");
    errorPopup.style.display = "none"; // Hide the error popup
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    let formValid = true;
    const username = event.target.username;
    const password = event.target.password;
    console.log(username.value, password.value);
    if (formValid) {
      const userData = {
        username: username.value,
        password: password.value,
      };

      fetch("https://gragnily.onrender.com/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        credentials: "include", // Allow cookies to be sent
      })
        .then(async (response) => {
          const data = await response.json();
          console.log(response, data);
          if (response.ok) {
            console.log("Login successful!", data);

            // Fetch and update the user data in the context after login
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
                navigate("/"); // Success – redirect to homepage
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
              case "User's Email Not Verified!":
                const errorPopup = document.getElementById("emailVerify");
                console.log(userData.username);
                errorPopup.style.display = "flex"; // Show the error popup
                break;
              default:
                alert("Server-side error");
                break;
              //403 not verified
            }
          }
        })
        .catch((error) => {
          console.error("Network error:", error);
          alert("Something went wrong. Please try again later.");
        });
    }
  };
  const handleEmailResend = () => {
    //resend verification email
    console.log("Resending verification email...");
    //make the button on 30 s cooldown

    const button = document.querySelector(".btn-verify-email");
    button.disabled = true;
    button.style.pointerEvents = "none";
    button.style.opacity = "0.5";

    const btnText = document.getElementById("btn-verify-email-inner-text");
    let countdown = 30;
    btnText.innerHTML = `You can resend in... ${countdown}s`;
    const interval = setInterval(() => {
      countdown--;
      btnText.innerHTML = `You can resend in... ${countdown}s`;
      if (countdown <= 0) {
        clearInterval(interval);
        button.disabled = false;
        button.style.pointerEvents = "auto";
        button.style.opacity = "1";
        btnText.innerText = "Click me";
      }
    }, 1000);
  };
  return (
    <div className="login-container">
      <div
        onClick={closePopup}
        id="emailVerify"
        className="verify-email-container"
      >
        <div className="verify-email-contnet" onClick={() => (noclose = true)}>
          <div className="button-div">
            <button onClick={closePopup} className="close-button">
              X
            </button>
          </div>
          <h2>Verify Your Email</h2>
          <p>
            Hi, <b>{user.username}</b>! please check your email for a
            verification link. If you haven't received it, click on the BIG RED
            BUTTON below ☻
          </p>
          {/* ADD ON CLICK EVENT THAT AFTER A SECOND OF DELAY MAKES DISPLAY NONE AND RE-SENDS A VERIFICATION CODE AND THEN DISABLE THE BUTTON */}
          <button onClick={handleEmailResend} className="btn-verify-email">
            <span className="shadow"></span>
            <span className="edge"></span>
            <span id="btn-verify-email-inner-text" className="front text">
              {" "}
              Click me
            </span>
          </button>
        </div>
      </div>
      <AuthLayout>
        <h2>კეთილი იყოს თქვენი დაბრუნება!</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">სახელი</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              placeholder="თქვენი სახელი"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">პაროლი</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              placeholder="შეიყვანეთ თქვენი პაროლი"
            />
          </div>

          <div className="forgot-password-link">
            <Link to="/forgot-password-out">დაგავიწყდათ პაროლი?</Link>
          </div>

          <button type="submit" className="btn-auth">
            შესვლა
          </button>
        </form>
        <p className="toggle-link">
          არ გაქვს ანგარიში? <Link to="/sign-up">დარეგისტრირდი</Link>
        </p>
      </AuthLayout>
    </div>
  );
};

export default LogIn;
