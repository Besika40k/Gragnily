const asyncHandler = require("express-async-handler");
const user = require("../models/user");
const role = require("../models/role");

checkDuplicate = asyncHandler(async (req, res, next) => {
  try {
    const inUseUser = await user.findOne({
      username: req.body.username,
    });

    const inUseEmail = await user.findOne({
      email: req.body.email,
    });

    if (inUseUser) {
      res
        .status(500)
        .json({ message: `User ${req.body.username} is already in use!` });
      return;
    }

    if (inUseEmail) {
      res
        .status(500)
        .json({ message: `Email ${req.body.email} is already in use!` });
      return;
    }
    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: `Duplicate Checking raised an error`, Error: error });
  }
});

checkRolesExisted = asyncHandler(async (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!role.findOne({ name: req.body.roles[i] })) {
        res.status(400).json({
          message: `Role ${req.body.roles[i]} doesn't exist!`,
        });
        return;
      }
    }
    next();
  }
});

module.exports = {
  checkDuplicate,
  checkRolesExisted,
};
