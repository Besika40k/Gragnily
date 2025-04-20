// const authJwt = require("./authJwt");
// const verifySignUp = require("./verifySignUp");
const role = require("../models/role");

async function initial() {
  try {
    const documentCount = await role.estimatedDocumentCount().exec();

    if (documentCount === 0) {
      role.create({ name: "user" });
      console.log("added 'user' to roles collection");
      role.create({ name: "admin" });
      console.log("added 'moderator' to roles collection");
      role.create({ name: "moderator" });
      console.log("added 'admin' to roles collection");
    }
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = initial;
