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
router.get("/hiddenComments", async (req, res) => {
  try {
    const userId = req.user?.id;
    const hiddenComments = await db.query(
      `SELECT 
  c.id,
  c.content,
  c.creationDate as "creationDate",
  c.tag,
  u.name AS author,
  u.id AS "authorId",
  COALESCE(l.num_likes, 0) AS "numOfLikes",
  COALESCE(r.reply_count, 0) AS "numOfReplies",
  CASE
  WHEN sl.creatorid = $1 THEN true 
          ELSE false 
        END AS "isLiked",
  hc.reason	as "hideReason",
  hc.date as "hideDate"
FROM comment c
JOIN "user" u ON c.authorId = u.id
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
) r ON c.id = r.parentCommentId
LEFT JOIN hideComment hc ON c.id = hc.commentId
LEFT JOIN "like" sl ON c.id = sl.commentid AND sl.creatorid = $1

WHERE  hc.id IS not NULL  -- to retreve all hidden comments
 -- AND c.parentCommentId IS NULL  -- Only top-level comments (no parent)
ORDER BY hc.date DESC;`,
      [userId]
    );

    if (hiddenComments.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No hidden comments or replies were found on this.",
      });
    }

    res.status(200).json({
      success: true,
      message: "hidden comments or replies retrieved successfully",
      hiddenComments: hiddenComments.rows,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/hideComment", async (req, res) => {
  try {
    const { reason, reportId, commentId } = req.body;
    const adminId = req.user.id;
    const adminName = req.user.name;
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
        `INSERT INTO hideComment (commentId, reason, reportId,creatorid) VALUES ($1, $2, $3,$4) RETURNING *`,
        [commentId, reason, reportId, adminId]
      );
    } else if (reason) {
      hideCommentResult = await db.query(
        `INSERT INTO hideComment (commentId, reason,creatorid) VALUES ($1, $2,$3) RETURNING *`,
        [commentId, reason, adminId]
      );
    }

    if (hideCommentResult.rows.length > 0) {
      res.status(200).json({
        success: true,
        message: "Comment hidden successfully.",
        //hiddenComment: hideCommentResult.rows[0],
        hiddenComment: {
          commentId: hideCommentResult.rows[0].commentid,
          adminExecutedHide: adminName,
        },
      });
    }
  } catch (error) {
    if (error.constraint === "hidecomment_commentid_fkey")
      return res.status(404).json({
        success: false,
        message: "Comment not found in the database.",
      });

    console.error("Error hiding comment:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/unHideComment", async (req, res) => {
  try {
    const { commentId } = req.body;
    const adminId = req.user.id;
    if (!commentId) {
      return res.status(400).json({
        success: false,
        message: "commentId is required.",
      });
    }

    // Check if the comment is currently hidden
    const existingComment = await db.query(
      `SELECT creatorId FROM hidecomment WHERE commentid = $1`,
      [commentId]
    );

    if (existingComment.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "comment is not currently hidden or does not exist in the database.",
      });
    }

    // These 6 lines can be removed if any admin should be allowed to unhide it.
    if (adminId !== existingComment.rows[0].creatorid) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to unhide this comment because you are not the admin who hid it.",
      });
    }
    // Remove the hideComment
    const result = await db.query(
      `DELETE FROM hideComment WHERE commentId = $1`,
      [commentId]
    );
    if (result.rowCount === 1) {
      res.status(200).json({
        success: true,
        message: "comment has been successfully unHidden.",
      });
    }
  } catch (error) {
    console.error("Error when unHiding a comment:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

//==================================================
//================= quiz =========================
//==================================================

router.put("/hideQuiz", async (req, res) => {
  try {
    const { reason, reportId, quizId } = req.body;
    const adminId = req.user.id;
    const adminName = req.user.name;
    if (!quizId) {
      return res.status(400).json({
        success: false,
        message: "Quiz ID is required.",
      });
    }

    // Check if the quiz is already hidden
    const existingHide = await db.query(
      `SELECT 1 FROM hideQuiz WHERE quizId = $1`,
      [quizId]
    );

    if (existingHide.rows.length > 0) {
      return res.status(409).json({
        success: true,
        message: "Quiz already hidden.",
      });
    }

    let hideQuizResult;
    if (reportId && reason) {
      hideQuizResult = await db.query(
        `INSERT INTO hideQuiz (quizId, reason, reportId ,creatorid) VALUES ($1, $2, $3) RETURNING *`,
        [quizId, reason, reportId, adminId]
      );
    } else if (reason) {
      hideQuizResult = await db.query(
        `INSERT INTO hideQuiz (quizId, reason ,creatorid) VALUES ($1, $2) RETURNING *`,
        [quizId, reason, adminId]
      );
    }

    if (hideQuizResult.rows.length > 0) {
      res.status(200).json({
        success: true,
        message: "Quiz hidden successfully.",
        hiddenQuiz: {
          quizId: hideQuizResult.rows[0].quizid,
          adminExecutedHide: adminName,
        },
      });
    }
  } catch (error) {
    if (error.constraint === "hidequiz_quizid_fkey") {
      return res.status(404).json({
        success: false,
        message: "Quiz not found in the database.",
      });
    }

    console.error("Error hiding quiz:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/unHideQuiz", async (req, res) => {
  try {
    const { quizId } = req.body;
    const adminId = req.user.id;
    if (!quizId) {
      return res.status(400).json({
        success: false,
        message: "quizId is required.",
      });
    }

    // Check if the quiz is currently hidden
    const existingQuiz = await db.query(
      `SELECT creatorid FROM hideQuiz WHERE quizId = $1`,
      [quizId]
    );

    if (existingQuiz.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "quiz is not currently hidden or does not exist in the database.",
      });
    }
    // These 6 lines can be removed if any admin should be allowed to unhide it.
    if (adminId !== existingQuiz.rows[0].creatorid) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to unhide this quiz because you are not the admin who hid it.",
      });
    }

    // Remove the hideQuiz
    const result = await db.query(`DELETE FROM hideQuiz WHERE quizId = $1`, [
      quizId,
    ]);
    if (result.rowCount === 1) {
      res.status(200).json({
        success: true,
        message: "quiz has been successfully unHidden.",
      });
    }
  } catch (error) {
    console.error("Error when unHiding a quiz:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

//==================================================
//================= report =========================
//==================================================

router.get("/reports/comments", async (req, res) => {
  try {
    const reports = await db.query(`SELECT
    r.id AS "reportId",
    r.authorid AS "authorId",
    r.content AS "content",
    r.creationdate AS "creationDate",
    CASE
        WHEN hc.commentId IS NOT NULL OR bu.studentid IS NOT NULL THEN TRUE
        ELSE FALSE
    END AS "isResolved",
    CASE
        WHEN hc.commentId IS NOT NULL THEN TRUE
        ELSE FALSE
    END AS "isCommentHidden",
    ha_user.name AS "adminExecutedHide",
    CASE
        WHEN bu.studentid IS NOT NULL THEN TRUE
        ELSE FALSE
    END AS "isCommentAuthorBanned",
    ba_user.name AS "adminExecutedBan",
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
LEFT JOIN hideComment hc ON c.id = hc.commentId
LEFT JOIN "user" ha_user ON hc.creatorid = ha_user.id
LEFT JOIN ban bu ON c.authorid = bu.studentid
LEFT JOIN "user" ba_user ON bu.creatorid = ba_user.id
ORDER BY r.creationdate DESC;`);

    res.status(200).json({
      success: true,
      reports: reports.rows,
    });
  } catch (error) {
    console.error("Error retrieving comment reports:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/deleteReport", async (req, res) => {
  try {
    const { reportId } = req.body;

    if (!reportId) {
      return res.status(400).json({
        success: false,
        message: "reportId is required.",
      });
    }

    // Check if the report exists
    const existingBan = await db.query(`SELECT 1 FROM report WHERE id = $1`, [
      reportId,
    ]);

    if (existingBan.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "report does not exist.",
      });
    }

    // Remove the report
    const result = await db.query(`DELETE FROM report WHERE id = $1`, [
      reportId,
    ]);
    if (result.rowCount === 1) {
      res.status(200).json({
        success: true,
        message: "report deleted successfully.",
      });
    }
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

//==================================================
//==================== ban =========================
//==================================================
router.get("/bannendAccounts", async (req, res) => {
  try {
    const bannendAccounts = await db.query(
      `SELECT json_build_object(
  'user', json_build_object(
    'id', u.id,
    'name', u.name,
    'email', u.email,
    'isAdmin', u.isadmin
  ),
  'ban', json_build_object(
    'id', b.id,
    'reason', b.reason,
    'date', b.date,
    'reportId', b.reportid
  )
) AS result
FROM ban b
LEFT JOIN "user" u ON b.studentid = u.id order by b.date;`
    );

    if (bannendAccounts.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No bannend accounts found." });
    }

    res.status(200).json({
      success: true,
      message: "bannend accounts retrieved successfully",
      bannendAccounts: bannendAccounts.rows,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/banUser", async (req, res) => {
  try {
    const { reason, studentId, reportId } = req.body;
const adminId = req.user.id;
const adminName = req.user.name;
    if (!studentId || !reason) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    // Check if the user is already banned
    const existingBan = await db.query(
      `SELECT 1 FROM ban WHERE studentId = $1`,
      [studentId]
    );

    if (existingBan.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "User is already banned.",
      });
    }

    let banUserResult;
    if (reportId) {
      banUserResult = await db.query(
        `INSERT INTO ban (studentId, reason,reportId ,creatorId) VALUES ($1, $2 ,$3,$4) RETURNING *`,
        [studentId, reason, reportId, adminId]
      );
    } else {
      banUserResult = await db.query(
        `INSERT INTO ban (studentId ,reason,creatorId) VALUES ($1, $2,$3) RETURNING *`,
        [studentId, reason, adminId]
      );
    }

    if (banUserResult.rows.length > 0) {
      res.status(200).json({
        success: true,
        message: "User banned successfully.",
        bannedUser: {
          studentId: banUserResult.rows[0].studentid,
          adminExecutedban: adminName,
        },
      });
    }
  } catch (error) {
    console.error("Error banning user:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/unBanUser", async (req, res) => {
  try {
    const { studentId } = req.body;
const adminId = req.user.id;
    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    // Check if the user is currently banned
    const existingBan = await db.query(
      `SELECT creatorid FROM ban WHERE studentId = $1`,
      [studentId]
    );

    if (existingBan.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "User is not currently banned or does not exist in the database.",
      });
    }
// These 6 lines can be removed if any admin should be allowed to unban the user it.
if (adminId !== existingBan.rows[0].creatorid) {
  return res.status(403).json({
    success: false,
    message:
      "You are not authorized to unBan this account because you are not the admin who ban it.",
  });
}

    // Remove the ban
    const result = await db.query(`DELETE FROM ban WHERE studentId = $1`, [
      studentId,
    ]);
    if (result.rowCount === 1) {
      res.status(200).json({
        success: true,
        message: "User has been successfully unBanned.",
      });
    }
  } catch (error) {
    console.error("Error unbanning user:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

//==================================================
//==================== term =========================
//==================================================

router.post("/AddTerm", async (req, res) => {
  const { name, startDate, endDate } = req.body;
  const creatorId = req.user?.id;
  // Validate required fields
  if (!name || !startDate || !endDate || !creatorId) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields." });
  }

  // Validate and parse dates
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);
  if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid date format." });
  }

  // Check if start date is before end date
  if (startDateObj >= endDateObj) {
    return res
      .status(400)
      .json({ success: false, message: "Start date must be before end date." });
  }

  try {
    const overlapQuery = `
      SELECT EXISTS (
        SELECT 1
        FROM public.term
        WHERE (startdate <= $1 AND enddate >= $2)
           OR (startdate <= $3 AND enddate >= $4)
           OR ($5 <= startdate AND $6 >= enddate)
           OR (startdate = $7 AND enddate = $8)
      );
    `;

    const overlapResult = await db.query(overlapQuery, [
      endDateObj,
      startDateObj,
      startDateObj,
      endDateObj,
      startDateObj,
      endDateObj,
      startDateObj,
      endDateObj,
    ]);

    const overlapExists = overlapResult.rows[0].exists;

    if (overlapExists) {
      return res.status(403).json({
        success: false,
        message: "Term dates overlap with existing terms.",
      });
    }

    const insertQuery = `
      INSERT INTO public.term (name, startdate, enddate, creatorid)
      VALUES ($1, $2, $3, $4);
    `;
    await db.query(insertQuery, [name, startDateObj, endDateObj, creatorId]);

    res
      .status(201)
      .json({ success: true, message: "Term created successfully." });
  } catch (error) {
    console.error("Database error:", error);
    if (error.constraint === "term_pkey")
      return res.status(409).json({
        success: false,
        message: `there are term with the same name: ${name}`,
      });

    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

router.delete("/deleteTerm", async (req, res) => {
  const { termName } = req.body;
  try {
    // Start a transaction
    await db.query("BEGIN");

    /* Delete courses grads that related to this term because the schedule will be automatically deleted after deleting the term(on delete casecade),
         so any grads associated with the schedule that will be deleted must be deleted.*/
    await db.query(
      `
            DELETE FROM grade g
            WHERE g.courseid IN (
                SELECT sc.courseid
                FROM schedule_course sc
                JOIN schedule s ON sc.scheduleid = s.id
                WHERE s.termname = $1
            )
        `,
      [termName]
    );

    /*  Delete courses rates that related to this term because the schedule will be automatically deleted after deleting the term(on delete casecade),
         so any rates associated with the schedule that will be deleted must be deleted.
        */
    await db.query(
      `
            DELETE FROM rate r
            WHERE r.courseid IN (
                SELECT sc.courseid
                FROM schedule_course sc
                JOIN schedule s ON sc.scheduleid = s.id
                WHERE s.termname = $1
            )
        `,
      [termName]
    );

    // Delete the term (will cascade delete schedules)
    const result = await db.query("DELETE FROM term WHERE name = $1", [
      termName,
    ]);

    // Commit the transaction
    await db.query("COMMIT");

    // Check if any rows were deleted
    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Term not found",
      });
    }

    res.status(200).json({
      message: "Term deleted successfully",
      deletedTerm: termName,
    });
  } catch (error) {
    // Rollback the transaction in case of error
    await db.query("ROLLBACK");
    console.error("Error deleting term:", error);
    res.status(500).json({
      message: "Error deleting term",
      error: error.message,
    });
  }
});
export default router;
