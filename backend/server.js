const express = require("express");
const cors = require("cors");

const app = express();

// ✅ FIXED CORS FOR NETLIFY
app.use(
  cors({
    origin: "*", // allow all origins (Netlify, local, etc.)
    methods: ["GET", "POST", "PUT"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

let tasks = [];
let idCounter = 1;

// Create task
app.post("/tasks", (req, res) => {
  const { title, description } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Title is required" });
  }

  const newTask = {
    id: idCounter++,
    title,
    description: description || "",
    status: "Todo",
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Get all tasks
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// Update task status
app.put("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  if (task.status === "Todo") {
    task.status = "In Progress";
  } else if (task.status === "In Progress") {
    task.status = "Done";
  }

  res.json(task);
});

// ✅ Render PORT fix
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
