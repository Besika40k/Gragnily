const asyncHandler = require("express-async-handler");
const { verifyToken, verifyJWT } = require("./verifyJwt");
const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth.config");


const deserializeUser = asyncHandler(async (req, res, next) => {
    const accessToken = req.cookies["x-access-token"];
    const refreshToken = req.cookies["x-refresh-token"];
  
    if (!accessToken) return res.status(500).json({message: "No access Token"});
  
    const { payload, expired } = verifyJWT(accessToken);
  
    if (payload) {
      req.user = payload;
      return next();
    }
  
    // If access token is expired and refresh token exists
    if (expired && refreshToken) {
      const { payload: refreshPayload } = verifyJWT(refreshToken);
  
      if (!refreshPayload) return res.status(500).json({message: "No refresh access Token"});;
  
      // Create new access token
      const newAccessToken = jwt.sign(payload, authConfig.secret);
  
      res.cookie("x-access-token", newAccessToken, {
        maxAge: 5 * 60 * 1000, // 5 minutes
        httpOnly: true,
        sameSite: "Strict",
        secure: process.env.NODE_ENV === "production",
      });
  
      const { payload: newPayload } = verifyJWT(newAccessToken);
      req.user = newPayload;
  
      return next();
    }
  
    next();
  });
  