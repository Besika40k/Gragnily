const asyncHandler = require("express-async-handler");
const config = require("../config/auth.config");
const user = require("../models/user");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const otpGenerator = require("otp-generator");
const OTP = require("../models/otp");
const { sendOTPEmail } = require("../Utils/changePassword");

const {
  generateVerificationToken,
  sendVerificationEmail,
} = require("../Utils/verifyEmail");

const signUp = asyncHandler(async (req, res) => {
  /* #swagger.summary = 'Register User' */
  const { username, email, password } = req.body;
  let User;
  try {
    User = await user.create({
      username: username,
      email: email,
      password: bcrypt.hashSync(password, 8),
      role: "user",
      profile_picture_url: process.env.PROFILE_PICTURE_URL,
      profile_picture_public_id: process.env.PROFILE_PICTURE_ID,
    });

    sendVerificationEmail(email, generateVerificationToken(User._id));
  } catch (error) {
    user.findByIdAndDelete(User._id);
    console.log(error);
    res
      .status(500)
      .json({ message: "Something went wrong in signUp", err: error });
  }

  res.status(200).json({ message: "Registration successful" });
});

const verifyUserEmail = asyncHandler(async (req, res) => {
  /* #swagger.summary = 'Verify Users Email with Token' */
  const { token } = req.query;

  if (!token) {
    return res.status(400).send("Verification token is missing");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.EMAIL_SECRET_KEY);
  } catch (err) {
    return res
      .status(400)
      .send({ message: "Invalid or expired token", error: err });
  }

  if (!decoded.userId) {
    return res.status(400).send("Invalid or expired token");
  }

  const updatedUser = await user.findByIdAndUpdate(
    decoded.userId,
    { isVerified: true },
    { new: true }
  );

  if (!updatedUser) {
    return res.status(404).send("User not found");
  }

  res.send("Email successfully verified!");
});

const forgotPassword = asyncHandler(async (req, res) => {
  /* #swagger.summary = 'sends OTP on given email' */

  const { email } = req.body;

  const User = await user.findOne({ email: email });

  if (!User) {
    return res.status(404).json({ message: "Email Not Found" });
  }

  const otp = otpGenerator.generate(6, {
    digits: true,
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });

  try {
    await OTP.create({ email, otp });

    sendOTPEmail(email, otp);

    const isProd = process.env.MY_ENVIRONMENT === "production";

    res
      .status(200)
      .cookie("email", email, {
        httpOnly: true,
        sameSite: isProd ? "None" : "Lax",
        secure: isProd,
        maxAge: 10 * 60 * 1000,
      })
      .send("OTP sent successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending OTP");
  }
});

const updateUserPassword = asyncHandler(async (req, res) => {
  /* #swagger.summary = 'Check OTP and Change User Password' */
  const { otp, password } = req.body;

  const email = req.cookies["email"];

  try {
    const otpRecord = await OTP.findOne({ email, otp });

    if (otpRecord) {
      await OTP.deleteOne({ email, otp });

      let hashedPassword = bcrypt.hashSync(password, 8);

      await user.updateOne({ email }, { password: hashedPassword });

      res.status(200).send("Password Updated Successfully");
    } else {
      res.status(400).send("Invalid OTP");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error verifying OTP");
  }
});

const signIn = asyncHandler(async (req, res) => {
  /* #swagger.summary = 'SignIn User ' */
  const { username, password } = req.body;

  const foundUser = await user.findOne({
    username: username,
  });

  if (!foundUser) return res.status(404).json({ message: "User Not Found!" });
  else if (!foundUser.isVerified)
    return res.status(403).json({ message: "User's Email Not Verified!" });
  var passwordIsValid = bcrypt.compareSync(password, foundUser.password);

  if (!passwordIsValid) {
    return res.status(401).send({
      accessToken: null,
      message: "Invalid Password!",
    });
  }

  let token = jwt.sign({ id: foundUser._id }, config.secret, {
    expiresIn: config.jwtExpiration,
  });

  let newRefreshToken = jwt.sign({ id: foundUser._id }, config.secret, {
    expiresIn: config.jwtRefreshExpiration,
  });

  let authority = "ROLE_" + foundUser.role;
console.log(process.env.MY_ENVIRONMENT);
  const isProd = process.env.MY_ENVIRONMENT === "production";
  res
    .cookie("x-access-token", token, {
      httpOnly: true,
      sameSite: isProd ? "None" : "Lax",
      secure: isProd,
      maxAge: config.jwtExpiration * 1000,
    })
    .cookie("x-refresh-token", newRefreshToken, {
      httpOnly: true,
      sameSite: isProd ? "None" : "Lax",
      secure: isProd,
      maxAge: config.jwtRefreshExpiration * 1000,
    })
    .status(200)
    .json({
      message: "Logged in",
      id: user._id,
      username: user.username,
      email: user.email,
      role: authority,
      accessToken: token,
      refreshToken: newRefreshToken,
    });
});

const logOut = asyncHandler(async (req, res) => {
  /* #swagger.summary = 'LogOut Current User' */
  if (req.cookies["x-refresh-token"] || req.cookies["x-access-token"]) {
    return res
      .clearCookie("x-refresh-token", {
        httpOnly: true,
        sameSite: process.env.MY_ENVIRONMENT === "production" ? "None" : "Lax",
        secure: process.env.MY_ENVIRONMENT === "production",
      })
      .status(200)
      .json({ message: "User Logged Out" });
  }

  res.status(201).json({ message: "User Already Logged Out" });
});

module.exports = {
  signUp,
  signIn,
  logOut,
  verifyUserEmail,
  forgotPassword,
  updateUserPassword,
};
