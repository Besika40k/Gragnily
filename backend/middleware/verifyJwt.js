const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const user = require("../models/user");
const asyncHandler = require("express-async-handler");

catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res
      .status(401)
      .send({ message: "Unauthorized! Access Token was expired!" });
  }

  return res.sendStatus(401).send({ message: "Unauthorized!" });
};

const verifyToken = asyncHandler(async (req, res, next) => {
  let token = await req.cookies["x-access-token"];
  console.log(req.cookies["x-access-token"]);

  if (!token) {
    return res.status(403).json({ message: "no token provided!" });
  }

  const decodedToken = jwt.verify(token, config.secret);
  req.userId = decodedToken.id;
  next();
});

const verifyJWT = (token) => {
  try {
    const decoded = jwt.verify(token, config.secret);
    return { payload: decoded, expired: false };
  } catch (error) {
    return { payload: null, expired: error.message.includes("jwt expired") };
  }
};

isSomething = (Role) =>
  asyncHandler(async (req, res, next) => {
    const foundUser = await user.findById(req.userId);

    if (foundUser.role == Role) {
      next();
      return;
    }

    res.status(403).send({ message: `Requires ${Role} Role!` });
  });

const isAdmin = isSomething("admin");

module.exports = {
  verifyToken,
  isAdmin,
  verifyJWT,
};
