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
                <h2>პაროლის განახლება</h2>
                <p className="instruction-text">
                  შეიყვანე შენი Email რომლითაც დარეგისტრირდი და ჩვენ
                  გამოგიგზავნით პაროლის შესაცვლელ ლინკს.
                </p>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="email">ემაილი</label>
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
                    განახლების ლინკის გამოგზავნა
                  </button>
                </form>
                <p className="toggle-link">
                  {" "}
                  {/* Use consistent link class */}
                  გაგახსენდათ პაროლი? <Link to="/login">
                    შედით ანგარიშზე
                  </Link>{" "}
                  {/* Link back to login */}
                </p>
              </>
            )}
            {sent && (
              <>
                <h2>შეიყვანეთ თქვენი კოდი აქ</h2>
                <EnterCode isLoading={isLoading} callback={handleCodeSubmit} />
                <input
                  ref={newPassword}
                  type="text"
                  placeholder="შეიყვანე შენი კოდი"
                />
                <button onClick={handleFinalSubmit}>გაგზავნა</button>
              </>
            )}
          </AuthLayout>
        </>
      )}
    </>
  );
};

export default ForgotPassword;
