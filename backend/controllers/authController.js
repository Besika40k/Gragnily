const asyncHandler = require("express-async-handler");
const config = require("../config/auth.config");
const user = require("../models/user");
const role = require("../models/role");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const signUp = asyncHandler(async (req, res) => {
  try {
    let foundRoles;

    if (req.body.roles)
      foundRoles = role.find({ name: { $in: req.body.roles } });
    else foundRoles = role.find({ name: "user" });

    let newUserRoles = (await foundRoles).map((x) => x._id);

    if (newUserRoles.length === 1) newUserRoles = [newUserRoles];

    user.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      roles: newUserRoles,
    });

    res.send({ message: "User was registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: err });
    return;
  }
});

const signIn = asyncHandler(async (req, res) => {
  try {
    const foundUser = await user.findOne({
      username: req.body.username,
    });

    if (!foundUser) return res.status(404).json({ message: "User Not Found!" });
    console.log(foundUser.password, foundUser)
    var passwordIsValid = bcrypt.compareSync(
      req.body.password,
      foundUser.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    const token = jwt.sign({ id: foundUser.id }, config.secret, {
      algorithm: "HS256",
      allowInsecureKeySizes: true,
      expiresIn: 86400, // 24 hours
    });

    var authorities = [];

    for (let i = 0; i < foundUser.roles.length; i++) {
      const roleData = await role.findById(foundUser.roles[i]);
      authorities.push("ROLE_" + roleData.name);
    }

    res.status(200).send({
      id: foundUser._id,
      username: foundUser.username,
      email: foundUser.email,
      roles: authorities,
      accessToken: token,
    });
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

module.exports = {
  signUp,
  signIn,
};
