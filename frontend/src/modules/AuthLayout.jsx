import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <div
      style={{ position: "absolute", top: "0", zIndex: "55555" }}
      className="full-auth-page"
    >
      <div className="auth-page">
        <div className="logo-container">
          <div className="logo-icon">
            <i className="fas fa-book-open"></i> {/* Font Awesome Icon */}
          </div>
          <h1 className="site-name">Gragnily</h1>
        </div>
        <div className="auth-form-container">
          {children}{" "}
          {/* This is where SignUp or LogIn content will be injected */}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
