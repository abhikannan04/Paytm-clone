const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const router = express.Router();

import { User } from "../db.js";
import { Account } from "../db.js";
import { JWT_SECRET_KEY } from "../config";
import { authMiddleware } from "../middleware.js";

// --------------------------------------------------------------------
const SignupSchema = zod.object({
  username: zod.string().email(),
  firstname: zod.string(),
  lastname: zod.string(),
  password: zod.string().minLength(10),
});
router.post("/signup", async (req, res) => {
  const error = SignupSchema.safeParse(req.body);
  if (error) {
    return res.status(400).json({ Message: "Plz Put Valid Input" });
  }
  const existingUser = await User.findOne({ username: req.body.username });
  if (existingUser) {
    return res.status(200).json({
      Message: "User Already Exists",
    });
  }

  const user = await User.create({
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: req.body.password,
  });

  const userId = user._id;

  await Account.create({
    userId: userId,
    balance: 1 + Math.random() * 10000,
  });

  const token = jwt.sign({ userId: userId }, JWT_SECRET_KEY);

  return res.status(200).json({
    Message: "User Created",
    token: token,
  });
});

//-------------------------------------------------------------------
const SignInSchema = zod.object({
  username: zod.string().email(),
  password: zod.string().minLength(10),
});
router.post("/signin", authMiddleware, async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const error = SignInSchema.safeParse(req.body);
  if (error) {
    return res.status(400).json({ Message: "Plz Put Valid Input" });
  }

  const userInDb = await User.findOne({
    username: username,
    password: password,
  });
  if (!userInDb) {
    return res.status(400).json({
      message: "User Not Found|| Error While Logging",
    });
  }
  const token = jwt.sign({ userId: userInDb._id }, JWT_SECRET_KEY);
  return res.status(200).json({
    message: "User Signed Up",
    token: token,
  });
});

// --------------------------------------------------------------------
const updateUserSchema = zod.object({
  password: zod.string().minLength(10).optional(),
  firstname: zod.string().optional(),
  lastname: zod.string().optional(),
});
router.put("/user", authMiddleware, async (req, res) => {
  const { success } = updateUserSchema.safeParse(req.body);
  if (!success) {
    return res
      .status(404)
      .json({ Message: "Error while Updating Information" });
  }
  await User.updateOne(req.body, { _id: req.userId });
  return res.status(200).json({ Message: "User Updated Successfully" });
});

// ---------------------------------------------------------------------
router.get("/bulk", async (req, res) => {
  const filter = req.query.filter;
  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });

  res.json({
    user: users.map((user) => ({
      username: user.username,
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
    })),
  });
});

module.exports = { router };
