import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../modules/AuthLayout";
import { useUser } from "../contexts/UserContext"; // Import the context

const LogIn = () => {
  const { updateUser } = useUser(); // Access updateUser function from context
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    let formValid = true;
    const username = event.target.username;
    const password = event.target.password;

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
    }
  };

  return (
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
  );
};

export default LogIn;
