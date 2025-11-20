// server/src/db.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "..", "db", "data.sqlite");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Failed to open DB:", err.message);
  } else {
    console.log("SQLite database opened:", dbPath);
  }
});

// Promise wrappers for sqlite3
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function init() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        createdAt TEXT NOT NULL
      )
    `);
    db.run(`
      CREATE TABLE IF NOT EXISTS logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        action TEXT NOT NULL,
        taskId INTEGER,
        updatedContent TEXT
      )
    `);
  });
}

module.exports = { db, run, get, all, init };
