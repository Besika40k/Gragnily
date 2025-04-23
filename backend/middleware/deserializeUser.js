const asyncHandler = require("express-async-handler");
const { verifyJWT } = require("./verifyJwt");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");

const deserializeUser = asyncHandler(async (req, res, next) => {
  const accessToken = req.cookies["x-access-token"];
  const refreshToken = req.cookies["x-refresh-token"];

  if (!refreshToken)
    return res.status(500).json({ message: "No refresh access Token" });

  const { payload } = verifyJWT(accessToken);

  // If access token is expired and refresh token exists
  if (!accessToken && refreshToken) {
    const { payload: refreshPayload } = verifyJWT(refreshToken);

    // Create new access token
    const newAccessToken = jwt.sign(refreshPayload, config.secret);

    res.cookie("x-access-token", newAccessToken, {
      maxAge: config.jwtExpiration * 1000,
      httpOnly: true,
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production",
    });

    req.userId = refreshPayload.id;
    return next();
  }

  req.userId = payload.id;
  next();
});

module.exports = deserializeUser;
