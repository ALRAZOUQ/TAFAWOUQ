import express from "express";
import passport from "passport";
import bcrypt from "bcryptjs";
import db from "../config/db.js";

const router = express.Router();

// Public routes (no authentication needed)

//==================================================
//================= Registeration ==================
//==================================================
router.post("/register", async (req, res) => {
  try {
    //console.log(req.body);
    const { name, email, password, isadmin } = req.body;

    // Check if user exists
    const existingUser = await db.query(
      `SELECT * FROM "user" WHERE email = $1`,
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "An account with this already exists",
      }); // 409 Conflict
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await db.query(
      `INSERT INTO "user"(name, email, password, isadmin)
	VALUES ( $1, $2, $3, $4) RETURNING *;`,
      [name, email, hashedPassword, isadmin || false]
    );

    // Log the user in
    req.login(newUser.rows[0], (err) => {
      if (err) {
        return next(err);
      }
      const { id, name, email, isadmin } = newUser.rows[0];
      res.status(201).json({
        message: "registered successfully",
        user: { id: id, name: name, email: email, isadmin: isadmin },
      }); // 201 Created
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" }); // 500 Internal Server Error
  }
});

/*router.post("/login", passport.authenticate("local"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      isadmin: req.user.isadmin,
    },
  }); // 200 OK
});
*/
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err); // Handle errors
    }
    if (!user) {
      if (info && info.message === "You are banned.") {
        return res
          .status(403)
          .json({ success: false, message: "this account is banded." });
      }
      return res
        .status(401)
        .json({
          success: false,
          message: info ? info.message : "Invalid email or password.",
        }); // 401 Unauthorized
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      return res.status(200).json({
        success: true,
        message: "Logged in successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isadmin: user.isadmin,
        },
      });
    });
  })(req, res, next);
});
router.post("/logout", (req, res) => {
  req.logout((err) => {
    try {
      req.session.destroy();
      res.clearCookie("connect.sid");
      res
        .status(200)
        .json({ success: true, message: "Logged out successfully" }); // 200 OK
    } catch (error) {
      return res.status(500).json({ success: false, message: "Logout failed" }); // 500 Internal Server Error
    }
  });
});

//==================================================
//================= course =========================
//==================================================

