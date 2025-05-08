import style from "./PasswordReset.module.css";
import { useState, useRef } from "react";
import EnterCode from "./EnterCode.jsx";
import AuthLayout from "../AuthLayout.jsx";

const PasswordReset = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const newPassword = useRef();
  const isLoggedIn = false;

  const handleEmailSend = async () => {};

  const handleCodeSubmit = async (code) => {
    if (isLoading) return;

    try {
      const payload = {
        otp: code,
        password: "123",
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
  codeSent;
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
            <EnterCode isLoading={isLoading} callback={handleCodeSubmit} />
            <input
              ref={newPassword}
              type="text"
              placeholder="Enter the new password"
            />
          </>
        )}
      </AuthLayout>
    </section>
  );
};

export default PasswordReset;
