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

const userExists = async (req,res) =>{
  try {
    const {uid} = req.body;
    const user = await User.findOne({ uid: uid }).populate({
      path: 'companyIds',
      select: 'name'
    });
    if(!user){
      res.status(404).json({
        message:"User not Found"
      })
    }

    res.status(200).json(user);
    
  } catch (error) {
    res.status(500).json({message:"Internal Server Error"});
    
  }
}

module.exports = { login, userExists };