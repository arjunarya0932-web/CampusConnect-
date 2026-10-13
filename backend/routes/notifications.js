const express = require("express");
const Notification = require("../models/Notification");

const router = express.Router();

// Get notifications for a user
router.get("/:user", async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.params.user,
    }).sort({ createdAt: -1 });

    res.json({
      notifications,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch notifications",
    });
  }
});

// Mark all notifications as read
router.put("/:user/read", async (req, res) => {
  try {
    await Notification.updateMany(
      {
        user: req.params.user,
        read: false,
      },
      {
        $set: { read: true },
      }
    );

    res.json({
      message: "Notifications marked as read",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update notifications",
    });
  }
});

module.exports = router;