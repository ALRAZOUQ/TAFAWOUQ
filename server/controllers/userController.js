import db from "../config/db.js";
import env from "dotenv";
import firebaseAdmin from "../config/firebase.js";
//quiz anf file upload imports
import pdfParse from "pdf-parse";
import fs from "fs";
import { GoogleGenAI } from "@google/genai"; 
env.config();

// Initialize Gemini API.
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

// Helper function to generate quiz from text
async function generateQuizFromText(text, numOfQuestions, typeOfQuestions) {
  if(!numOfQuestions || numOfQuestions === 0){
    numOfQuestions = 10;
  }
  if(!typeOfQuestions || typeOfQuestions === ""){
    typeOfQuestions = "mixed";
  }

  try {
    const prompt = `
You are an AI tutor. Based on the following text, create a quiz with these requirements:
  ${numOfQuestions} questions total
  Question type: ${typeOfQuestions} 
    - If "mixed": include a combination of True/False and Multiple Choice questions
    - If "truefalse": only include True/False questions (2 options: "True", "False")
    - If "multiplechoice": only include multiple-choice questions with 4 options

  Each question must include the correct answer.
  The questions and answers must be written in the **same language used in the input text**.
  Format the output as JSON, like this:

{
  "questions": [
    {
      "question": "Sample question?",
      "options": ["True", "False"],
      "correctAnswer": "True"
    },
    {
      "question": "Another question?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "B"
    }
  ]
}
Make sure the output is JSON only.

Here is the text:
${text}
    `.trim();
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const textResponse = response.text;


    //  parse the quiz JSON
    const match = textResponse.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Quiz format not found in response.");


    return JSON.parse(match[0]);
  } catch (error) {
    //console.error("Error in generateQuizFromText:", error); // we do not need it becuse i handel the erorr in the router
    throw error; // Re-throw the error to be caught in the route handler
  }
};

