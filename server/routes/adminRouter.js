import express from 'express';
import { checkAuth, checkAdmin } from '../middleware/authMiddleware.js';
import db from '../config/db.js';

const router = express.Router();

// Apply both middlewares to all admin routes like hide cooment or hide quiz
router.use(checkAuth, checkAdmin);


//this just for testing
router.get('/users', async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT id, email, isadmin FROM "user"'
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;