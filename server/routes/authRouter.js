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
    export default router;
