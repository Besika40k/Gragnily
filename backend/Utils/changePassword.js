const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail", // or other
  auth: {
    user: "gragnily@gmail.com",
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendOTPEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: "gragnily@gmail.com",
    to: toEmail,
    subject: "Password Reset / პაროლის შეცვლა",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Password Reset / პაროლის შეცვლა</h2>
        <p>Hello,</p>
        <p>To reset your password, use the code below/პაროლის შესაცვლელად გამოიყენეთ კოდი:</p>
        <p style="font-size: 20px; font-weight: bold;">🔐 ${otp}</p>
        <p>This code is valid for <strong>10 minutes</strong>.</p>
        <br>
        <p>Best regards,<br>Gragnily Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOTPEmail };
