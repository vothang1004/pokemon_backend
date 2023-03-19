const multer = require("multer");

const router = require("express").Router();
const accountController = require("../app/controllers/account.controller");
const authMiddleWare = require("../app/middlewares/authMidleWare");

// SET STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/public/uploads");
  },
  filename: function (req, file, cb) {
    const nameToSave = Date.now() + "-" + file.originalname;
    file.nameToSave = nameToSave;
    cb(null, nameToSave);
  },
});

const upload = multer({ storage: storage });

router.get("/", accountController.getAll);
router.post(
  "/",
  authMiddleWare.verifyToken,
  upload.array("images", Infinity),
  accountController.create
);
router.put(
  "/",
  authMiddleWare.verifyToken,
  upload.array("images", Infinity),
  accountController.update
);
router.get("/:id", accountController.getById);
router.delete("/:id", authMiddleWare.verifyToken, accountController.deleteById);

module.exports = router;
