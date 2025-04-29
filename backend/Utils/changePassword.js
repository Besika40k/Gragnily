const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail', // or other
  auth: {
    user: "gragnily@gmail.com",
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendOTPEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: 'gragnily@gmail.com',
    to: toEmail,
    subject: 'Password Reset Verification',
    text: `Your password reset code is: ${otp}. It will expire in 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};


module.exports = {sendOTPEmail};
