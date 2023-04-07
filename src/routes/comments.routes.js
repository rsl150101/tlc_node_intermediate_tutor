const express = require("express");
const { Comment, Post } = require("../models");
const {
  commentCreateValidation,
  commentUpdateValidation,
} = require("../validations");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const comments = await Comment.findAll();
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:postId", async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findByPk(postId);
    const postComments = await post.getComments();
    res.json(postComments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/:postId", async (req, res) => {
  const { postId } = req.params;
  try {
    const { content, userId } = await commentCreateValidation.validateAsync(
      req.body
    );

    const comment = await Comment.create({
      content,
      userId,
      postId,
    });

    res.json(comment);
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
    const fieldsToBeUpdate = await commentUpdateValidation.validateAsync(
      req.body
    );

    const updateComment = await Comment.update(fieldsToBeUpdate, {
      where: { id },
    });

    res.json(updateComment);
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
    const deletedComment = await Comment.destroy({ where: { id } });

    res.json(deletedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
