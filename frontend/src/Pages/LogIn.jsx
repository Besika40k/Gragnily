import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../modules/AuthLayout";
import { useUser } from "../contexts/UserContext"; // Import the context
import "./Login.css"; // Make sure CSS is imported

const LogIn = () => {
  const { user, updateUser } = useUser(); // Access updateUser function from context
  const navigate = useNavigate();
  console.log(user);

  const closePopup = () => {
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

  return (
    <div className="login-container">
      <div id="emailVerify" className="verify-email-container">
        <div className="verify-email-contnet">
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
          <button className="btn-verify-email">
            <span class="shadow"></span>
            <span class="edge"></span>
            <span class="front text"> Click me</span>
          </button>
        </div>
      </div>
      <AuthLayout>
        <h2>Welcome Back!</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              placeholder="your name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              placeholder="Enter your password"
            />
          </div>

          <div className="forgot-password-link">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button type="submit" className="btn-auth">
            Log In
          </button>
        </form>
        <p className="toggle-link">
          Don't have an account? <Link to="/sign-up">Sign Up</Link>
        </p>
      </AuthLayout>
    </div>
  );
};

export default LogIn;
