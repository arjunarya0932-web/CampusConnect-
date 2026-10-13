const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["like", "comment"],
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },

    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);