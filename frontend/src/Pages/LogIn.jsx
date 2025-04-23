import React from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../modules/AuthLayout";

const LogIn = () => {
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

      fetch("http://localhost:8080/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        credentials: "include",
      })
        .then(async (response) => {
          const data = await response.json();

          if (response.ok) {
            console.log("login ok!", data);
            navigate("/"); // Success – redirect to homepage
          } else {
            switch (data.message) {
              case "User Not Found!":
                alert("❌ user");
                break;
              case "Invalid Password!":
                alert("❌ Tpassword.");
                break;
              default:
                alert("serverside error");
                break;
            }
          }
        })
        .catch((error) => {
          console.error(" Network error:", error);
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
