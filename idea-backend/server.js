const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.get("/", (req, res) => {
  res.send("Server is working!");
});

const authRoutes = require("./routes/auth"); 
const ideaRoutes = require("./routes/ideas"); 
app.use("/auth", authRoutes); 
app.use("/ideas", ideaRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
