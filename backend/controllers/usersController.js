const asyncHandler = require("express-async-handler");
const user = require("../models/user");
const {
  uploadProfilePicture,
  deleteCloudinaryFile,
  deleteStorageFile,
} = require("../Utils/fileUtils");
const otpGenerator = require("otp-generator");
const OTP = require("../models/otp");
const { sendOTPEmail } = require("../Utils/changePassword");
const bcrypt = require("bcryptjs");

const {
  generateVerificationToken,
  sendVerificationEmail,
} = require("../Utils/verifyEmail");

const getOtherUser = asyncHandler(async (req, res) => {
  /* #swagger.summary = 'Get User by ID' */
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  const User = await user
    .findById(userId)
    .select("username email about_me profile_picture_url");
  if (!User) {
    return res.status(404).json({ message: "User Not Found" });
  }
  res.status(200).json(User);
});

const getUsers = asyncHandler(async (req, res) => {
  //  #swagger.summary = 'Get All Users'
  const users = await user.find();

  if (users.length === 0) {
    return res.status(404).json({ message: "Users Not Found" });
  }

  res.status(200).json(users);
});

const getUserLite = asyncHandler(async (req, res) => {
  /* #swagger.summary = 'Get Current User Lite Version'
   #swagger.tags = ['Users'] */

  if (!req.userId) {
    return res.status(401).json({ message: "User Not Registered" });
  }

  const User = await user
    .findById(req.userId)
    .select("username email about_me profile_picture_url");

  if (!User) {
    return res.status(404).json({ message: "User Not Found" });
  }

  res.status(200).json(User);
});

const updateUserTextFields = asyncHandler(async (req, res) => {
  /* #swagger.summary = 'Update Text Fields of Current User' 
  #swagger.requestBody = {
  required: true,
  content: {
    "application/json": {
      schema: {
        type: "object",
        additionalProperties: true
      }
    }
  }
}
  */

  const { username, email } = req.body;

  if (!req.userId)
    return res.status(401).json({ message: "User Not Signed In" });

  if (username) {
    if (await user.findOne({ username })) {
      return res.status(409).json({ message: `IN_USE_USERNAME` });
    }
  }
  if (email) {
    if (await user.findOne({ email })) {
      return res.status(409).json({ message: `IN_USE_EMAIL` });
    }

    await user.findByIdAndUpdate(req.userId, {
      $set: req.body,
      isVerified: false,
    });

    sendVerificationEmail(email, generateVerificationToken(req.userId));

    return res
      .status(200)
      .json({ message: "User updated successfully, Check Email To Verify" });
  }

  await user.findByIdAndUpdate(req.userId, { $set: req.body });

  res.status(200).json({ message: "User updated successfully" });
});

const updateUserProfile = asyncHandler(async (req, res) => {
  /* #swagger.summary = 'Update User Profile Picture' 
  #swagger.requestBody = {
  required: true,
  content: {
    "multipart/form-data": {
    schema: {
      type: "object",
      properties: {
      new_profile: {
        type: "string",
        format: "binary"
      }
      }
    }
    }
  }
  }
*/

  if (!req.userId)
    return res.status(401).json({ message: "User Not Signed In" });

  let url, public_id;
  const files = req.files;
  const newProfile = files.new_profile?.[0];

  if (!newProfile) {
    return res.status(400).json("No profile image uploaded");
  }

  try {
    const User = await user.findById(req.userId);

    if (User.profile_picture_url !== process.env.PROFILE_PICTURE_URL) {
      await deleteCloudinaryFile(User.profile_picture_public_id);
    }

    ({ url, public_id } = await uploadProfilePicture(newProfile.path, "users"));

    if (!url || !public_id) {
      return res.status(500).json("Upload to Cloudinary failed");
    }

    await user.findByIdAndUpdate(req.userId, {
      profile_picture_url: url,
      profile_picture_public_id: public_id,
    });

    res.status(200).json({ message: "Profile Picture Updated", url: url });
  } catch (err) {
    await deleteCloudinaryFile(public_id);

    res.status(500).json({ message: "Something went wrong", error: err });
  } finally {
    if (newProfile?.path) {
      await deleteStorageFile(newProfile);
    }
  }
});

const requestPasswordChange = asyncHandler(async (req, res) => {
  /* #swagger.summary = 'Send Request for Password Change' */
  if (!req.userId) return res.status(500).send("User not signed in");

  const User = await user.findById(req.userId);

  const otp = otpGenerator.generate(6, {
    digits: true,
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });

  try {
    await OTP.create({ email: User.email, otp });

    sendOTPEmail(User.email, otp);

    res.status(200).send("OTP sent successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending OTP");
  }
});

const updateUserPassword = asyncHandler(async (req, res) => {
  /* #swagger.summary = 'Check OTP and Change User Password' */
  const User = await user.findById(req.userId);
  const { otp, password } = req.body;

  try {
    const otpRecord = await OTP.findOne({ email: User.email, otp });

    if (otpRecord) {
      await OTP.deleteOne({ email: User.email, otp });

      let hashedPassword = bcrypt.hashSync(password, 8);

      await user.findByIdAndUpdate(req.userId, {
        password: hashedPassword,
      });
      res.status(200).send("Password Updated Successfully");
    } else {
      res.status(400).send("Invalid OTP");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error verifying OTP");
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  /* #swagger.summary = 'Delete Current User' */
  if (!req.userId)
    return res.status(401).json({ message: "User Not Signed In" });

  const User = await user.findById(req.userId);

  if (!User) return res.status(404).json({ message: "User Not Found" });

  if (
    User.profile_picture_url &&
    User.profile_picture_url !== process.env.PROFILE_PICTURE_URL
  ) {
    await deleteCloudinaryFile(User.profile_picture_public_id);
  }

  await user.findByIdAndDelete(req.userId);

  res
    .clearCookie("x-access-token")
    .clearCookie("x-refresh-token")
    .status(200)
    .json("User Deleted Successfully");
});

module.exports = {
  getUsers,
  getUserLite,
  updateUserProfile,
  updateUserTextFields,
  deleteUser,
  requestPasswordChange,
  updateUserPassword,
  getOtherUser,
};
