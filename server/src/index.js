// server/src/index.js
const express = require("express");
const cors = require("cors");
const requireBasicAuth = require("./middleware/auth");
const { init } = require("./db");

init(); // create tables if missing

const tasksRouter = require("./routes/tasks");
const logsRouter = require("./routes/logs");

const app = express();
app.use(cors());
app.use(express.json());

// protect /api routes
app.use("/api", requireBasicAuth);

app.use("/api/tasks", tasksRouter);
app.use("/api/logs", logsRouter);

app.get("/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
