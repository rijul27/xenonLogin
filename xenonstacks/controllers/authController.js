import userModel from "../models/users.js";
import { hashPassword, comparePassword } from "../helpers/authHelpers.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { email, password, cnfPassword } = req.body;
    
    if (!email) return res.send({ error: "Email is required" });
    if (!password) return res.send({ error: "Password is required" });
    if (!cnfPassword) return res.send({ error: "confirm Password is required" });

    
    // if (!answer) return res.send({ error: "Answer is required" });

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already registered",
      });
    }

    if(password!==cnfPassword)return res.status(400).send({
      success: false,
      message: "password and confirm password should be same ",
    });

    const hashedPassword = await hashPassword(password);

    const user = await new userModel({
      email,
      password: hashedPassword,
      cnfPassword: hashedPassword,
    }).save();

    res.status(201).send({
      success: true,
      message: "User register successfully",
      user,
    });

  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error in registeration ",
      err,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user)
      return res.status(404).send({
        success: false,
        message: "User doesn't exists",
      });

    const matchpwd = comparePassword(password, user.password);
    if (!matchpwd)
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });

    const token = await JWT.sign(
      { _id: user._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).send({
      success: true,
      message: "Successfully Logined",
      user: {

        _id: user._id,
        email: user.email,

      },
      token,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error in Login",
      success: false,
      error,
    });
  }
};
