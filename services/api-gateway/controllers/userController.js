
const User = require("../models/user");

// CREATE a new user
const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required"
      });
    }

    const newUser = await User.create({ name, email });

    res.status(201).json({
      message: "User added",
      user: newUser
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email already exists"
      });
    }

    res.status(500).json({ message: error.message });
  }
};

// READ all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ one user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json(user);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid user ID"
      });
    }

    res.status(500).json({ message: error.message });
  }
};

// UPDATE a user by ID
const updateUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { returnDocument: "after", runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      message: "User updated",
      user
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email already exists"
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid user ID"
      });
    }

    res.status(500).json({ message: error.message });
  }
};

// DELETE a user by ID
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      message: "User deleted",
      user
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid user ID"
      });
    }

    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};



