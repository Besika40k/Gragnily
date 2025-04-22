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
    password: await bcrypt.hashSync(password, 8),
    role: "user",
  });

  res
    .cookie("x-access-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    })
    .cookie("x-refresh-token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    })
    .status(200)
    .json({ message: "Logged in" });

  res.send({ message: "User was registered successfully!" });
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

  let newRefreshToken = jwt.sign({id: foundUser._id}, config.secret, {
    expiresIn: config.jwtRefreshExpiration
  });

  let authority = "ROLE_" + foundUser.role;

  res
    .cookie("x-access-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    })
    .cookie("x-refresh-token", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
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

module.exports = {
  signUp,
  signIn,
};
