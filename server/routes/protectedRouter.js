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




//==================================================
//================= schedule ========================
//==================================================

router.get("/currentSchedule", async (req, res) => {
  try {
    
    //const studentId = 2;
    const studentId = req.user.id;
    const course = await db.query(`WITH latest_term AS (
    SELECT name
    FROM term
    ORDER BY startDate DESC
    LIMIT 1
)
SELECT course.* , schedule.id as scheduleId
FROM schedule
JOIN latest_term ON schedule.termName = latest_term.name
JOIN schedule_course ON schedule.id = schedule_course.scheduleId
JOIN course ON schedule_course.courseId = course.id
WHERE schedule.studentId = $1;`,[studentId]);
    if (course.rows.length === 0) {
      //console.log(course.rows)
      return res.status(404).json({success: false, message: "No schedule associated with the current term was found" });
    }
    const camelCaseCourses = course.rows.map(course => (
      {
      id: course.id,
      name: course.name,
      code: course.code,
      overview: course.overview,
      creditHours: course.credithours
      
      
    }));
    res.status(200).json({
      success: true,
      message: "Courses retrieved successfully",
      scheduleId: course.rows[0].scheduleid,
      courses: camelCaseCourses,
    });
  } catch (error) {
    res.status(500).json({success: false, message: error.message });
  }
});



router.post("/addCourseToSchedule", async (req, res) => {
  try {
    const { scheduleId, courseId } = req.body;
    const userId = req.user.id;

    // Check if the user has the schedule
    const userSchedule = await db.query(
      `SELECT * FROM schedule WHERE id = $1 AND studentId = $2`,
      [scheduleId, userId]
    );

    if (userSchedule.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Schedule not found for the user" });
    }

// Check if the course is already in the schedule
// we can delete this
const courseInSchedule = await db.query(
  `SELECT * FROM schedule_course WHERE scheduleId = $1 AND courseId = $2`,
  [scheduleId, courseId]
);

if (courseInSchedule.rows.length > 0) {
  return res.status(400).json({ success: false, message: "Course already in the schedule" });
}
    // Check if the course is already registered in one of the student's schedules
    const existingCourse = await db.query(
      `SELECT sc.courseId, COALESCE(g.value, 0) AS grade
       FROM schedule_course sc
       JOIN schedule s ON sc.scheduleId = s.id
       LEFT JOIN grade g ON sc.courseId = g.courseId AND s.studentId = g.creatorId
       WHERE s.studentId = $1 AND sc.courseId = $2`,
      [userId, courseId]
    );

    if (existingCourse.rows.length > 0) {
      const grade = existingCourse.rows[0].grade;
      console.log(grade)
      if (grade !== 1) {// 1 means he did not pass the course, meaning he got an F grade
        return res.status(401).json({ success: false, message: "Course already registered in past terms with a grade value more than 1" });
      }
    }

    // Add the course to the schedule
    await db.query(
      `INSERT INTO schedule_course (scheduleId, courseId)
       VALUES ($1, $2)`,
      [scheduleId, courseId]
    );

    res.status(200).json({
      success: true,
      message: "Course added to schedule successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.delete("/deleteCourseFromSchedule", async (req, res) => {
  try {
    const { scheduleId, courseId } = req.body;
    const userId = req.user.id;

    // Check if the user has the schedule
    const userSchedule = await db.query(
      `SELECT * FROM schedule WHERE id = $1 AND studentId = $2`,
      [scheduleId, userId]
    );

    if (userSchedule.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Schedule not found for the user" });
    }

    // Check if the course is in the schedule
    const courseInSchedule = await db.query(
      `SELECT * FROM schedule_course WHERE scheduleId = $1 AND courseId = $2`,
      [scheduleId, courseId]
    );

    if (courseInSchedule.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Course not found in the schedule" });
    }
//**********opthonal**********
/*
    // Get the current term's end date
    const currentTerm = await db.query(
      `SELECT endDate FROM term
       WHERE name = (SELECT termName FROM schedule WHERE id = $1)`,
      [scheduleId]
    );

    if (currentTerm.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Current term not found" });
    }

    const endDate = new Date(currentTerm.rows[0].enddate);
    const currentDate = new Date();

    // Check if the current date is before the end date
    if (currentDate > endDate) {
      return res.status(400).json({ success: false, message: "Cannot delete course after the term end date" });
    }
*/

//******************************* 
    // Delete the course from the schedule
    await db.query(
      `DELETE FROM schedule_course WHERE scheduleId = $1 AND courseId = $2`,
      [scheduleId, courseId]
    );

    res.status(200).json({
      success: true,
      message: "Course deleted from schedule successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;