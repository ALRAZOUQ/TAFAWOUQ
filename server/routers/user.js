import express from "express";
const router = express.Router()
import db from "../config/db.js"

// GET all users
router.get('/users', async (req, res) => {
    try {
      const data = await db.query('SELECT * FROM "user"');
      res.json(data.rows); // Use .rows for PostgreSQL
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/user', async (req, res) => {
    try {
        console.log(req.body)
      const { name, email, password } = req.body;
      const query = 'INSERT INTO "user" (name, email, password, isadmin) VALUES ($1, $2, $3, $4) RETURNING *';
      const values = [name, email, password, false];
      const result = await db.query(query, values);
      
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
export default router