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

router.get("/currentSchedule", async (req, res) => {
  try {
    
    //req.user.id
    const studentId = 2;
    const course = await db.query(`WITH latest_term AS (
    SELECT name
    FROM term
    ORDER BY startDate DESC
    LIMIT 1
)
SELECT course.*
FROM schedule
JOIN latest_term ON schedule.termName = latest_term.name
JOIN schedule_course ON schedule.id = schedule_course.scheduleId
JOIN course ON schedule_course.courseId = course.id
WHERE schedule.studentId = $1;`,[studentId]);
    if (course.rows.length === 0) {
      console.log(course.rows)
      return res.status(404).json({success: false, message: "No schedule associated with the current term was found" });
    }
    const camelCaseCourses = course.rows.map(course => (
      console.log(course),{
      id: course.id,
      name: course.name,
      code: course.code,
      overview: course.overview,
      creditHours: course.credithours
      
      
    }));
    res.status(200).json({
      success: true,
      message: "Courses retrieved successfully",
      courses: camelCaseCourses,
    });
  } catch (error) {
    res.status(500).json({success: false, message: error.message });
  }
});

export default router;