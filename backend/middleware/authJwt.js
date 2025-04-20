const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const user = require("../models/user");
const role = require("../models/role");
const asyncHandler = require("express-async-handler");

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).json({ message: "no token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = isSomething("admin");
isModerator = isSomething("moderator");

isSomething = (Role) =>
  asyncHandler(async (req, res, next) => {
    try {
      const foundUser = await user.findById(req.userId);
      const userRoles = await role.find({ _id: { $in: foundUser } });

      for (let i = 0; i < userRoles.length; i++) {
        if ((userRoles[i].name = Role)) {
          next();
          return;
        }
      }

      res.status(403).send({ message: `Require ${Role} Role!` });
    } catch (error) {
      res
        .status(500)
        .json({ message: `Error Checking is${Role}`, Error: error });
    }
  });

module.exports = {
  verifyToken,
  isAdmin,
  isModerator,
};
