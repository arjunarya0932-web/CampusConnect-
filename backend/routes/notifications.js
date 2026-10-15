
const express = require("express");
const Notification = require("../models/Notification");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Get notifications for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const username = req.user.name;

    const notifications = await Notification.find({
      user: username,
    }).sort({ createdAt: -1 });

    res.json({ notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch notifications",
    });
  }
});

// Mark notifications as read for the logged-in user
router.put("/read", authMiddleware, async (req, res) => {
  try {
    const username = req.user.name;

    await Notification.updateMany(
      { user: username, read: false },
      { $set: { read: true } }
    );

    res.json({
      message: "Notifications marked as read",    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update notifications",
    });
  }
});

module.exports = router;
