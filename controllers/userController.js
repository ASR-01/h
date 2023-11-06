const { comparePassword, hashPassword } = require ("../helpers/authHelper.js")
const User =require ("../modals/userModal.js")
const JWT = require('jsonwebtoken')
var { expressjwt: jwt } = require("express-jwt");

// Middleware
 const requireSignIn = jwt({
  secret:process.env.JWT_SECRET,
  algorithms: ["HS256"],
});


 const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name) {
      return res.status(400).send({
        success: false,
        message: "name is require",
      });
    }

    if (!email) {
      return res.status(400).send({
        success: false,
        message: "email is require",
      });
    }

    if (!password || password.length < 4) {
      return res.status(400).send({
        success: false,
        message: "password is require and 4 character long",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(500).send({
        success: false,
        message: "User is already registered pls login",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await new User({
      name,
      email,
      password: hashedPassword,
    }).save();
    res.status(201).send({
      success: false,
      message: "Registration Successfull pls login",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(200).send({
      status: false,
      message: "Register user failed",
    });
  }
};

 const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Email or password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "User not found",
      });
    }

    const hashedComparePassword = await comparePassword(
      password,
      user.password
    );

    if (!hashedComparePassword) {
      return res.status(400).send({
        success: false,
        message: "Invalid password or Username",
      });
    }

    // Token

    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    user.password = undefined;

    res.status(201).send({
      success: true,
      message: "Login Successfull",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(200).send({
      status: false,
      message: "Login user failed",
    });
  }
};

 const UpdateController = async (req, res) => {
  try {
    const { name, password, email } = req.body;
    const user = await User.findOne({ email });

    if (password && password.length < 4) {
      return res.status(400).send({
        success: false,
        message: "password is require and 4 character long",
      });
    }

    const hashedPassword = password ? await hashPassword(password) : undefined;

    // updated User
    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        name: name || user.name,
        password: hashedPassword || user.password,
      },
      { new: true }
    );
    updatedUser.password = undefined;
    res.status(201).send({
      success: false,
      message: "Profile Updated Successfull",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(200).send({
      status: false,
      message: "Error in Updating Api",
    });
  }
};


module.exports={registerController,loginController,UpdateController,requireSignIn}