import React from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../modules/AuthLayout";
import "../style.css"; // Make sure CSS is imported
import { useUser } from "../contexts/UserContext"; // Import the context

const SignUp = () => {
  const { updateUser } = useUser(); // Access updateUser function from context

  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    const username = event.target.username;
    const email = event.target.email;
    const password = event.target.password;
    const confirmPassword = event.target.confirm_password;
    let formValid = true;
    //username verification
    //1 check if the username is already in use in database
    //2 check if the username only contains letters and numbers and does not start with a number
    //3 check if the username is between 3 and 20 characters long
    if (
      !/^[A-Za-z][A-Za-z0-9_]*$/.test(username.value) ||
      username.value.length < 3 ||
      username.value.length > 20
    ) {
      alert("Username is not valid!");
      formValid = false;
    }
    //email adress verification

    //check if the email is already in use in database
    //check if the email is valid (contains @ and .)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value)) {
      alert("Email is not valid!");
      formValid = false;
    }

    // password verification
    if (password.value.length < 1) {
      alert("Password must be at least 8 characters long!");
      formValid = false;
    }

    if (password.value !== confirmPassword.value) {
      alert("Passwords do not match!");
      formValid = false;
    }

    if (formValid) {
      // Handle sign-up logic here (e.g., API call to create a new account)
      const userData = {
        username: username.value,
        email: email.value,
        password: password.value,
      };
      fetch("https://gragnily.onrender.com/api/auth/signup", {
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
            console.log("Account created!", data);
            const tempUserData = {
              username: username.value,
              email: email.valu,
            };
            updateUser(tempUserData);
            navigate("/login"); // Success – redirect to homepage
          } else {
            switch (data.message) {
              case "IN_USE_USER":
                alert("❌ That username is already taken.");
                break;
              case "IN_USE_EMAIL":
                alert("❌ That email is already registered.");
                break;
              case "IN_USE_USER, IN_USE_EMAIL":
                alert("orive");
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
      <h2>შექმენი შენი ანგარიში</h2>
      <form onSubmit={handleSubmit}>
        {/* New container for the columns */}
        <div className="form-columns">
          {/* Left Column */}
          <div className="form-column">
            <div className="form-group">
              <label htmlFor="username">სახელი</label>
              <input
                type="text"
                id="username"
                name="username"
                required
                placeholder="აირჩიე სახელი"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">ემაილი</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="form-column">
            <div className="form-group">
              <label htmlFor="password">პაროლი</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                placeholder="შექმენი პაროლი"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirm-password">დაადასტურე პაროლი</label>
              <input
                type="password"
                id="confirm-password"
                name="confirm_password"
                required
                placeholder="შეიყვანე პაროლი ხელთავიდან"
              />
            </div>
          </div>
        </div>{" "}
        {/* End of form-columns */}
        {/* Button remains below the columns */}
        <button type="submit" className="btn-auth">
          რეგისტრაცია
        </button>
      </form>

      <p className="toggle-link">
        უკვე გაქვს ანგარიში? <Link to="/login">შესვლა</Link>
      </p>
    </AuthLayout>
  );
};

export default SignUp;
