// server/src/controllers/taskController.js
const { run, get, all } = require("../db");
const { logAction } = require("./logController");
const sanitizeHtml = require("sanitize-html");

function sanitize(str) {
  return sanitizeHtml(String(str || ""), { allowedTags: [], allowedAttributes: {} }).trim();
}

async function createTask({ title, description }) {
  title = sanitize(title);
  description = sanitize(description);
  const createdAt = new Date().toISOString();

  const info = await run(
    `INSERT INTO tasks (title, description, createdAt) VALUES (?, ?, ?)`,
    [title, description, createdAt]
  );

  const task = await get(`SELECT * FROM tasks WHERE id = ?`, [info.lastID]);
  await logAction({ action: "Create Task", taskId: task.id, updatedContent: task });
  return task;
}

async function getTasks({ filter = "", limit = 5, offset = 0 } = {}) {
  const like = `%${filter}%`;
  const rows = await all(
    `SELECT * FROM tasks WHERE title LIKE ? OR description LIKE ? ORDER BY id DESC LIMIT ? OFFSET ?`,
    [like, like, limit, offset]
  );
  return rows;
}

async function updateTask(id, { title, description }) {
  const existing = await get(`SELECT * FROM tasks WHERE id = ?`, [id]);
  if (!existing) return null;

  const newTitle = title !== undefined ? sanitize(title) : existing.title;
  const newDescription = description !== undefined ? sanitize(description) : existing.description;

  const changes = {};
  if (existing.title !== newTitle) changes.title = newTitle;
  if (existing.description !== newDescription) changes.description = newDescription;

  await run(`UPDATE tasks SET title = ?, description = ? WHERE id = ?`, [newTitle, newDescription, id]);

  const updated = await get(`SELECT * FROM tasks WHERE id = ?`, [id]);
  await logAction({ action: "Update Task", taskId: id, updatedContent: changes });
  return updated;
}

async function deleteTask(id) {
  const existing = await get(`SELECT * FROM tasks WHERE id = ?`, [id]);
  if (!existing) return false;
  await run(`DELETE FROM tasks WHERE id = ?`, [id]);
  await logAction({ action: "Delete Task", taskId: id, updatedContent: null });
  return true;
}

module.exports = { sanitize, createTask, getTasks, updateTask, deleteTask };
