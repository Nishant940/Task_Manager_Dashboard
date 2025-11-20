// server/src/routes/tasks.js
const express = require("express");
const router = express.Router();
const { body, validationResult, query } = require("express-validator");
const { createTask, getTasks, updateTask, deleteTask } = require("../controllers/taskController");

router.get(
  "/",
  [query("page").optional().isInt({ min: 1 }), query("filter").optional().isString()],
  async (req, res) => {
    try {
      const page = parseInt(req.query.page || "1", 10);
      const limit = 5;
      const offset = (page - 1) * limit;
      const filter = req.query.filter || "";
      const tasks = await getTasks({ filter, limit, offset });
      res.json({ tasks, page });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  }
);

router.post(
  "/",
  [body("title").notEmpty().isLength({ max: 100 }), body("description").notEmpty().isLength({ max: 500 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const task = await createTask(req.body);
      res.status(201).json(task);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create task" });
    }
  }
);

router.put(
  "/:id",
  [body("title").optional().isLength({ max: 100 }), body("description").optional().isLength({ max: 500 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const updated = await updateTask(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: "Task not found" });
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update task" });
    }
  }
);

router.delete("/:id", async (req, res) => {
  try {
    const ok = await deleteTask(req.params.id);
    if (!ok) return res.status(404).json({ error: "Task not found" });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

module.exports = router;
