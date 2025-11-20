// server/src/middleware/auth.js
module.exports = function requireBasicAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Basic ")) {
    return res.status(401).json({ error: "Unauthorized access. Please provide valid credentials." });
  }
  const decoded = Buffer.from(header.replace("Basic ", ""), "base64").toString("utf8");
  const [username, password] = decoded.split(":");
  if (username !== "admin" || password !== "password123") {
    return res.status(401).json({ error: "Unauthorized access. Please provide valid credentials." });
  }
  next();
};
