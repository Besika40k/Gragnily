import React from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../modules/AuthLayout";

const LogIn = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Log In form submitted");
  };

  return (
    <AuthLayout>
      <h2>Welcome Back!</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="you@example.com"
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
