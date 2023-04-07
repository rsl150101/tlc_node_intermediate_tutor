const express = require("express");

const router = express.Router();
const { signupValidation, loginValidation } = require("../validations");
const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { JWT_SECRET_KEY } = process.env;

router.post("/signup", async (req, res) => {
  try {
    const { nickname, password } = await signupValidation.validateAsync(
      req.body
    );

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      nickname,
      password: hashedPassword,
    });

    res.json(user);
  } catch (error) {
    if (error.isJoi) {
      return res.status(422).json({ message: error.details[0].message });
    }

    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { nickname, password } = await loginValidation.validateAsync(
      req.body
    );

    const user = await User.findOne({ where: { nickname } });
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!user || !isPasswordCorrect) {
      return res
        .status(400)
        .json({ message: "아이디 또는 비밀번호가 틀렸습니다." });
    }

    res.json({ token: jwt.sign({ nickname }, JWT_SECRET_KEY) });
  } catch (error) {
    if (error.isJoi) {
      return res.status(422).json({ message: error.details[0].message });
    }

    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
