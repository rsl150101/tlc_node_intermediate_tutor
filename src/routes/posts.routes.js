const express = require("express");

const { Post, User } = require("../models");
const {
  postCreateValidation,
  postUpdateValidation,
} = require("../validations");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: {
        model: User,
        as: "user",
        attributes: ["nickname"],
      },
      attributes: { exclude: ["userId"] },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ massage: error.massage });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findByPk(id, {
      include: {
        model: User,
        as: "user",
        attributes: ["nickname"],
      },
      attributes: { exclude: ["userId"] },
    });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  const { currentUser } = res.locals;
  const userId = currentUser.id;

  try {
    const { title, content } = await postCreateValidation.validateAsync(
      req.body
    );

    const post = await Post.create({
      title,
      content,
      userId,
    });

    res.json(post);
  } catch (error) {
    if (error.isJoi) {
      return res.status(422).json({ message: error.details[0].message });
    }

    res.status(500).json({ message: error.message });
  }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const fieldsToBeUpdated = await postUpdateValidation.validateAsync(
      req.body
    );

    const updatedPost = await Post.update(fieldsToBeUpdated, {
      where: { id },
    });

    res.json(updatedPost);
  } catch (error) {
    if (error.isJoi) {
      return res.status(422).json({ message: error.details[0].message });
    }

    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.destroy({ where: { id } });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
