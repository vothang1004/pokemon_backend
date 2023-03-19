const accountRouter = require("./account.route");
const serverRouter = require("./server.route");
const authRouter = require("./auth.route");
const createError = require("http-errors");

const initApiRoute = (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/accounts", accountRouter);
  app.use("/api/servers", serverRouter);
  app.use((req, res, next) => {
    const error = createError.NotFound("Route is not exist");
    next(error);
  });
  app.use((err, req, res, next) => {
    res.json({
      status: err.status || 404,
      message: err.message,
    });
  });
};
module.exports = initApiRoute;
