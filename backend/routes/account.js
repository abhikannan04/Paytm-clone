import Account from "../db";
import authMiddleware from "../middleware";
import User from "../db";
import Account from "../db";

const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/balance", async function (req, res) {
  const account = await Account.findOne({ userId: req.userId });
  if (!account) {
    res.status(404).json({ Message: "No Account" });
  }
  res.json({ balance: account.balance });
});

// ------------------------------------------------------------------------------------------------

router.post("/", authMiddleware, async function (req, res) {
  const session = await mongoose.startSession();

  await session.startTransaction();
  const { amount, to } = req.body;

  const account = await Account.findOne({ userId: req.userId }).session(
    session
  );
  if (!account || account.balance < amount) {
    await session.abortTransaction();
    res
      .status(404)
      .json({ Message: "Insufficient Balance || Account Not Found" });
  }

  const toAccount = await User.findOne({ userId: to }).session(session);
  if (!toAccount) {
    await session.abortTransaction();
    res.status(404).json({ Message: "Inavalid Account" });
  }

  await Account.updateOne(
    { userId: req.userId },
    {
      $inc: {
        balance: -amount,
      },
    }
  ).session(session);
  await Account.updateOne(
    { userId: to },
    {
      $inc: {
        balance: amount,
      },
    }
  ).session(session);
  await session.commitTransaction();
  res.status(200).json({ Message: "Transaction Successful" });
});
module.exports = { router };
