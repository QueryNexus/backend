const User = require("../models/User");

const login = async (req, res) => {
    try {
        const {uid,email,name,photo} = req.body;
        const user = await User.findOne({ uid });
        if (!user) {
          const newUser = new User({
            uid,
            email,
            name,
            photo,
          });
          await newUser.save();
          res.status(201).json({ message: "User created" });
        }
        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        res.status(500).json({ message: "An error occurred" });
    }
}

module.exports = { login };