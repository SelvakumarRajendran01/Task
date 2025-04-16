const express = require("express");
const router = express.Router();
const taskController = require("../controllers/TaskController");
const multer = require("multer");

const storage = multer.memoryStorage(); // or diskStorage
const upload = multer({ storage });

router.get("/", taskController.getAllTasks);
router.put(
  "/:id",
  upload.fields([{ name: "attachment", maxCount: 1 }]),
  taskController.updateTask
);
router.get("/:id", taskController.getTaskById);
router.delete("/:id", taskController.deleteTask);
router.post(
  "/",
  upload.fields([{ name: "attachment", maxCount: 1 }]),
  taskController.createTask
);

module.exports = router;
