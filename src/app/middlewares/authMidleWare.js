const jwt = require("jsonwebtoken");

const authMidleWare = {
  verifyToken(req, res, next) {
    const tokenHeader = req.headers["token"];
    if (!tokenHeader) {
      return res.status(401).json({ message: "You are not token" });
    }
    const accessToken = tokenHeader.split(" ")[1];
    jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_KEY,
      function (err, decoded) {
        if (err) {
          return res.status(403).json({ message: "You are not authenticated" });
        }
        req.user = decoded
        next();
      }
    );
  },
};
module.exports = authMidleWare;
