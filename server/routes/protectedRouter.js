import express from "express";
import { checkAuth } from "../middleware/authMiddleware.js";
import db from "../config/db.js";

const router = express.Router();

// Apply checkAuth middleware to all routes in this file
// each roter here not allowed to be accessed without authentication. no need to do any thing. the middleware will do the job
router.use(checkAuth);

router.get("/userData", async (req, res) => {
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
    const studentId = req.user.id;
    const scheduleQuery = await db.query(
      `WITH latest_term AS (
        SELECT name, startDate, endDate
        FROM term
        ORDER BY startDate DESC
        LIMIT 1
      )
      SELECT schedule.id as scheduleId, schedule.termName, 
             latest_term.startDate, latest_term.endDate,
             COALESCE(json_agg(
               json_build_object(
                 'id', course.id,
                 'name', course.name,
                 'code', course.code,
                 'overview', course.overview,
                 'creditHours', course.credithours,
				         'grade',COALESCE(grade.value, 0),
				         'rate',COALESCE(rate.value, 0)
               )
             ) FILTER (WHERE course.id IS NOT NULL), '[]') as courses
      FROM schedule
      JOIN latest_term ON schedule.termName = latest_term.name
      LEFT JOIN schedule_course ON schedule.id = schedule_course.scheduleId
      LEFT JOIN course ON schedule_course.courseId = course.id
      LEFT JOIN grade on course.id= grade.courseid
      LEFT JOIN rate on course.id= rate.courseid
      WHERE schedule.studentId = $1
      GROUP BY schedule.id, schedule.termName, latest_term.startDate, latest_term.endDate;`,
      [studentId]
    );

    if (scheduleQuery.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No schedule associated with the current term was found",
      });
    }

    const schedule = scheduleQuery.rows[0];
    res.status(200).json({
      success: true,
      message: "Schedule retrieved successfully",
      scheduleId: schedule.scheduleid,
      scheduleName: schedule.termname,
      startDate: schedule.startdate,
      endDate: schedule.enddate,
      courses: schedule.courses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
/*
this router  will add a course to spsific schedule
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
      return res
        .status(404)
        .json({ success: false, message: "Schedule not found for the user" });
    }

    // Check if the course is already in the schedule
    // we can delete this
    const courseInSchedule = await db.query(
      `SELECT * FROM schedule_course WHERE scheduleId = $1 AND courseId = $2`,
      [scheduleId, courseId]
    );

    if (courseInSchedule.rows.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Course already in the schedule" });
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
      console.log(grade);
      if (grade !== 1) {
        // 1 means he did not pass the course, meaning he got an F grade
        return res
          .status(401)
          .json({
            success: false,
            message:
              "Course already registered in past terms with a grade value more than 1",
          });
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
*/

router.post("/createSchedule", async (req, res) => {
  try {
    const userId = req.user.id;

    // Get the latest term
    const latestTerm = await db.query(
      `SELECT name , startDate , endDate FROM term ORDER BY startDate DESC LIMIT 1`
    );

    if (latestTerm.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No terms found in the system",
      });
    }

    const termName = latestTerm.rows[0].name;

    // Check if user already has a schedule for this term
    const existingSchedule = await db.query(
      `SELECT id FROM schedule 
       WHERE studentId = $1 AND termName = $2`,
      [userId, termName]
    );

    if (existingSchedule.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Schedule already exists for the current term",
      });
    }

    // Create new schedule
    const newSchedule = await db.query(
      `INSERT INTO schedule (studentId, termName)
       VALUES ($1, $2)
       RETURNING id`,
      [userId, termName]
    );

    res.status(201).json({
      success: true,
      message: "Schedule created successfully",
      /*i comment this data because i do not want be to have to sourse to get the schedule at the frontend
      scheduleId: newSchedule.rows[0].id,
      scheduleName: termName,//term name
      endDate: latestTerm.rows[0].enddate, 
      startDate: latestTerm.rows[0].startdate,
      courses: [], //empty array no courses*/
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post("/addCourseToLastSchedule", async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    // Get the latest term
    const latestTerm = await db.query(
      `WITH latest_term AS (
        SELECT name FROM term ORDER BY startDate DESC LIMIT 1
      )
      SELECT s.id FROM schedule s
      JOIN term t ON s.termName = t.name
      WHERE s.studentId = $1 AND t.name = (SELECT name FROM latest_term)`,
      [userId]
    );

    if (latestTerm.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No schedule found for the user in the latest term",
      });
    }

    const scheduleId = latestTerm.rows[0].id;

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
      if (grade !== 1) {
        return res.status(409).json({
          success: false,
          message:
            "Course already registered in past terms with a grade value more than 1",
        });
      }
    }

    // Add the course to the schedule
    try {
      await db.query(
        `INSERT INTO schedule_course (scheduleId, courseId)
       VALUES ($1, $2)`,
        [scheduleId, courseId]
      );
    } catch (error) {
      if (error.constraint === "schedule_course_courseid_fkey") {
        // it happens when the courseId is not found in the database
        return res.status(404).json({
          success: false,
          message: "Invalid courseId: Course does not exist in the database",
        });
      }
      throw error; // If it's another error, throw it to be caught by the outher catch block
    }

    res.status(200).json({
      success: true,
      message: "Course added to the schedule for the latest term successfully",
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
      return res
        .status(404)
        .json({ success: false, message: "Schedule not found for the user" });
    }

    // Check if the course is in the schedule
    const courseInSchedule = await db.query(
      `SELECT * FROM schedule_course WHERE scheduleId = $1 AND courseId = $2`,
      [scheduleId, courseId]
    );

    if (courseInSchedule.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found in the schedule" });
    }
    //**********optional**********
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

router.post("/gradeCourse", async (req, res) => {
  const { courseId, gradeValue } = req.body;
  const studentId = req.user.id;

  const allowed = [5, 4.75, 4.5, 4, 3.5, 3, 2.5, 2, 1];
  if (!allowed.includes(gradeValue)) {
    return res.status(400).json({
      success: false,
      message:
        "The grade value must be one of these values [5, 4.75, 4.5, 4, 3.5, 3, 2.5, 2, 1]",
    });
  }
  try {
    // Check if the course exists in the one of the schedules
    const scheduleCheckQuery = `
      SELECT 1
      FROM public.schedule_course sc
      JOIN public.schedule s ON sc.scheduleid = s.id
      WHERE s.studentid = $1 AND sc.courseid = $2;
    `;

    const scheduleCheckResult = await db.query(scheduleCheckQuery, [
      studentId,
      courseId,
    ]);

    if (scheduleCheckResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Course not found in student's schedule.",
      });
    }

    try {
      // Create a new grade
      const createGradeQuery = `
    INSERT INTO grade (creatorid, courseid, value)
    VALUES ($1, $2, $3);
  `;

      await db.query(createGradeQuery, [studentId, courseId, gradeValue]);
      res.status(200).json({
        success: true,
        message: `The grade has been successfully created with the value ${gradeValue}`,
      });
    } catch (error) {
      console.log(error);
      if (error.constraint === "grade_pkey") {
        //that meen the grade already exist
        // the student already gradeed this,so we just need to update the value of the grade
        const updateGradeQuery = `
    UPDATE grade SET "value"=$1
	WHERE creatorid=$2 and courseid=$3;
  `;
        await db.query(updateGradeQuery, [gradeValue, studentId, courseId]);
        res.status(200).json({
          success: true,
          message: `The grade has been successfully updated with the value ${gradeValue}`,
        });
      }
    }
  } catch (error) {
    console.error("Error checking and creating grade:", error);
    res.status(500).json({ success: false, message: "An error occurred." });
  }
});
export default router;
