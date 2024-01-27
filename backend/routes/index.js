import userRouter from './user';
import accountRouter from './account'

const express = require("express");
const router = express.Router();


router.use('/user',userRouter)
router.use('/account',accountRouter)



module.exports = { router };