//==================================================
//=================== user =========================
//==================================================
const userController = {
  async getUser(req, res) {
    try {
      const { rows } = await db.query(
        'SELECT id, name,email, isadmin FROM "user" WHERE id = $1',
        [req.user.id]
      );

      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  //==================================================
  //================= schedule ========================
  //==================================================
  async currentSchedule(req, res) {
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
  },

  async getAllSchedules(req, res) {
    {
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
    }
  },

  async createSchedule(req, res) {
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
  },

  async addCourseToLastSchedule(req, res) {
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
        message:
          "Course added to the schedule for the latest term successfully",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async deleteCourseFromSchedule(req, res) {
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
          .json({
            success: false,
            message: "Course not found in the schedule",
          });
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
      await db.query(
        `DELETE FROM rate WHERE creatorId = $1 AND courseId = $2`,
        [userId, courseId]
      );

      // Delete grade
      await db.query(
        `DELETE FROM grade WHERE creatorId = $1 AND courseId = $2`,
        [userId, courseId]
      );

      res.status(200).json({
        success: true,
        message: "Course deleted from schedule successfully",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  //==================================================
  //=================== grade ========================
  //==================================================
  async gradeCourse(req, res) {
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
  },

  //==================================================
  //=================== rate =========================
  //==================================================
  async rateCourse(req, res) {
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
  },

  //==================================================
  //=================== like =========================
  //==================================================
  async toggleLikeComment(req, res){
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

        return res.json({
          success: true,
          message: "Like removed successfully.",
        });
      } else {
        console.error("Error liking/unliking comment:", error);
        return res
          .status(500)
          .json({ success: false, message: "An error occurred." });
      }
    }
  },

//==================================================
//=================== GPA =========================
//==================================================
async viewAvgGpa(req, res) {
  try {
    const studentId = req.user.id;
    if (!studentId) {
      return res
        .status(400)
        .json({ success: false, message: "Student ID is required." });
    }
   
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
},

async viewGpaOfSchedule(req, res){
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
},

//==================================================
//=================== comment ======================
//==================================================
async postComment(req, res) {
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
    // If parentCommentId is provided, create a reply
    if (parentCommentId) {
      commentResult = await db.query(
        `INSERT INTO public.comment (authorid, courseid, content, tag, parentCommentId) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [studentId, courseId, content, tag, parentCommentId]
      );

      // TODO Razouq: send 200

      // store the notification record
      try {
        const parentComment = await db.query(
          `SELECT * FROM public.comment WHERE id=$1`,
          [parentCommentId]
        );
        const parentcommentauthorid = parentComment.rows[0].authorid;
        const notificationResult = await db.query(
          `INSERT INTO notifications ( parentcommentauthorid, coursecode, courseid, parentCommentId, replyauthor ) 
                                                   VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
          [
            parentcommentauthorid,
            courseCode,
            courseId,
            parentCommentId,
            anotherName,
          ]
        );
        // send the push notification
        try {
          let personToBeNotified = await db.query(
            `SELECT fcmtoken FROM public.pushnotificationsregistration WHERE user_id=$1`,
            [parentcommentauthorid]
          );

          if (personToBeNotified.rows.length && firebaseAdmin) {
            // check if the personToBeNotified allowed notifications && check if firebaseAdmin is initilized correctly
            let dynamic_url = process.env.NODE_ENV=== "production"
              ? process.env.PRODUCTION_CLIENT_URL
              : process.env.DEVELOPMENT_CLIENT_URL;
            dynamic_url = `${dynamic_url}/courses/${courseId}#${parentCommentId}`;

            // Razouq: If we need to send to only one client:

            /*const pushNotification = {
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

            const tokens = personToBeNotified.rows.map((row) => row.fcmtoken);

            const pushNotification = {
              tokens: tokens, // Razouq: send to all of his devices
              // notification: {
              //   title: `${anotherName} replied to your comment about ${courseCode}`,
              //   body: content,
              // },
              webpush: {
                notification: {
                  title: `${anotherName} replied to your comment about ${courseCode}`,
                  body: content,
                  icon: "./mainLogo.png",
                },
                fcm_options: {
                  link: dynamic_url,
                },

              },
            };

            firebaseAdmin
              .messaging()
              .sendEachForMulticast(pushNotification)
              .then((response) => {
                // console.log(`✅ Successfully sent messages: ${response.successCount}`);
                // console.log(`❌ Failed messages: ${response.failureCount}`);
                if (response.failureCount > 0) {
                  console.log(
                    "/postComment 🔴 sending push notifications Errors:",
                    response.responses.filter((r) => !r.success)
                  );
                }
              });
          }
        } catch (error) {
          console.error(
            `/postComment Error while sending the notificaation data to FCM:, ${error}`
          );
        }
      } catch (error) {
        console.error(
          `/postComment Error while creating a notificaation:, ${error}`
        );
        res
          .status(400)
          .json({
            success: false,
            message: `Error while creating a notificaation`,
          });
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
},

//==================================================
//===================== quiz =======================
//==================================================
async generateQuiz(req, res){
  try {
    const title = req.body.title;
    const numOfQuestions = req.body.numOfQuestions;
    const typeOfQuestions = req.body.typeOfQuestions;
    // Ensure title is provided
    if (!title ) {
      return res
        .status(400)
        .json({
          success: false,
          message: "the quiz title  is required.",
        });
    }
    // Ensure file is uploaded
    if (!req.file) {
      return res
        .status(402)
        .json({ success: false, message: "No PDF file uploaded." });
    }

    if (req.file && req.file.path) {
      // console.log("req.file.path:", req.file.path);
    }

    const filePath = req.file.path;
    //console.log("Attempting to read file from:", filePath); // Log the file path

    if (!fs.existsSync(filePath)) {
      console.error(`File not found at path: ${filePath}`);
      return res.status(404).json({
        success: false,
        message: "Uploaded file not found on the server.",
      });
    }

    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);

     // Clean up uploaded file
    fs.unlinkSync(filePath);

    const extractedText = pdfData.text.replace(/\s+/g, '');
    if (!extractedText) {
      return res.status(401).json({
        success: false,
        message: "Sorry, the system cannot read scanned documents.",
      });
    }

    // Generate quiz using extracted text
    const question = await generateQuizFromText(pdfData.text, numOfQuestions ,typeOfQuestions);


    // Send only one response
    res.status(200).json({
      success: true,
      message: "Quiz generated successfully",
      quiz: { title: title, questions: question.questions },
    });
  } catch (error) {
    console.error("Error:", error);
    if (error == "Error: Quiz format not found in response.") {
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
      return res
        .status(405)
        .json({
          success: false,
          message: "the ai failed to format the content as json",
        });
    }
    res.status(500).json({
      success: false,
      message: "Something went wrong generating the quiz.",
    });
  }
},

async myQuizList(req, res){
  {
    try {
      const userId = req.user.id;
  
      // Get quizzes data
      const quizzesResult = await db.query(
        `select q.* ,c.code as "courseCode", u.name as "authorName", COUNT(qu.id) AS "numOfQuestions" from quiz q 
  left join "user" u on u.id = q.authorid
  left join hidequiz hq on hq.quizid = q.id 
  left join course c on  q.courseid = c.id
  left JOIN question qu ON qu.quizid = q.id
  where  q.id in(select quizid from myquizlist mql where studentid =$1)
  GROUP BY q.id, c.id, u.id;`,
        [userId]
      );
      if (quizzesResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No quizzes found in myQuizList.",
        });
      }
  
      const quizzeslist = quizzesResult.rows.map((quiz) => ({
        id: quiz.id,
        title: quiz.title,
        isShared: quiz.isshared,
        authorId: quiz.authorid,
        authorName: quiz.authorName,
        courseId: quiz.courseid,
        courseCode: quiz.courseCode,
        creationDate: quiz.creationdate,
        numOfQuestions: parseInt(quiz.numOfQuestions),
      }));
  
      res.status(200).json({
        success: true,
        message: "quizzes retrieved sucssusfully of myQuizList",
        quizzes: quizzeslist,
      });
    } catch (error) {
      console.error("Error fetching myQuizList:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to retrieve myQuizList" });
    }
  }
},

async storeQuiz(req, res){
  const client = await db.connect();

  try {
    const quiz = req.body.quiz;
    const authorId = req.user.id;

    await client.query("BEGIN");
    //console.log("quiz :>> ", quiz);
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
},


async addQuizToMyQuizList(req, res){
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
},

async removeQuizFromMyQuizList(req, res){
  try {
    const { quizId } = req.body;
    const userId = req.user.id;
    if (!quizId) {
      return res.status(400).json({
        success: false,
        message: "quizId is required.",
      });
    }
    // Check if the quiz is currently exist in myquizlist
    const existingQuiz = await db.query(
      `SELECT studentid, quizid
	FROM myquizlist where studentid =$1 and quizId=$2`,
      [userId, quizId]
    );

    if (existingQuiz.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "quiz does not exist in myquizlist or does not exist in the database.",
      });
    }

    // Remove the quiz from myquizlist
    const result = await db.query(
      `DELETE FROM myquizlist
	WHERE studentid = $1 and quizid=$2;`,
      [userId, quizId]
    );
    if (result.rowCount === 1) {
      res.status(200).json({
        success: true,
        message: "quiz has been successfully removed from myquizlist.",
      });
    }
  } catch (error) {
    console.error("Error when remove a quiz from myquizlist:", error);
    res.status(500).json({ success: false, message: error.message });
  }
},

async shareQuiz(req, res){
  try {
    const { quizId, courseId } = req.body;
    const userId = req.user.id;
    if (!quizId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters quizId or courseId.",
      });
    }

    //cheek of existing in myQuizList
    const quizResult = await db.query(`SELECT * FROM quiz WHERE id = $1`, [
      quizId,
    ]);

    if (quizResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Quiz does not exist.",
      });
    }

    if (quizResult.rows[0].authorid !== userId) {
      return res.status(401).json({
        success: false,
        message: "You are not the author of this quiz.",
      });
    }
    if (quizResult.rows[0].courseid != null) {
      return res.status(403).json({
        success: false,
        message: "the quiz already shared.",
      });
    }

    await db.query(
      `UPDATE quiz
	SET courseid=$1 , isshared=true 
	WHERE id=$2`,
      [courseId, quizId]
    );

    res.status(200).json({
      success: true,
      message: "course shared successfully.",
    });
  } catch (error) {
    console.error("Error while sharing course:", error);
    res.status(500).json({ success: false, message: error.message });
  }
},

async getQuiz(req, res){
  const client = await db.connect();

  try {
    const quizId = req.params.quizId;

    // Get quiz details
    const quizResult = await client.query(
      `SELECT q.* ,c.code as "courseCode",u.name as "authorName" FROM quiz q
      left join course c on  q.courseid = c.id
	  left join "user" u on u.id = q.authorid
        WHERE q.id = $1`,
      [quizId]
    );
    // Get all questions for the quiz
    const questionsResult = await client.query(
      `SELECT id, content FROM question WHERE quizid = $1`,
      [quizId]
    );

    const quizQuestions = [];

    for (const question of questionsResult.rows) {
      // Get all options for this question
      const optionsResult = await client.query(
        `SELECT content, iscorrect FROM option WHERE questionid = $1`,
        [question.id]
      );

      const options = optionsResult.rows.map((o) => o.content);
      const correctAnswer = optionsResult.rows.find(
        (o) => o.iscorrect
      )?.content;

      quizQuestions.push({
        question: question.content,
        options,
        correctAnswer,
      });
    }

    res.status(200).json({
      success: true,
      message: "Quiz retrieved sucssusfully",
      quiz: {
        id: quizResult.rows[0].id,
        title: quizResult.rows[0].title,
        isShared: quizResult.rows[0].isshared,
        authorId: quizResult.rows[0].authorid,
        authorName: quizResult.rows[0].authorName,
        courseId: quizResult.rows[0].courseid,
        courseCode: quizResult.rows[0].courseCode,
        creationDate: quizResult.rows[0].creationdate,
        questions: quizQuestions,
      },
    });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to retrieve quiz" });
  } finally {
    client.release();
  }
},

async reportComment(req, res){
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
},

async reportQuiz(req, res){
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
},
};
export default userController;
