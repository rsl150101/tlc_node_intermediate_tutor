const express = require("express");

const router = express.Router();
const { signupValidation } = require("../validations");
const { User } = require("../models");
const bcrypt = require("bcrypt");

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

module.exports = router;
