const asyncHandler = require("express-async-handler");
const user = require("../models/user");

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

module.exports = {
  checkDuplicate,
};