router.get("/coursesTiteles", async (req, res) => {
  try {
    const courses = await db.query(`select id , name , code from course;`);
    if (courses.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No courses found" });
    }
    res.status(200).json(courses.rows);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/courses", async (req, res) => {
  try {
    const courses = await db.query(`SELECT
    c.*,
COALESCE(ROUND(CAST(r.avgRating AS numeric), 2), 0) AS avgRating,
    COALESCE(ROUND(CAST(g.avgGrade AS numeric), 2), 0) AS avgGrade,

    COALESCE(r.num_raters, 0) AS numOfRaters
FROM
    course c
LEFT JOIN (
    SELECT
        courseId,
        AVG(value) AS avgRating,
        COUNT(DISTINCT creatorId) AS num_raters
    FROM
        rate
    GROUP BY
        courseId
) r ON c.id = r.courseId
LEFT JOIN (
    SELECT
        courseId,
        AVG(value) AS avgGrade
    FROM
        grade
    GROUP BY
        courseId
) g ON c.id = g.courseId;`);
    if (courses.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No courses found" });
    }
    const camelCaseComments = courses.rows.map((course) => ({
      id: course.id,
      name: course.name,
      code: course.code,
      overview: course.overview,
      creditHours: course.credithours,
      creatorId: course.creatorid,
      avgRating: course.avgrating,
      avgGrade: course.avggrade,
      numOfRaters: course.numofraters,
    }));
    res.status(200).json({
      success: true,
      message: "Courses retrieved successfully",
      courses: camelCaseComments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

//we will use this route to get the course details wen we create course page

router.get("/course/:courseId", async (req, res) => {
  try {
    const courseId = parseInt(req.params.courseId);
    const course = await db.query(
      `SELECT
    c.*,
    COALESCE(ROUND(CAST(r.avg_rating AS numeric), 2), 0) AS avgRating,
    COALESCE(ROUND(CAST(g.avg_grade AS numeric), 2), 0) AS avgGrade,
    COALESCE(r.num_raters, 0) AS numOfRaters
FROM
    course c
LEFT JOIN (
    SELECT
        courseId,
        AVG(value) AS avg_rating,
        COUNT(DISTINCT creatorId) AS num_raters
    FROM
        rate
    GROUP BY
        courseId
) r ON c.id = r.courseId
LEFT JOIN (
    SELECT
        courseId,
        AVG(value) AS avg_grade
    FROM
        grade
    GROUP BY
        courseId
) g ON c.id = g.courseId
WHERE
    c.id = $1;`,
      [courseId]
    );
    if (course.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No course found" });
    }
    const camelCaseCourse = course.rows.map((course) => ({
      id: course.id,
      name: course.name,
      code: course.code,
      overview: course.overview,
      creditHours: course.credithours,
      creatorId: course.creatorid,
      avgRating: course.avgrating,
      avgGrade: course.avggrade,
      numOfRaters: course.numofraters,
    }));
    res.status(200).json({
      success: true,
      message: "Course retrieved successfully",
      course: camelCaseCourse,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message + "error" });
  }
});

//==================================================
//================= comment ========================
//==================================================

router.get("/comment/:id", async (req, res) => {
  try {
    const commentId = parseInt(req.params.id);
    const comments = await db.query(
      `SELECT 
  c.id,
  c.content,
  c.creationDate,
  c.tag,
  u.name AS author,
  u.id AS authorId,
  COALESCE(l.num_likes, 0) AS numOfLikes,
  COALESCE(r.reply_count, 0) AS numOfReplies
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
WHERE c.id = $1
  AND hc.id IS NULL;  -- Exclude comments that exist in hideComment`,
      [commentId]
    );

    if (comments.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No replies found on this comment" });
    }
    const camelCaseComments = comments.rows.map((comment) => ({
      id: comment.id,
      content: comment.content,
      authorId: comment.authorid,
      authorName: comment.author,
      tag: comment.tag,
      creationDate: comment.creationdate,
      numOfLikes: comment.numoflikes,
      numOfReplies: comment.numofreplies,
    }));
    res.status(200).json({
      success: true,
      message: "replies retrieved successfully",
      comments: camelCaseComments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* it receive course id then will retrieve all comments that are not hidden*/
router.get("/comments/:courseId", async (req, res) => {
  try {
    const courseId = parseInt(req.params.courseId);
    const studentId = req.user?.id;
    const comments = await db.query(
      `SELECT 
  c.id,
  c.content,
  c.creationDate,
  c.tag,
  u.name AS author,
  u.id AS authorid,
  COALESCE(l.num_likes, 0) AS numOfLikes,
  COALESCE(r.reply_count, 0) AS numOfReplies,
  CASE
  WHEN sl.creatorid = $2 THEN true 
          ELSE false 
        END AS isLiked
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
LEFT JOIN "like" sl ON c.id = sl.commentid AND sl.creatorid = $2
WHERE c.courseId = $1  -- Filter by course ID
  AND hc.id IS NULL    -- Exclude hidden comments
  AND c.parentCommentId IS NULL  -- Only top-level comments (no parent)
ORDER BY c.creationDate DESC;`,
      [courseId, studentId]
    );

    if (comments.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No comments found on this course" });
    }
    const camelCaseComments = comments.rows.map((comment) => ({
      id: comment.id,
      content: comment.content,
      authorId: comment.authorid,
      authorName: comment.author,
      tag: comment.tag,
      creationDate: comment.creationdate,
      numOfLikes: comment.numoflikes,
      numOfReplies: comment.numofreplies,
      isLiked: comment.isliked, // Add isLiked boolean
    }));
    res.status(200).json({
      success: true,
      message: "comments retrieved successfully",
      comments: camelCaseComments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/replies/:commentId", async (req, res) => {
  try {
    const commentId = parseInt(req.params.commentId);
    const studentId = req.user?.id;
    const comments = await db.query(
      `SELECT 
  c.id,
  c.content,
  c.creationDate,
  c.tag,
  u.name AS author,
  u.id AS authorId,
  COALESCE(l.num_likes, 0) AS numOfLikes,
  COALESCE(r.numOfReplies, 0) AS numOfReplies,
  CASE 
          WHEN sl.creatorid = $2 THEN true 
          ELSE false 
        END AS isLiked
FROM comment c
JOIN "user" u ON c.authorId = u.id
LEFT JOIN (
  SELECT commentId, COUNT(*) AS num_likes
  FROM "like"
  GROUP BY commentId
) l ON c.id = l.commentId
LEFT JOIN (
  SELECT parentCommentId, COUNT(*) AS numOfReplies
  FROM comment
  WHERE parentCommentId IS NOT NULL
  GROUP BY parentCommentId
) r ON c.id = r.parentCommentId
LEFT JOIN hideComment hc ON c.id = hc.commentId
LEFT JOIN "like" sl ON c.id = sl.commentid AND sl.creatorid = $2
WHERE ( c.parentCommentId = $1)  -- Fetch the main comment and its replies
  AND hc.id IS NULL  -- Exclude hidden comments
ORDER BY c.creationDate ASC;  -- Sort by oldest to maintain thread order`,
      [commentId, studentId]
    );

    if (comments.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No replies found on this comment" });
    }
    const camelCaseComments = comments.rows.map((comment) => ({
      id: comment.id,
      content: comment.content,
      authorId: comment.authorid,
      authorName: comment.author,
      tag: comment.tag,
      creationDate: comment.creationdate,
      numOfLikes: comment.numoflikes,
      numOfReplies: comment.numofreplies,
      isLiked: comment.isliked,
    }));
    res.status(200).json({
      success: true,
      message: "replies retrieved successfully",
      comments: camelCaseComments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

//==================================================
//================= quiz ========================
//==================================================

router.get("/course/quizzes/:courseId", async (req, res) => {
  try {
    const courseId = req.params.courseId;

    // Get quizzes data
    const quizzesResult = await db.query(
      `select q.* ,c.code as "courseCode", u.name as "authorName", COUNT(qu.id) AS "numOfQuestions" from quiz q 
left join "user" u on u.id = q.authorid
left join hidequiz hq on hq.quizid = q.id 
left join course c on  q.courseid = c.id
left join question qu ON qu.quizid = q.id
where c.id =$1 and hq.id IS NULL  -- Exclude quizzes that exist in hideQuiz table
GROUP BY q.id, c.id, u.id;`,
      [courseId]
    );
    if (quizzesResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No quizzes found for this course.",
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
      message: "quizzes retrieved sucssusfully",
      quiz: quizzeslist,
    });
  } catch (error) {
    console.error("Error fetching quizzes list:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to retrieve quizzes list" });
  }
});
export default router;
