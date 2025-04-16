const Task = require("../models/Task");

// ✅ Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();

    const updatedTasks = tasks.map((task) => {
      if (task.attachment && task.attachment.buffer) {
        const base64 = task.attachment.buffer.toString("base64");
        const mimeType = task.attachment.mimetype;
        return {
          ...task.toObject(),
          previewUrl: `data:${mimeType};base64,${base64}`,
        };
      }
      return task.toObject();
    });

    res.status(200).json(updatedTasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

// ✅ Create a task
exports.createTask = async (req, res) => {
  const { title, description, status ,userName} = req.body;

  try {
    let attachment = null;

    // Check if 'attachment' exists in req.files
    if (req.files && req.files.attachment && req.files.attachment.length > 0) {
      const file = req.files.attachment[0];

      attachment = {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        buffer: file.buffer, // Save the file buffer
      };
    }

    const newTask = new Task({
      title,
      description,
      status,
      attachment,
      userName,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ message: "Failed to create task" });
  }
};

// ✅ Get a task by ID
exports.getTaskById = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    let taskWithPreview = task.toObject();

    if (task.attachment && task.attachment.buffer) {
      const base64 = task.attachment.buffer.toString("base64");
      const mimeType = task.attachment.mimetype;

      taskWithPreview.previewUrl = `data:${mimeType};base64,${base64}`;
    }

    res.status(200).json(taskWithPreview);
  } catch (err) {
    console.error("Error fetching task:", err);
    res.status(500).json({ message: "Failed to fetch task" });
  }
};

// ✅ Update a task
exports.updateTask = async (req, res) => {
  const { id } = req.params;

  try {
    const title = req.body.title;
    const description = req.body.description;
    const status = req.body.status;

    // Optional: Handle file update
    let attachment = null;
    if (req.files && req.files.attachment && req.files.attachment.length > 0) {
      const file = req.files.attachment[0];
      attachment = {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        buffer: file.buffer,
      };
    }

    const updatedFields = {
      title,
      description,
      status,
    };

    if (attachment) {
      updatedFields.attachment = attachment;
    }

    const task = await Task.findByIdAndUpdate(id, updatedFields, { new: true });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ message: "Failed to update task" });
  }
};



// ✅ Delete a task
exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ message: "Failed to delete task" });
  }
};
