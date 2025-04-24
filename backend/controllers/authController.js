const asyncHandler = require("express-async-handler");
const config = require("../config/auth.config");
const user = require("../models/user");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const signUp = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  user.create({
    username: username,
    email: email,
    password: bcrypt.hashSync(password, 8),
    role: "user",
    profile_picture_url: process.env.PROFILE_PICTURE_URL,
    profile_picture_public_id: process.env.PROFILE_PICTURE_ID,
  });

  res.status(200).json({ message: "Registration successful" });
});

const signIn = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const foundUser = await user.findOne({
    username: username,
  });

  if (!foundUser) return res.status(404).json({ message: "User Not Found!" });

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
  const isProd = process.env.NODE_ENV === "production";
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
  if (req.cookies["x-refresh-token"] || req.cookies["x-access-token"]) {
    return res
      .clearCookie("x-refresh-token", {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        secure: process.env.NODE_ENV === "production",
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
};
