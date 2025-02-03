import express from 'express';
import { checkAuth } from '../middleware/authMiddleware.js';
import db from '../config/db.js';

const router = express.Router();

// Apply checkAuth middleware to all routes in this file
// each roter here not allowed to be accessed without authentication. no need to do any thing. the middleware will do the job
router.use(checkAuth);

router.get('/userData', async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT id, name,email, isadmin FROM "user" WHERE id = $1',
      [req.user.id]
    );
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
export default router;