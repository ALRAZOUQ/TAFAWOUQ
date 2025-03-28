//// Razouq: this file isn't used??
// Razouq: faisel says this needed for who cann't acccess the DB 
import express from "express";
const router = express.Router()
import db from "../config/db.js"
import env from 'dotenv'
env.config()

// GET all users for test
router.get('/users', async (req, res) => {
  try {
    const data = await db.query('SELECT * FROM "user"');
    res.json(data.rows); // Use .rows for PostgreSQL
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
export default router