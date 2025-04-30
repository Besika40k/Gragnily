
const nodeMailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: "gragnily@gmail.com",
    pass: process.env.EMAIL_PASSWORD,
  },
});

const generateVerificationToken = (userId) => {
  return jwt.sign({ userId }, process.env.EMAIL_SECRET_KEY, {
    expiresIn: "10m",
  });
};

const sendVerificationEmail = (userEmail, token) => {
  const verificationUrl = `https://gragnily.onrender.com/api/auth/emailVerification?token=${token}`;

  const mailOptions = {
    from: "gragnily@gmail.com",
    to: userEmail,
    subject: "Gragnily - Email Verification",
    text: `გამოიყენეთ ლინკი ვერიფიკაცისთვის: ${verificationUrl}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      throw new Error("Email Doesn't Exist!");
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = { generateVerificationToken, sendVerificationEmail };
