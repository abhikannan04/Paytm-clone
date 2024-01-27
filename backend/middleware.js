const jwt = require("jsonwebtoken");
import { JWT_SECRET_KEY } from "./config";

export const authMiddleware = function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader.startsWith("Bearer ")) {
    res.status(411).json({ Message: "Invalid Token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const verifiedUser = jwt.verify(token, JWT_SECRET_KEY);
    if(verifiedUser){
        req.userId = verifiedUser.userId;
        next();
    }
  } catch (err) {
    res.status(401).json({ Message: "Invalid Token" });
  }
};
