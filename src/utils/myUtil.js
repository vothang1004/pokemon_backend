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
function generateRandomCode(length = 6) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

module.exports = {
  generateAccessToken,
  generateRandomCode,
};
