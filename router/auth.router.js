const router = require("express").Router();
const {
  registerController,
  loginController,
} = require("../controller/auth.controller");

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout");
router.post("/refresh");

module.exports = router;
