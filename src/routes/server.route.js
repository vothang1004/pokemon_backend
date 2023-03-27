const router = require("express").Router();
const serverController = require("../app/controllers/server.controller");
const authMidleWare = require("../app/middlewares/authMidleWare");

router.get("/", serverController.getAll);
router.post("/", authMidleWare.verifyToken, serverController.create);
router.put("/", authMidleWare.verifyToken, serverController.update);
router.delete("/:id", authMidleWare.verifyToken, serverController.delete);

module.exports = router;
