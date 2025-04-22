import express from "express";
import { checkAuth } from "../middleware/authMiddleware.js";
import db from "../config/db.js";
import firebaseAdmin from "../config/firebase.js";
import multer from "multer";
import env from "dotenv";
env.config();

import path from "path";
import userController from "../controllers/userController.js";
//End quiz and file upload imports
const router = express.Router();
// Multer config for file upload
const upload = multer({ dest: "uploads/" });
// Apply checkAuth middleware to all routes in this file
// each roter here not allowed to be accessed without authentication. no need to do any thing. the middleware will do the job
router.use(checkAuth);

router.get("/userData", userController.getUser);

//==================================================
//================= schedule ========================
//==================================================
router.get("/currentSchedule", userController.currentSchedule);
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
          {isAuthorized && <InboxButton className=""/>}
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
router.get("/AllSchedules", userController.getAllSchedules);

router.post("/createSchedule", userController.createSchedule);

router.post("/addCourseToLastSchedule", userController.addCourseToLastSchedule);

router.delete("/deleteCourseFromSchedule", userController.deleteCourseFromSchedule);

//==================================================
//=================== grade ========================
//==================================================

router.post("/gradeCourse",userController.gradeCourse);

//==================================================
//=================== rate =========================
//==================================================

router.post("/rateCourse", userController.rateCourse);

//==================================================
//=================== like =========================
//==================================================

router.post("/toggleLikeComment", userController.toggleLikeComment);

//==================================================
//=================== GPA =========================
//==================================================

router.get("/viewGpa", userController.viewAvgGpa);
router.get("/viewGpa/:scheduleId",userController.viewGpaOfSchedule);

//==================================================
//=================== comment ======================
//==================================================

router.post("/postComment",userController.postComment);

//==================================================
//================= Notifications ==================
//==================================================
router.post("/RegisterForPushNotifications", async (req, res) => {
  const { FCMToken, deviceType } = req.body;
  try {
    const registrationResult = await db.query(
      `INSERT INTO PushNotificationsRegistration (user_id, FCMToken, deviceType)
                                            VALUES($1, $2, $3) 
                                            ON CONFLICT (user_id, deviceType)
                                            DO UPDATE SET FCMToken = $2
                                            RETURNING *;`,
      [req.user.id, FCMToken, deviceType]
    );
    // console.log('registrationResult :>> ', registrationResult);
    res
      .status(200)
      .json({
        success: true,
        message: `The user's FCM Token for his ${registrationResult.rows[0].devicetype} is registered successfully`,
      });
  } catch (error) {
    console.error(`/RegisterForPushNotifications DB error ${error}`);
    res
      .status(500)
      .json({
        success: false,
        message: `The user's FCM Token for his ${deviceType} couldn't be registered`,
      });
  }
});

router.delete("/deleteMyOldFCMTokenForThisDevice", async (req, res) => {
  const { deviceType } = req.body;
  try {
    const deletionResult = await db.query(
      `DELETE FROM PushNotificationsRegistration
                                          WHERE user_id = $1 AND deviceType = $2
                                          RETURNING *;`,
      [req.user.id, deviceType]
    );
    res
      .status(200)
      .json({
        success: true,
        message: `The user's FCM Token for his ${deletionResult.rows[0]?.devicetype} is deleted successfully`,
      });
  } catch (error) {
    console.error(`/deleteMyOldFCMTokenForThisDevice DB error ${error}`);
    res
      .status(500)
      .json({
        success: false,
        message: `The user's FCM Token for his ${deviceType} couldn't be deleted`,
      });
  }
});

router.get("/myNotifications", async (req, res) => {
  try {
    let notifications = await db.query(
      `SELECT
                    *,
                    CASE
                        WHEN NOW() - timestamp < INTERVAL '1 hour' THEN
                            CONCAT(EXTRACT(MINUTE FROM NOW() - timestamp)::int, ' دقيقة')
                        WHEN NOW() - timestamp < INTERVAL '1 day' THEN
                            CONCAT(EXTRACT(HOUR FROM NOW() - timestamp)::int, ' ساعة')
                        ELSE
                            CONCAT(EXTRACT(DAY FROM NOW() - timestamp)::int, ' يوم')
                    END AS time_ago
                FROM notifications
                Where parentcommentauthorid=$1;`,
      [req.user.id]
    );
    res.status(200).json(notifications.rows);
  } catch (error) {
    console.error("/myNotifications error: ", error)
    res.status(400).json({ message: "فشل أثناء جلب بيانات التنبيهات" })
  }
});

router.put("/readANotification", async (req, res) => {
  const { id } = req.body;
  const userId = req.user.id
  try {
    let updatedNotification = await db.query(
      `UPDATE public.notifications
        SET readed = true
        WHERE id = $1 AND parentcommentauthorid = $2
        RETURNING *;`,
      [id, userId]
    );
    res.status(200).json(updatedNotification.rows);
  } catch (error) {
    console.error("/readANotification error: ", error)
    res.status(400).json({ message: `لم يتم تعيين الإشعار بالمعرف ${id} كمقروء` })
  }
});

//==================================================
//=================== quiz ======================
//==================================================


// Endpoint to handle PDF upload and quiz generation
router.post("/generateQuiz", upload.single("pdf"),userController.generateQuiz);
router.get("/myQuizList", userController.myQuizList);

router.post("/storeQuiz", userController.storeQuiz);

router.post("/addQuizToMyQuizList", userController.addQuizToMyQuizList);

router.delete("/removeQuizFromMyQuizList",userController.removeQuizFromMyQuizList );

router.post("/shareQuiz",userController.shareQuiz);

router.get("/getQuiz/:quizId",userController.getQuiz );

//==================================================
//=================== report ======================
//==================================================

router.post("/reportComment", userController.reportComment);

router.post("/reportQuiz",userController.reportQuiz);

export default router;
