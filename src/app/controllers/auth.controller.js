const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const { generateAccessToken } = require("../../utils/myUtil");

const authController = {
  async register(req, res, next) {
    try {
      const username = req.body.username;
      const password = req.body.password;

      if (!username || !password) {
        return res
          .status(404)
          .json({ message: "Missing username or password" });
      }
      const userSaved = await userModel.findOne({ username });
      if (userSaved) {
        return res.status(400).json({ message: "Username is exist" });
      }
      const user = new userModel({ username, password });
      await user.save();
      const { password: pw, ...userSend } = user._doc;
      return res.status(200).json(userSend);
    } catch (error) {
      error.statusCode = 500;
      next(error);
    }
  },
  async login(req, res, next) {
    try {
      const username = req.body.username;
      const password = req.body.password;
      if (!username || !password) {
        return res
          .status(404)
          .json({ message: "Missing username or password" });
      }
      const user = await userModel.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // const salt = await bcrypt.genSalt(10);
      // const hashPassword = await bcrypt.hash(password, salt);
      bcrypt
        .compare(password, user.password)
        .then((result) => {
          if (result) {
            const { password: pw, ...userSend } = user._doc;
            const accessToken = generateAccessToken(user);
            return res.status(200).json({ user: userSend, accessToken });
          } else {
            return res.status(404).json({ message: "Password is not match" });
          }
        })
        .catch((err) => {
          res.statusCode = 500;
          next(err);
        });
    } catch (error) {
      error.statusCode = 500;
      next(error);
    }
  },
};

module.exports = authController;
