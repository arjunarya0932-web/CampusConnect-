
require("dotenv").config();
const mongoose = require("mongoose");
const Post = require("../models/Post");

const demoPosts = [
  {
    author: "Alex Sharma",
    content:
      "Can anyone explain the difference between process and thread in OS?",
  },
  {
    author: "Riya Patel",
    content:
      "I uploaded Computer Networks Unit 3 notes. Hope they help!",
  },
  {
    author: "Karan Mehta",
    content:
      "Hackathon 2026 registration is open. Who's joining?",
  },
];

async function seedPosts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully!");

    for (const demoPost of demoPosts) {
      const existingPost = await Post.findOne({
        author: demoPost.author,
        content: demoPost.content,
      });

      if (!existingPost) {
        await Post.create(demoPost);
        console.log(`Added post by ${demoPost.author}`);
      } else {
        console.log(`Already exists: ${demoPost.author}`);
      }
    }

    console.log("Demo posts setup complete!");
  } catch (error) {
    console.error("Seeding failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedPosts();
