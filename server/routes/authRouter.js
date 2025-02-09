import express from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import db from "../config/db.js";

const router = express.Router();

// Public routes (no authentication needed)
router.post("/register", async (req, res) => {
  try {
    //console.log(req.body);
    const { name, email, password, isadmin } = req.body;

    // Check if user exists
    const existingUser = await db.query(`SELECT * FROM "user" WHERE email = $1`, [
      email
    ]);

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ success: false, message: "An account with this already exists" }); // 409 Conflict
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await db.query(
      `INSERT INTO "user"(name, email, password, isadmin)
	VALUES ( $1, $2, $3, $4) RETURNING *;`,
      [name, email, hashedPassword,isadmin || false]
    );

    // Log the user in
    req.login(newUser.rows[0], (err) => {
      if (err) {
        return next(err);
      }
      const { id, name, email, isadmin } = newUser.rows[0];
      res.status(201).json({
        message: "registered successfully",
        user: { id: id, name : name, email: email, isadmin: isadmin},
      }
        
      ); // 201 Created
    });
  } catch (error) {
    res.status(500).json({  success: false ,message:"Internal Server Error" }); // 500 Internal Server Error
  }
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    user: { id: req.user.id, name : req.user.name, email: req.user.email, isadmin: req.user.isadmin },
  }); // 200 OK
});

router.post("/logout", (req, res) => {
  req.logout((err) => {
    try {
      req.session.destroy();
    res.clearCookie("connect.sid");
    res.status(200).json({ success: true, message: "Logged out successfully" }); // 200 OK
    } catch (error) {
      return res.status(500).json({success: false, message: "Logout failed" }); // 500 Internal Server Error
    }
  });
});


router.get("/coursesTiteles", async (req, res) => {
  try {
    const courses = await db.query(`select id , name , code from course;`);
    if (courses.rows.length === 0) {
      return res.status(404).json({success: false, message: "No courses found" });
    }
    res.status(200).json(courses.rows);
  } catch (error) {
    res.status(500).json({success: false, message: error.message });
  }
});

router.get("/courses", async (req, res) => {
  try {
    const courses = await db.query(`SELECT
    c.*,
    COALESCE(ROUND(r.avgRating, 2), 0) AS avgRating,
    COALESCE(ROUND(g.avgGrade, 2), 0) AS avgGrade,
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
      return res.status(404).json({success: false, message: "No courses found" });
    }
    const camelCaseCourses = courses.rows.map(course => ({
      id: course.id,
      name: course.name,
      code: course.code,
      overview: course.overview,
      creditHours: course.credithours,
      creatorId: course.creatorid,
      avgRating: course.avgrating,
      avgGrade: course.avggrade,
      numOfRaters: course.numofraters
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


//we will use this route to get the course details wen we create course page
router.get("/coursesTiteles", async (req, res) => {
  try {
    const courses = await db.query(`select id , name , code from course;`);
    if (courses.rows.length === 0) {
      return res.status(404).json({success: false, message: "No courses found" });
    }
    res.status(200).json(courses.rows);
  } catch (error) {
    res.status(500).json({success: false, message: error.message });
  }
});

router.get("/course", async (req, res) => {
  try {
    
    const courseId = req.body.courseId;
    const course = await db.query(`SELECT
    c.*,
    COALESCE(ROUND(r.avg_rating, 2), 0) AS avgRating,
    COALESCE(ROUND(g.avg_grade, 2), 0) AS avgGrade,
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
    c.id = $1;`,[courseId]);
    if (course.rows.length === 0) {
      return res.status(404).json({success: false, message: "No course found" });
    }
    const camelCaseCourse = course.rows.map(course => (
      {
      id: course.id,
      name: course.name,
      code: course.code,
      overview: course.overview,
      creditHours: course.credithours,
      creatorId: course.creatorid,
      avgRating: course.avgrating,
      avgGrade: course.avggrade,
      numOfRaters: course.numofraters
    }));
    res.status(200).json({
      success: true,
      message: "Course retrieved successfully",
      course: camelCaseCourse,
    });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({success: false, message: error.message+"error" });
  }
});
    export default router;
