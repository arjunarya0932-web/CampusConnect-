const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    likes: {
      type: [String],
      default: [],
    },
    saves: {
  type: [String],
  default: [],
},
  },
  
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);