const asyncHandler = require("express-async-handler");
const user = require("../models/user");

const checkDuplicate = asyncHandler(async (req, res, next) => {
  try {
    const inUseUser = await user.findOne({
      username: req.body.username,
    });

    const inUseEmail = await user.findOne({
      email: req.body.email,
    });

    if (inUseUser && inUseEmail) {
      res.status(500).json({ message: `IN_USE_USER, IN_USE_EMAIL` });
      return;
    }

    if (inUseUser) {
      res.status(500).json({ message: `IN_USE_USER` });
      return;
    }

    if (inUseEmail) {
      res.status(500).json({ message: `IN_USE_EMAIL` });
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
