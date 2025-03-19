import express from "express";
import { checkAuth, checkAdmin } from "../middleware/authMiddleware.js";
import db from "../config/db.js";

const router = express.Router();

// Apply both middlewares to all admin routes like hide cooment or hide quiz
router.use(checkAuth, checkAdmin);

//this just for testing
router.get("/users", async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id, email, isadmin FROM "user"');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//==================================================
//================= course =========================
//==================================================

router.post("/addCourse", async (req, res) => {
  try {
    const { name, code, overview, creditHours } = req.body;
    const creatorId = req.user.id;
    const lowerCode = code.toLowerCase();
    // Check if the course already exists
    const existingCourse = await db.query(
      `SELECT * FROM course WHERE code = $1`,
      [lowerCode]
    );

    if (existingCourse.rows.length > 0) {
      return res
        .status(401)
        .json({ success: false, message: "Course already exists" });
    }

    // Insert new course
    const newCourse = await db.query(
      `INSERT INTO course (name, code, overview, creditHours, creatorId)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      [name, code, overview, creditHours, creatorId]
    );

    if (newCourse.rows.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to add course" });
    }

    res.status(201).json({
      success: true,
      message: "Course added successfully",
      course: {
        id: newCourse.rows[0].id,
        name: newCourse.rows[0].name,
        code: newCourse.rows[0].code,
        overview: newCourse.rows[0].overview,
        creditHours: newCourse.rows[0].credithours,
        creatorId: newCourse.rows[0].creatorid,
        //becuse it is not in the database before this time
        avgRating: 0,
        avgGrade: 0,
        numOfRaters: 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/updateCourse", async (req, res) => {
  try {
    const { courseId, name, code, overview, creditHours } = req.body;

    // Check if the course exists
    const existingCourse = await db.query(
      `SELECT * FROM course WHERE id = $1`,
      [courseId]
    );

    if (existingCourse.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // Update the course details
    const updatedCourse = await db.query(
      `UPDATE course
       SET name = $1, code = $2, overview = $3, creditHours = $4
       WHERE id = $5
       RETURNING *;`,
      [name, code, overview, creditHours, courseId]
    );

    if (updatedCourse.rows.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to update course" });
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/deleteCourse/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check if the course exists
    const existingCourse = await db.query(
      `SELECT id FROM course WHERE id = $1`,
      [courseId]
    );

    if (existingCourse.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // Delete the course
    await db.query(`DELETE FROM course WHERE id = $1`, [courseId]);

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/addCourseToSchedule", async (req, res) => {
  try {
    console.log("Received request to add course to schedule");
    const { scheduleId, courseId } = req.body;
    const userId = req.user.id;

    console.log(
      `scheduleId: ${scheduleId}, courseId: ${courseId}, userId: ${userId}`
    );

    // Check if the user has the schedule
    const userSchedule = await db.query(
      `SELECT * FROM schedule WHERE id = $1 AND studentId = $2`,
      [scheduleId, userId]
    );

    if (userSchedule.rows.length === 0) {
      console.log("Schedule not found for the user");
      return res
        .status(404)
        .json({ success: false, message: "Schedule not found for the user" });
    }

    // Check if the course is already registered in one of the student's schedules
    const existingCourse = await db.query(
      `SELECT sc.courseId, g.value AS grade
       FROM schedule_course sc
       JOIN schedule s ON sc.scheduleId = s.id
       JOIN grade g ON sc.courseId = g.courseId AND s.studentId = g.creatorId
       WHERE s.studentId = $1 AND sc.courseId = $2`,
      [userId, courseId]
    );

    console.log(existingCourse.rows || "nothing");

    if (existingCourse.rows.length > 0) {
      const grade = existingCourse.rows[0].grade;
      console.log(`Existing course grade: ${grade}`);
      if (grade !== 1) {
        //  1 = (F)
        return res.status(400).json({
          success: false,
          message: "Course already registered with a grade more than 1",
        });
      }
    }

    // Add the course to the schedule
    await db.query(
      `INSERT INTO schedule_course (scheduleId, courseId)
       VALUES ($1, $2)`,
      [scheduleId, courseId]
    );

    console.log("Course added to schedule successfully");

    res.status(200).json({
      success: true,
      message: "Course added to schedule successfully",
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});
//==================================================
//================= comment =========================
//==================================================
router.put("/hideComment", async (req, res) => {
  try {
    const { reason, reportId, commentId } = req.body;

    if (!commentId) {
      return res.status(400).json({
        success: false,
        message: "Comment ID is required.",
      });
    }

    // Check if the comment is already hidden
    const existingHide = await db.query(
      `SELECT 1 FROM hideComment WHERE commentId = $1`,
      [commentId]
    );

    if (existingHide.rows.length > 0) {
      return res.status(409).json({
        success: true,
        message: "Comment already hidden.",
      });
    }

    let hideCommentResult;
    if (reportId && reason) {
      hideCommentResult = await db.query(
        `INSERT INTO hideComment (commentId, reason, reportId) VALUES ($1, $2, $3) RETURNING *`,
        [commentId, reason, reportId]
      );
    } else if (reason) {
      hideCommentResult = await db.query(
        `INSERT INTO hideComment (commentId, reason) VALUES ($1, $2) RETURNING *`,
        [commentId, reason]
      );
    } 

    if (hideCommentResult.rows.length > 0) {
      res.status(200).json({
        success: true,
        message: "Comment hidden successfully.",
        //hiddenComment: hideCommentResult.rows[0],
        hiddenCommentId: hideCommentResult.rows[0].commentid,
      });
    }
  } catch (error) {
    if(error.constraint  === "hidecomment_commentid_fkey")
      return res.status(404).json({
        success: false,
        message: "Comment not found in the database.",
      })

    console.error("Error hiding comment:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

//==================================================
//================= report =========================
//==================================================

router.get("/reports/comments", async (req, res) => {
  try {
    const reports = await db.query(`
      SELECT
    r.id AS "reportId",
    r.authorid AS "authorId",
    r.content AS "content",
    r.creationdate AS "creationDate",
    json_build_object(
        'id', c.id,
        'content', c.content,
        'authorId', c.authorid,
        'authorName', u.name,
        'tag', c.tag,
        'creationDate', c.creationdate,
        'numOfLikes', COALESCE(l.num_likes, 0),
        'numOfReplies', COALESCE(rep.reply_count, 0)
    ) AS comment
FROM report r
JOIN report_comment rc ON r.id = rc.reportid
JOIN comment c ON rc.commentid = c.id
JOIN "user" u ON c.authorid = u.id
LEFT JOIN (
    SELECT commentId, COUNT(*) AS num_likes
    FROM "like"
    GROUP BY commentId
) l ON c.id = l.commentId
LEFT JOIN (
    SELECT parentCommentId, COUNT(*) AS reply_count
    FROM comment
    WHERE parentCommentId IS NOT NULL
    GROUP BY parentCommentId
) rep ON c.id = rep.parentCommentId
ORDER BY r.creationdate DESC;
    `);

    res.status(200).json({
      success: true,
      reports: reports.rows,
    });
  } catch (error) {
    console.error("Error retrieving comment reports:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
