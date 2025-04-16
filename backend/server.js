const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());

const PORT = 3001;

//  MongoDB connect
const MONGO_URI="mongodb://127.0.0.1:27017/tasksphere"
mongoose
  .connect(process.env.MONGO_URI||MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(" MongoDB connected"))
  .catch((err) => console.error(" MongoDB connection error:", err));

//  Routes
const taskRoutes = require("./routes/TaskRoutes");
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Start the server

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
