const express = require("express");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is working!");
});

const authRoutes = require("./routes/auth"); // ← Import
const ideaRoutes = require("./routes/ideas"); // ← Fix variable name
app.use("/auth", authRoutes); // ← Mount auth
app.use("/ideas", ideaRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
