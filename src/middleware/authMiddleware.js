const jwt = require("jsonwebtoken");

const { User } = require("../models");

const { JWT_SECRET_KEY } = process.env;

const authMiddleware = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [tokenType, token] = authorization.split(" ");

  const isTokenValid = token && tokenType == "Bearer";

  if (!isTokenValid) {
    return res.status(401).json({ message: "로그인 후 이용 가능합니다" });
  }

  try {
    const { nickname } = jwt.verify(token, JWT_SECRET_KEY);
    const user = await User.findOne({ nickname });

    res.locals.currentUser = user;

    next();
  } catch (error) {
    res.status(401).json({ message: "로그인 후 이용 가능합니다." });
  }
};

module.exports = authMiddleware;
