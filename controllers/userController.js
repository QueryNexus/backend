const User = require("../models/User");

const userController = {
  saveUser: async (req, res) => {
    try {
      const { uid, email, name, photo } = req.body;

      const existingUser = await User.findOne({ uid });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const newUser = new User({
        uid,
        email,
        name,
        photo,
      });

      await newUser.save();
      res.status(201).json({
        message: "User created successfully",
        user: newUser,
      });
    } catch (error) {
      console.error("Error saving user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = userController;
