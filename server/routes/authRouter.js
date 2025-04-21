import express from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import db from "../config/db.js";
import authController from "../controllers/authController.js"
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



router.get("/courses",authController.getAllCourses);

//we will use this route to get the course details wen we create course page

router.get("/course/:courseId", authController.getCourse);

//==================================================
//================= comment ========================
//==================================================

router.get("/comment/:id", authController.getComment);

/* it receive course id then will retrieve all comments that are not hidden*/
router.get("/comments/:courseId", authController.getCourseComments);

router.get("/replies/:commentId", authController.getCommentReplies );

//==================================================
//================= quiz ========================
//==================================================

router.get("/course/quizzes/:courseId",  authController.getCourseQuizzes);
export default router;
