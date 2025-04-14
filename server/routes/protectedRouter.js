import express from "express";
import { checkAuth } from "../middleware/authMiddleware.js";
import db from "../config/db.js";
import firebaseAdmin from "../config/firebase.js";
import env from "dotenv";
env.config();
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
      LEFT JOIN grade ON (course.id = grade.courseid AND grade.creatorid = schedule.studentId)
      LEFT JOIN rate ON (course.id = rate.courseid AND rate.creatorid = schedule.studentId)
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
router.get("/AllSchedules", async (req, res) => {
  const studentId = req.user.id; // Assuming you have authentication middleware

  try {
    const result = await db.query(
      `
          SELECT 
              schedule.id AS scheduleId, 
              schedule.termName, 
              term.startDate, 
              term.endDate,
              COALESCE(
                  ROUND(
                      (SUM(COALESCE(grade.value, 0) * course.credithours) / NULLIF(SUM(course.credithours), 0))::numeric, 2),0.00::numeric) AS gpa,
              COALESCE(json_agg(
                  json_build_object(
                      'id', course.id,
                      'name', course.name,
                      'code', course.code,
                      'overview', course.overview,
                      'creditHours', course.credithours,
                      'grade', COALESCE(grade.value, 0),
                      'rate', COALESCE(rate.value, 0)
                  )
              ) FILTER (WHERE course.id IS NOT NULL), '[]') AS courses
          FROM schedule
          JOIN term ON schedule.termName = term.name
          LEFT JOIN schedule_course ON (schedule.id = schedule_course.scheduleId)
          LEFT JOIN course ON schedule_course.courseId = course.id
          LEFT JOIN grade ON (course.id = grade.courseid AND grade.creatorid = schedule.studentId)
          LEFT JOIN rate ON (course.id = rate.courseid AND rate.creatorid = schedule.studentId)
          WHERE schedule.studentId = $1
          GROUP BY schedule.id, schedule.termName, term.startDate, term.endDate
          ORDER BY term.startDate DESC
      `,
      [studentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No schedules found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Schedules retrieved successfully",
      schedules: result.rows,
    });
  } catch (error) {
    console.error("Error fetching student schedules:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching student schedules",
    });
  }
});

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

    // Delete rate
    await db.query(`DELETE FROM rate WHERE creatorId = $1 AND courseId = $2`, [
      userId,
      courseId,
    ]);

    // Delete grade
    await db.query(`DELETE FROM grade WHERE creatorId = $1 AND courseId = $2`, [
      userId,
      courseId,
    ]);

    res.status(200).json({
      success: true,
      message: "Course deleted from schedule successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

//==================================================
//=================== grade ========================
//==================================================

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

//==================================================
//=================== rate =========================
//==================================================

router.post("/rateCourse", async (req, res) => {
  const { courseId, rateValue } = req.body;
  const studentId = req.user.id;

  if (rateValue < 1 || rateValue > 5 || isNaN(rateValue)) {
    return res.status(400).json({
      success: false,
      message: "The rate value must be a number btween 1 and 5",
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
      // Create a new rate
      const createRateQuery = `
    INSERT INTO rate (creatorid, courseid, value)
    VALUES ($1, $2, $3);
  `;

      await db.query(createRateQuery, [studentId, courseId, rateValue]);
      res.status(200).json({
        success: true,
        message: `The rate has been successfully created with the value ${rateValue}`,
      });
    } catch (error) {
      console.log(error);
      if (error.constraint === "rate_pkey") {
        //that meen the rate already exist
        // the student already rated this,so we just need to update the value of the rate
        const updateRateQuery = `
    UPDATE rate SET "value"=$1
	WHERE creatorid=$2 and courseid=$3;
  `;
        await db.query(updateRateQuery, [rateValue, studentId, courseId]);
        res.status(200).json({
          success: true,
          message: `The rate has been successfully updated with the value ${rateValue}`,
        });
      }
    }
  } catch (error) {
    console.error("Error checking and creating rate:", error);
    res.status(500).json({ success: false, message: "An error occurred." });
  }
});

//==================================================
//=================== like =========================
//==================================================

router.post("/toggleLikeComment", async (req, res) => {
  const { commentId } = req.body;
  const studentId = req.user.id;

  if (!commentId || isNaN(commentId)) {
    return res
      .status(400)
      .json({ success: false, message: "commentId must be a number." });
  }
  try {
    // Attempt to insert the like
    const createLikeQuery = `
      INSERT INTO "like" (creatorid, commentid)
      VALUES ($1, $2);
    `;

    await db.query(createLikeQuery, [studentId, commentId]);

    return res
      .status(200)
      .json({ success: true, message: "Like added successfully." });
  } catch (error) {
    if (error.constraint === "like_pkey") {
      // Duplicate key error, remove the like
      const deleteLikeQuery = `
        DELETE FROM "like"
        WHERE creatorid = $1 AND commentid = $2;
      `;

      await db.query(deleteLikeQuery, [studentId, commentId]);

      return res.json({ success: true, message: "Like removed successfully." });
    } else {
      console.error("Error liking/unliking comment:", error);
      return res
        .status(500)
        .json({ success: false, message: "An error occurred." });
    }
  }
});

//==================================================
//=================== GPA =========================
//==================================================

router.get("/viewGpa", async (req, res) => {
  try {
    const studentId = req.user.id;
    if (!studentId) {
      return res
        .status(400)
        .json({ success: false, message: "Student ID is required." });
    }
    //other way to get the whole gpa of all sceduls but the rsult will be the gpa or zero
    //other way to get the whole gpa of all sceduls but the rsult will be the gpa or zero
    const gpaQuery = `
  select COALESCE(SUM(g.value * c.credithours), 0) AS total_grade_points,
    COALESCE(SUM(c.credithours), 0) AS total_credit_hours,
    COALESCE(
        ROUND((SUM(g.value * c.credithours) / NULLIF(SUM(c.credithours), 0))::numeric,2),  0::numeric) AS schedule_gpa
FROM
    public.grade g
JOIN
    public.course c ON g.courseid = c.id
WHERE
    g.creatorid = $1;`;
    /** old qouery
  select COALESCE(SUM(g.value * c.credithours), 0) AS total_grade_points,
    COALESCE(SUM(c.credithours), 0) AS total_credit_hours,
    COALESCE(
        ROUND((SUM(g.value * c.credithours) / NULLIF(SUM(c.credithours), 0))::numeric,2),  0::numeric) AS schedule_gpa
FROM
    public.grade g
JOIN
    public.course c ON g.courseid = c.id
WHERE
    g.creatorid = $1;`;
    /** old qouery
      SELECT
        SUM(g.value * c.credithours) AS total_grade_points,
        SUM(c.credithours) AS total_credit_hours
      FROM public.grade g
      JOIN public.course c ON g.courseid = c.id
      JOIN public.schedule_course sc ON g.courseid = sc.courseid
      JOIN public.schedule s ON sc.scheduleid = s.id
      WHERE s.studentid = $1;
     */

    const gpaResult = await db.query(gpaQuery, [studentId]);

    if (
      gpaResult.rows.length > 0 &&
      gpaResult.rows[0].total_credit_hours !== 0 &&
      gpaResult.rows[0].total_grade_points !== 0 &&
      gpaResult.rows[0].total_credit_hours !== 0 &&
      gpaResult.rows[0].total_grade_points !== 0
    ) {
      const totalGradePoints = parseFloat(gpaResult.rows[0].total_grade_points);
      const totalCreditHours = parseFloat(gpaResult.rows[0].total_credit_hours);
      const averageGPA = parseFloat(
        (totalGradePoints / totalCreditHours).toFixed(2)
      );

      res.status(200).json({
        success: true,
        message: "GPA calculated successfully.",
        studentId: studentId,
        averageGPA: averageGPA,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No grades found for the student or student not found.",
      });
    }
  } catch (error) {
    console.error("Error calculating GPA:", error);
    res.status(500).json({ error: "An error occurred." });
  }
});
router.get("/viewGpa/:scheduleId", async (req, res) => {
  try {
    const scheduleId = parseInt(req.params.scheduleId);
    const studentId = parseInt(req.user?.id);

    if (!scheduleId) {
      return res
        .status(400)
        .json({ success: false, message: "Schedule ID is required." });
    }

    const gpaQuery = `
      SELECT COALESCE(SUM(g.value * c.credithours), 0) AS total_grade_points,
    COALESCE(SUM(c.credithours), 0) AS total_credit_hours,
    COALESCE(
        ROUND((SUM(g.value * c.credithours) / NULLIF(SUM(c.credithours), 0))::numeric,2),  0.00::numeric) AS schedule_gpa
FROM schedule_course sc
JOIN course c ON sc.courseid = c.id
LEFT JOIN grade g ON sc.courseid = g.courseid 
    AND g.creatorid = $1
WHERE sc.scheduleid = $2 and c.id= g.courseid;
    `;

    const gpaResult = await db.query(gpaQuery, [studentId, scheduleId]);

    if (
      gpaResult.rows.length > 0 &&
      gpaResult.rows[0].total_credit_hours !== 0 &&
      gpaResult.rows[0].total_grade_points !== 0
    ) {
      const totalGradePoints = parseFloat(gpaResult.rows[0].total_grade_points);
      const totalCreditHours = parseFloat(gpaResult.rows[0].total_credit_hours);
      const averageGPA = parseFloat(
        (totalGradePoints / totalCreditHours).toFixed(2)
      );

      res.status(200).json({
        success: true,
        message: "GPA calculated successfully for schedule.",
        scheduleId: scheduleId,
        averageGPA: averageGPA,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No grades found for the schedule or schedule not found.",
      });
    }
  } catch (error) {
    console.error("Error calculating GPA for schedule:", error);
    res.status(500).json({ error: "An error occurred." });
  }
});

//==================================================
//=================== comment ======================
//==================================================

router.post("/postComment", async (req, res) => {
  try {
    const { courseId, courseCode, content, tag, parentCommentId } = req.body;
    const studentId = req.user.id;
    const anotherName = req.user.name;
    if (!courseId || !content || !tag) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters (studentId, courseId, content).",
      });
    }

    let commentResult;
    if (parentCommentId) {
      // If parentCommentId is provided, create a reply
      commentResult = await db.query(`INSERT INTO public.comment (authorid, courseid, content, tag, parentCommentId) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [studentId, courseId, content, tag, parentCommentId]);

      // store the notification record
      try {
        const parentComment = await db.query(`SELECT * FROM public.comment WHERE id=$1`, [parentCommentId])
        const parentcommentauthorid = parentComment.rows[0].authorid
        const notificationResult = await db.query(`INSERT INTO notifications ( parentcommentauthorid, coursecode, courseid, parentCommentId, replyauthor ) 
                                                   VALUES ($1, $2, $3, $4, $5) RETURNING *;`, [parentcommentauthorid, courseCode, courseId, parentCommentId, anotherName])
        // Here I should send the notification to FCM
        /**
         * get the parent comment auhor id 
         * search for his token (or tokens)
         * if they exist: send notifications via fireebase
         * else: NOTHING
         */
        try {
          let personToBeNotified = await db.query(`SELECT fcmtoken FROM public.pushnotificationsregistration WHERE user_id=$1`, [parentcommentauthorid])
          if (personToBeNotified.rows.length) {
            let dynamic_url = process.env.NODE_ENV ? process.env.PRODUCTION_CLIENT_URL : process.env.DEVELOPMENT_CLIENT_URL
            dynamic_url = `${dynamic_url}/courses/${courseId}#${parentCommentId}`
            // Razouq: If we need to send to only one client: 
            /*
            const pushNotification = {
              token: personToBeNotified.rows[0].fcmtoken,
              notification: {
                title: `${anotherName} replied to your comment about ${courseCode} `,
                body: content,
                click_action: dynamic_url // Redirect link
              },
              data: {
                url: process.env.NODE_ENV ? process.env.DEVELOPMENT_CLIENT_URL : process.env.PRODUCTION_CLIENT_URL
              }
            };
            await firebaseAdmin.messaging().send(pushNotification)
            */

            const tokens = personToBeNotified.rows.map(row => row.fcmtoken)

            const pushNotification = {
              tokens: tokens, // Razouq: send to all of his devices 
              notification: {
                title: `${anotherName} replied to your comment about ${courseCode}`,
                body: content
              },
              webpush: {
                notification: {
                  title: `${anotherName} replied to your comment about ${courseCode}`,
                  body: content,
                  icon: "https://raw.githubusercontent.com/ALRAZOUQ/TAFAWOUQ/refs/heads/develop/client/src/assets/mainLogo.png"
                },
                data: {
                  url: dynamic_url,
                },
              },
            };

            firebaseAdmin.messaging().sendEachForMulticast(pushNotification).
              then((response) => {
                // console.log(`✅ Successfully sent messages: ${response.successCount}`);
                // console.log(`❌ Failed messages: ${response.failureCount}`);
                if (response.failureCount > 0) {
                  console.log("/postComment 🔴 sending push notifications Errors:", response.responses.filter(r => !r.success));
                }
              })

          }
        } catch (error) {
          console.error(`/postComment Error while sending the notificaation data to FCM:, ${error}`);

        }
      } catch (error) {
        console.error(`/postComment Error while creating a notificaation:, ${error}`);
        res.status(400).json({ success: false, message: `Error while creating a notificaation` })
      }
    } else {
      // If parentCommentId is not provided, create a regular comment
      commentResult = await db.query(
        `INSERT INTO public.comment (authorid, courseid, content, tag) VALUES ($1, $2, $3, $4) RETURNING *`,
        [studentId, courseId, content, tag]
      );
    }
    const newComeent = {
      id: commentResult.rows[0].id,
      content: commentResult.rows[0].content,
      authorId: commentResult.rows[0].authorid,
      authorName: anotherName,
      tag: commentResult.rows[0].tag,
      creationDate: commentResult.rows[0].creationdate,
      numOfLikes: 0,
      numOfReplies: 0,
      isLiked: false,
    };
    res.status(201).json({
      success: true,
      message: "Comment created successfully.",
      comment: newComeent,
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

//==================================================
//================= Notifications ==================
//==================================================
router.post("/RegisterForPushNotifications", async (req, res) => {
  const { FCMToken, deviceType } = req.body
  try {
    const registrationResult = await db.query(`INSERT INTO PushNotificationsRegistration (user_id, FCMToken, deviceType)
                                            VALUES($1, $2, $3) 
                                            ON CONFLICT (user_id, deviceType)
                                            DO UPDATE SET FCMToken = $2
                                            RETURNING *;`, [req.user.id, FCMToken, deviceType])
    // console.log('registrationResult :>> ', registrationResult);
    res.status(200).json({ success: true, message: `The user's FCM Token for his ${registrationResult.rows[0].devicetype} is registered successfully` })
  } catch (error) {
    console.error(`/RegisterForPushNotifications DB error ${error}`)
    res.status(500).json({ success: false, message: `The user's FCM Token for his ${deviceType} couldn't be registered` })
  }
})

router.delete("/deleteMyOldFCMTokenForThisDevice", async (req, res) => {
  const { deviceType } = req.body
  try {
    const deletionResult = await db.query(`DELETE FROM PushNotificationsRegistration
                                          WHERE user_id = $1 AND deviceType = $2
                                          RETURNING *;`, [req.user.id, deviceType])
    res.status(200).json({ success: true, message: `The user's FCM Token for his ${deletionResult.rows[0].devicetype} is deleted successfully` })
  } catch (error) {
    console.error(`/deleteMyOldFCMTokenForThisDevice DB error ${error}`)
    res.status(500).json({ success: false, message: `The user's FCM Token for his ${deviceType} couldn't be deleted` })
  }
})

router.get("/myNotifications", async (req, res) => {

  let notifications = await db.query(`SELECT 
                                          *,
                                          CASE 
                                              WHEN NOW() - timestamp < INTERVAL '1 hour' THEN CONCAT(EXTRACT(MINUTE FROM NOW() - timestamp)::int, ' minutes ago')
                                              WHEN NOW() - timestamp < INTERVAL '1 day' THEN CONCAT(EXTRACT(HOUR FROM NOW() - timestamp)::int, ' hours ago')
                                              ELSE CONCAT(EXTRACT(DAY FROM NOW() - timestamp)::int, ' days ago')
                                          END AS time_ago
                                      FROM notifications
                                      Where parentcommentauthorid=$1;
                                      `, [req.user.id])
  res.status(200).json(notifications.rows)
})


//==================================================
//=================== quiz ======================
//==================================================

router.get("/myQuizList", async (req, res) => {
  try {
    const userId = req.user.id;

    // Get quizzes data
    const quizzesResult = await db.query(
      `select q.* ,c.code as "courseCode", u.name as "authorName" from quiz q 
left join "user" u on u.id = q.authorid
left join hidequiz hq on hq.quizid = q.id 
left join course c on  q.courseid = c.id
where  q.id in(select quizid from myquizlist mql where studentid =$1)`,
      [userId]
    );
if(quizzesResult.rows.length === 0){
return res.status(404).json({
  success: false,
  message: "No quizzes found in myQuizList.",
});}

const quizzeslist = quizzesResult.rows.map((quiz) => ({
  id: quiz.id,
  title: quiz.title,
  isShared: quiz.isshared,
  authorId: quiz.authorid,
  authorName: quiz.authorName,
  courseId: quiz.courseid,
  courseCode: quiz.courseCode,
  creationDate: quiz.creationdate,
}));

    res.status(200).json({
      success: true,
      message: "quizzes retrieved sucssusfully of myQuizList",
      quiz: quizzeslist,
    });
  } catch (error) {
    console.error("Error fetching myQuizList:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to retrieve myQuizList" });
  }
});

router.post("/storeQuiz", async (req, res) => {
  const client = await db.connect();

  try {
    const quiz = req.body.quiz;
    const authorId = req.user.id;

    await client.query("BEGIN");

    // Insert into quiz table
    const quizInsert = await client.query(
      `INSERT INTO quiz (authorid,title) VALUES ($1,$2) RETURNING id`,
      [authorId, quiz.title]
    );
    const quizId = quizInsert.rows[0].id;

    for (const q of quiz.questions) {
      // Insert question
      const questionInsert = await client.query(
        `INSERT INTO question (quizid, content) VALUES ($1, $2) RETURNING id`,
        [quizId, q.question]
      );
      const questionId = questionInsert.rows[0].id;

      // Insert options
      for (const option of q.options) {
        const isCorrect = option === q.correctAnswer;
        await client.query(
          `INSERT INTO option (questionid, content, iscorrect) VALUES ($1, $2, $3)`,
          [questionId, option, isCorrect]
        );
      }
    }

    await client.query("COMMIT");
    res
      .status(201)
      .json({ success: true, message: "Quiz saved successfully", quizId });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Transaction failed:", error);
    res.status(500).json({ success: false, message: "Failed to save quiz" });
  } finally {
    client.release();
  }
});

router.post("/addQuizToMyQuizList", async (req, res) => {
  try {
    const { quizId } = req.body;
    const userId = req.user.id;
    if (!quizId) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters quizId.",
      });
    }

    //cheek of existing in myQuizList
    const myQuizListResult = await db.query(
      `SELECT * FROM myquizlist WHERE studentid = $1 AND quizid = $2`,
      [userId, quizId]
    );

    if (myQuizListResult.rows.length !== 0) {
      return res.status(403).json({
        success: false,
        message: "Quiz already exists in myQuizList.",
      });
    }

    const insertResult = await db.query(
      `INSERT INTO myquizlist(
	studentid, quizid)
	VALUES ($1, $2)`,
      [userId, quizId]
    );

    res.status(201).json({
      success: true,
      message: "Quiz added to myQuizList successfully.",
    });
  } catch (error) {
    console.error("Error add to myQuizList:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

//==================================================
//=================== report ======================
//==================================================

router.post("/reportComment", async (req, res) => {
  try {
    const { commentId, reportContent } = req.body;
    const userId = req.user.id;
    if (!userId || !commentId || !reportContent) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required parameters (userId, commentId, reportContent).",
        message:
          "Missing required parameters (userId, commentId, reportContent).",
      });
    }
    // Begin transaction to do the process together or nothing
    await db.query("BEGIN");
    // Begin transaction to do the process together or nothing
    await db.query("BEGIN");

    // Create the report
    const reportResult = await db.query(
      `INSERT INTO report (authorid, content) VALUES ($1, $2) RETURNING id`,
      [userId, reportContent]
    );

    const reportId = reportResult.rows[0].id;

    // Link the report with the comment
    await db.query(
      `INSERT INTO report_comment (reportid, commentid) VALUES ($1, $2)`,
      [reportId, commentId]
    );

    // Commit transaction
    await db.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Comment reported successfully.",
    });
  } catch (error) {
    // Rollback transaction on error
    await db.query("ROLLBACK");
    console.error("Error reporting comment:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/reportQuiz", async (req, res) => {
  try {
    const { quizId, reportContent } = req.body;
    const userId = req.user.id;

    if (!userId || !quizId || !reportContent) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters (userId, quizId, reportContent).",
      });
    }

    // Begin transaction to do the process together or nothing
    await db.query("BEGIN");

    // Create the report
    const reportResult = await db.query(
      `INSERT INTO report (authorid, content) VALUES ($1, $2) RETURNING id`,
      [userId, reportContent]
    );

    const reportId = reportResult.rows[0].id;

    // Link the report with the quiz
    await db.query(
      `INSERT INTO report_quiz (reportid, quizid) VALUES ($1, $2)`,
      [reportId, quizId]
    );

    // Commit transaction
    await db.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Quiz reported successfully.",
    });
  } catch (error) {
    // Rollback transaction on error
    await db.query("ROLLBACK");
    console.error("Error reporting quiz:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
