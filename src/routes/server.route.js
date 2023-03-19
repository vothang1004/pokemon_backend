const router = require("express").Router();
const serverController = require("../app/controllers/server.controller");

router.get("/", serverController.getAll);
router.post("/", serverController.create);
router.put("/", serverController.update);
router.delete("/:id", serverController.delete);

module.exports = router;
