// server/src/routes/logs.js
const express = require("express");
const router = express.Router();
const { getLogs } = require("../controllers/logController");

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "100", 10);
    const offset = (page - 1) * limit;
    const logs = await getLogs({ limit, offset });
    res.json({ logs, page });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

module.exports = router;
