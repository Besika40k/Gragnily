import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import AuthLayout from "../modules/AuthLayout"; // Import the shared layout

const ForgotPassword = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle forgot password logic here (e.g., API call to send reset email)
    console.log("Forgot password form submitted");
    // You might want to show a success message to the user here
  };

  return (
    <AuthLayout>
      {" "}
      {/* Use the shared layout */}
      <h2>Reset Your Password</h2>
      {/* Add some instructional text */}
      <p className="instruction-text">
        Enter the email address associated with your account, and we'll send you
        a link to reset your password.
      </p>
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

        <button type="submit" className="btn-auth">
          {" "}
          {/* Use consistent button class */}
          Send Reset Link
        </button>
      </form>
      <p className="toggle-link">
        {" "}
        {/* Use consistent link class */}
        Remembered your password? <Link to="/login">Log In</Link>{" "}
        {/* Link back to login */}
      </p>
    </AuthLayout>
  );
};

export default ForgotPassword;
