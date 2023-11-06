const express = require("express");
const { requireSignIn } = require("../controllers/userController.js");
const {
  createPostController,
  getAllPostsController,
  getUserPostsController,
  deletePostController,
  updatePostController,
} = require("../controllers/postController.js");

//router object
const router = express.Router();

// CREATE POST || POST
router.route("/create").post(requireSignIn, createPostController);
//GET ALL POSTs
router.route("/getAllPost").get(getAllPostsController);
//GET USER POSTs
router.route("/getUserPost").get(requireSignIn, getUserPostsController);

//DELEET POST=
router.route("/delete-post/:id").delete(requireSignIn, deletePostController);

//UPDATE POST
router.route("/update-post/:id").put(requireSignIn, updatePostController);

//export
module.exports = router;
