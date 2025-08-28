import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";

export const signUp = async (req, res,next) => {
  //logic for user sign up
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { name , email, password } = req.body;

    const existingUser = await  User.findOne({ email }).session(session);
    if (existingUser) {
      const error = new Error('Email already in use');
      error.statusCode = 409;
      throw error;
    }
    // Hash the password before saving

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create([{ name, email, password: hashedPassword }], { session });

    const token = jwt.sign({ userId: newUser[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

   await session.commitTransaction();
   session.endSession();

    res.status(201).json({ 
      success: true,
      data: {
        user: {
          id: newUser[0]._id,
          name: newUser[0].name,
          email: newUser[0].email,
        },
        token
      }
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
}

export const signIn = async (req, res,next) => {
  //logic for user sign in

}

export const signOut = async (req, res,next) => { 
    //logic for user sign out
 }