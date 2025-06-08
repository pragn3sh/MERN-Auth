const User = require("../models/user");
const { hashPassword, comparePassword } = require("../helpers/auth");

const test = (req, res) => {
  res.json("test is working");
};

//Register Endpoint
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //Check if Name was Entered
    if (!name) {
      return res.json({
        error: "Name is required",
      });
    }
    //Check Password is good or not
    if (!password || password.length < 6) {
      return res.json({
        error: "Password is required and should be at least 6 char long",
      });
    }
    //Check Email
    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({
        error: "Email is taken already",
      });
    }
    //Hashed
    const hashedPassword = await hashPassword(password);
    //Create User in DB
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    return res.json(user);
  } catch (error) {
    console.log(error);
  }
};

//Login EndPoint
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    //Check if User exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        error: "User Not Found",
      });
    }
    //Check the Password match
    const match = await comparePassword(password, user.password);
    if (match) {
      res.json("passwords match");
    }
    if(!match){
      return res.json({
        error: 'Password do not match'
      })
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  test,
  registerUser,
  loginUser,
};
