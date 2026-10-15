const express = require("express");
const Post = require("../models/Post");
const Notification = require("../models/Notification");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });

    res.json({
      posts,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch posts",
    });
  }
});

// Create a post
router.post("/", authMiddleware, async (req, res) => {
  try {
    const author = req.user.name;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Post content is required",
      });
    }

    const post = await Post.create({
      author,
      content: content.trim(),
    });

    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// Like / Unlike a post
router.post("/:postId/like", authMiddleware, async (req, res) => {
  try {
    const user = req.user.name;

    if (!user) {
      return res.status(400).json({
        message: "User is required",
      });
    }

    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    post.likes = post.likes || [];

    if (post.likes.includes(user)) {
      post.likes = post.likes.filter(
        (likedUser) => likedUser !== user
      );
    } else {
      post.likes.push(user);
    }

    await post.save();
    if (post.author !== user && post.likes.includes(user)) {
  await Notification.create({
    user: post.author,
    type: "like",
    message: `${user} liked your post`,
    postId: post._id,
  });
}

    res.json({
      message: "Like updated successfully",
      likes: post.likes,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// Save / Unsave a post
router.post("/:postId/save", authMiddleware, async (req, res) => {
  try {
    const user = req.user.name;

    if (!user) {
      return res.status(400).json({
        message: "User is required",
      });
    }

    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    post.saves = post.saves || [];

    if (post.saves.includes(user)) {
      post.saves = post.saves.filter(
        (savedUser) => savedUser !== user
      );
    } else {
      post.saves.push(user);
    }

    await post.save();

    res.json({
      message: "Save updated successfully",
      saves: post.saves,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});
// Delete a post (only the author can delete)
router.delete("/:postId", authMiddleware, async (req, res) => {
  try {
    const user = req.user.name;

    if (!user) {
      return res.status(400).json({
        message: "User is required",
      });
    }

    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.author !== user) {
      return res.status(403).json({
        message: "You can only delete your own posts",
      });
    }

    await post.deleteOne();

    res.json({
      message: "Post deleted successfully",
      postId: req.params.postId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});
module.exports = router;