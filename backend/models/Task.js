const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    userName: { type: String, required: true },
    // userName: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    attachment: {
      originalname: String,
      mimetype: String,
      size: Number,
      buffer: Buffer, // For storing file data directly (optional)
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    dueDate: Date,
  },

  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
