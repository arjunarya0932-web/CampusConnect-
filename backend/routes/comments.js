const express = require("express");
const Comment = require("../models/Comment");
const Notification = require("../models/Notification");
const Post = require("../models/Post");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Get comments for a post
router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({
      postId: req.params.postId,
    }).sort({ createdAt: 1 });

    res.json({
      comments,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch comments",
    });
  }
});

// Create a comment
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { postId, content } = req.body;
    const author = req.user.name;

    if (!postId || !content || !content.trim()) {
      return res.status(400).json({
        message: "Post and comment are required",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = await Comment.create({
      postId,
      author,
      content: content.trim(),
    });

    if (post && post.author !== author) {
      await Notification.create({
        user: post.author,
        type: "comment",
        message: `${author} commented on your post`,
        postId: post._id,
      });
    }

    res.status(201).json({
      message: "Comment created successfully",
      comment,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;