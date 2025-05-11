import style from "./PasswordReset.module.css";
import { useState, useRef } from "react";
import EnterCode from "./EnterCode.jsx";
import AuthLayout from "../AuthLayout.jsx";

const PasswordReset = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [codeFinal, setCodeFinal] = useState();
  const newPassword = useRef();
  const isLoggedIn = false;

  const handleEmailSend = async () => {
    try {
      const response = await fetch(
        "https://gragnily.onrender.com/api/users/requestPasswordChange",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Request failed");
      if (response.ok) {
        setCodeSent(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCodeSubmit = async (code) => {
    if (isLoading) return;
    setCodeFinal(code);
  };

  const handleSubmit = async () => {
    // add check OTP
    // add check Password
    try {
      const payload = {
        otp: codeFinal,
        password: newPassword.current.value,
      };

      const result = await fetch(
        "https://gragnily.onrender.com/api/users/updateuserpassword",
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
      alert("Code is verified!");
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={style.fullSection}>
      <AuthLayout>
        {!codeSent && (
          <>
            <h1>send verification code to email</h1>
            <button className="btn-auth" onClick={handleEmailSend}>
              send
            </button>
          </>
        )}
        {codeSent && (
          <>
            <h2>Enter your code here</h2>
            <EnterCode isLoading={isLoading} callback={handleCodeSubmit} />
            <input
              ref={newPassword}
              type="text"
              placeholder="Enter the new password"
            />
            <button onClick={handleSubmit}>submit</button>
          </>
        )}
      </AuthLayout>
    </section>
  );
};

export default PasswordReset;
