const asyncHandler = require("express-async-handler");
const { verifyJWT } = require("./verifyJwt");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");

const deserializeUser = asyncHandler(async (req, res, next) => {
  const accessToken = req.cookies["x-access-token"];
  const refreshToken = req.cookies["x-refresh-token"];

  if (!refreshToken) {
    console.log("No refresh access Token");
    return next();
  }

  const { payload } = verifyJWT(accessToken);

  if (payload) {
    req.userId = payload.id;
    return next();
  }

  // If access token is expired and refresh token exists
  if (!accessToken && refreshToken) {
    const { payload: refreshPayload } = verifyJWT(refreshToken);

    // Create new access token
    const newAccessToken = jwt.sign(refreshPayload, config.secret);

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("x-access-token", newAccessToken, {
      maxAge: config.jwtExpiration * 1000,
      httpOnly: true,
      sameSite: isProd ? "None" : "Lax",
      secure: isProd,
    });

    req.userId = refreshPayload.id;
    return next();
  }
});

module.exports = deserializeUser;
