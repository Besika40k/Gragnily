const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const user = require("../models/user");
const asyncHandler = require("express-async-handler");


const verifyJWT = (token) => {
  try {
    const decoded = jwt.verify(token, config.secret);
    return { payload: decoded, expired: false };
  } catch (error) {
    return { payload: null, expired: error.message.includes("jwt expired") };
  }
};

const isSomething = (Role) =>
  asyncHandler(async (req, res, next) => {
    const foundUser = await user.findById(req.userId);

    if (!foundUser) {
      return res.status(401).json({ message: "user Not Signed In" });
    }

    if (foundUser.role == Role) {
      return next();
    }

    res.status(403).send({ message: `Requires ${Role} Role!` });
  });

const isAdmin = isSomething("admin");

module.exports = {
  isAdmin,
  verifyJWT,
};
