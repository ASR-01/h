const express = require("express");
const {
  registerController,
  loginController,
  UpdateController,
  requireSignIn,
} = require("../controllers/userController.js");
const router = express.Router();

router.route('/register').post(registerController)
router.route('/login').post(loginController)
router.route('/update').put(requireSignIn,UpdateController)
module.exports = router;