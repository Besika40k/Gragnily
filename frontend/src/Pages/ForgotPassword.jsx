import React from "react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import { useNavigate } from "react-router-dom";
import AuthLayout from "../modules/AuthLayout"; // Import the shared layout
import PasswordReset from "../modules/UserVerification/PasswordReset";
import EnterCode from "../modules/UserVerification/EnterCode";
const ForgotPassword = ({ logIn }) => {
  // login true? logged
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();
  const emailInput = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const newPassword = useRef();
  const [codeFinal, setCodeFinal] = useState();
  const handleCodeSubmit = async (code) => {
    if (isLoading) return;
    setCodeFinal(code);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = emailInput.current.value;
    try {
      const result = await fetch(
        "https://gragnily.onrender.com/api/auth/forgotPassword",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
          credentials: "include",
        }
      );
      console.log(result);
      if (!result.ok) {
        const mess = await result.text();
        throw new Error(mess);
      }
      // redirect user
      alert("Code is verified!");
      setSent(true);
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setSent(true);
    }
  };
  const handleFinalSubmit = async () => {
    // add check OTP
    // add check Password
    try {
      const payload = {
        otp: codeFinal,
        password: newPassword.current.value,
      };

      const result = await fetch(
        "https://gragnily.onrender.com/api/auth/updatePassword",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          credentials: "include",
        }
      );
      console.log(result);
      if (!result.ok) {
        const mess = await result.text();
        throw new Error(mess);
      }
      // redirect user
      navigate("/login");
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {logIn ? (
        <PasswordReset />
      ) : (
        <>
          <AuthLayout>
            {!sent && (
              <>
                <h2>Reset Your Password</h2>
                <p className="instruction-text">
                  Enter the email address associated with your account, and
                  we'll send you a link to reset your password.
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
                      ref={emailInput}
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
              </>
            )}
            {sent && (
              <>
                <h2>Enter your code here</h2>
                <EnterCode isLoading={isLoading} callback={handleCodeSubmit} />
                <input
                  ref={newPassword}
                  type="text"
                  placeholder="Enter the new password"
                />
                <button onClick={handleFinalSubmit}>submit</button>
              </>
            )}
          </AuthLayout>
        </>
      )}
    </>
  );
};

export default ForgotPassword;
