const express = require("express");
const router = express.Router();

const {
  createUser,
  getUsers,
  getUserById,
  deleteUser,
  updateUser
} = require("../controllers/userController");

// const validateUser = require("../middlewares/validateUser");

router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);

module.exports = router;