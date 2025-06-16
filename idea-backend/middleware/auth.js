const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

function authenticate(req, res, next) {
  const header = req.headers.authorization;
  console.log("Authorization header:", header); // For debugging

  if (!header) return res.status(401).json({ error: "Token missing" });

  // Expect header formatted as 'Bearer <token>'
  const [scheme, token] = header.split(" ");
  if (!scheme || !token || scheme.toLowerCase() !== "bearer") {
    console.warn("Invalid Authorization header format.");
    return res.status(401).json({ error: "Invalid token format" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT verify error:", err);
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token expired. Please log in again." });
      }
      return res.status(401).json({ error: "Invalid token. Please log in." });
    }

    req.user = decoded; // e.g., { id, name, iat, exp }
    next();
  });
}

module.exports = authenticate;
