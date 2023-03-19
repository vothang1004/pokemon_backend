const jwt = require("jsonwebtoken");
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_ACCESS_KEY,
    { expiresIn: "30d" }
  );
};

module.exports = {
  generateAccessToken,
};
