// routes/ideas.js
const express = require("express");
const db = require("../db");
const authenticate = require("../middleware/auth");

const route = express.Router();

// GET all ideas (everyone's)
route.get("/all", authenticate, (req, res) => {
  try {
    db.query(
      `SELECT i.*, u.name AS author, 
              CASE WHEN i.user_id = ? THEN TRUE ELSE FALSE END as isOwner
       FROM idea_db i
       JOIN users u ON i.user_id = u.id
       ORDER BY i.created_at DESC`,
      [req.user.id],
      (err, rows) => {
        if (err) {
          console.error("DB SELECT error:", err);
          return res.status(500).json({ error: "Server error fetching ideas" });
        }
        res.json(rows || []);
      }
    );
  } catch (error) {
    console.error("Route error:", error);
    res.status(500).json({ error: "Server error processing request" });
  }
});

// Get all ideas for logged-in user
route.get("/", authenticate, (req, res) => {
  console.log(` GET /ideas (user_id=${req.user.id})`);
  db.query(
    "SELECT idea_db.*, users.name as author FROM idea_db JOIN users ON idea_db.user_id = users.id WHERE idea_db.user_id = ? ORDER BY created_at DESC",
    [req.user.id],
    (err, rows) => {
      if (err) {
        console.error("DB SELECT error:", err);
        return res.status(500).json({ error: "Server error fetching ideas" });
      }
      res.json(rows);
    }
  );
});

// Get single idea by ID (Must be after other GET routes to avoid path conflicts)
route.get("/:id", authenticate, (req, res) => {
  const ideaId = req.params.id;
  console.log(` GET /ideas/${ideaId}`);

  db.query(
    `SELECT i.*, u.name AS author, 
            CASE WHEN i.user_id = ? THEN TRUE ELSE FALSE END as isOwner
     FROM idea_db i
     JOIN users u ON i.user_id = u.id
     WHERE i.id = ?`,
    [req.user.id, ideaId],
    (err, rows) => {
      if (err) {
        console.error("DB SELECT error:", err);
        return res.status(500).json({ error: "Server error fetching idea" });
      }
      if (!rows || rows.length === 0) {
        return res.status(404).json({ error: "Idea not found" });
      }
      res.json(rows[0]);
    }
  );
});

// Create new idea
route.post("/", authenticate, (req, res) => {
  const { title, description, status } = req.body;
  if (!title?.trim())
    return res.status(400).json({ error: "Title is required." });

  const user_id = req.user.id;
  console.log(`📥 POST /ideas (user_id=${user_id}):`, req.body);

  db.query(
    "INSERT INTO idea_db (title, description, status, user_id) VALUES (?, ?, ?, ?)",
    [title.trim(), description || "", status || "pending", user_id],
    (err, result) => {
      if (err) {
        console.error("DB INSERT error:", err);
        return res.status(500).json({ error: "Server error creating idea" });
      }
      const newIdea = {
        id: result.insertId,
        title,
        description,
        status,
        user_id,
      };
      res.status(201).json(newIdea);
    }
  );
});

// Update idea
route.put("/:id", authenticate, (req, res) => {
  const ideaId = req.params.id;
  const { title, description, status } = req.body;

  if (!title?.trim()) {
    return res.status(400).json({ error: "Title is required." });
  }

  console.log(`📥 PUT /ideas/${ideaId}:`, req.body);

  // First verify the idea belongs to the user
  db.query(
    "SELECT user_id FROM idea_db WHERE id = ?",
    [ideaId],
    (err, rows) => {
      if (err) {
        console.error("DB SELECT error:", err);
        return res.status(500).json({ error: "Server error updating idea" });
      }

      if (!rows || rows.length === 0) {
        return res.status(404).json({ error: "Idea not found" });
      }

      if (rows[0].user_id !== req.user.id) {
        return res
          .status(403)
          .json({ error: "Not authorized to update this idea" });
      }

      // If authorized, proceed with update
      db.query(
        "UPDATE idea_db SET title = ?, description = ?, status = ? WHERE id = ?",
        [title.trim(), description || "", status || "pending", ideaId],
        (updateErr) => {
          if (updateErr) {
            console.error("DB UPDATE error:", updateErr);
            return res
              .status(500)
              .json({ error: "Server error updating idea" });
          }

          res.json({
            id: ideaId,
            title: title.trim(),
            description: description || "",
            status: status || "pending",
            user_id: req.user.id,
          });
        }
      );
    }
  );
});

// Delete idea
route.delete("/:id", authenticate, (req, res) => {
  const ideaId = req.params.id;
  console.log(`📥 DELETE /ideas/${ideaId}`);

  // First verify the idea belongs to the user
  db.query(
    "SELECT user_id FROM idea_db WHERE id = ?",
    [ideaId],
    (err, rows) => {
      if (err) {
        console.error("DB SELECT error:", err);
        return res.status(500).json({ error: "Server error deleting idea" });
      }

      if (!rows || rows.length === 0) {
        return res.status(404).json({ error: "Idea not found" });
      }

      if (rows[0].user_id !== req.user.id) {
        return res
          .status(403)
          .json({ error: "Not authorized to delete this idea" });
      }

      // If authorized, proceed with delete
      db.query("DELETE FROM idea_db WHERE id = ?", [ideaId], (deleteErr) => {
        if (deleteErr) {
          console.error("DB DELETE error:", deleteErr);
          return res.status(500).json({ error: "Server error deleting idea" });
        }
        res.status(204).send();
      });
    }
  );
});

module.exports = route;
