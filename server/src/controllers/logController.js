// server/src/controllers/logController.js
const { run, all } = require("../db");

function logAction({ action, taskId = null, updatedContent = null }) {
  const timestamp = new Date().toISOString();
  const json = updatedContent ? JSON.stringify(updatedContent) : null;
  // fire-and-forget is ok for logs
  return run(
    `INSERT INTO logs (timestamp, action, taskId, updatedContent) VALUES (?, ?, ?, ?)`,
    [timestamp, action, taskId, json]
  ).catch((err) => {
    console.error("Failed to write log:", err);
  });
}

function getLogs({ limit = 100, offset = 0 } = {}) {
  return all(
    `SELECT * FROM logs ORDER BY id DESC LIMIT ? OFFSET ?`,
    [limit, offset]
  ).then((rows) =>
    rows.map((row) => ({
      ...row,
      updatedContent: row.updatedContent ? JSON.parse(row.updatedContent) : null,
    }))
  );
}

module.exports = { logAction, getLogs };
