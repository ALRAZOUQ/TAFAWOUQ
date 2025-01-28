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
      return res.status(409).json({ error: "User already exists" }); // 409 Conflict
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await db.query(
      `INSERT INTO "user"(name, email, password, isadmin)
	VALUES ( $1, $2, $3, $4) RETURNING *;`,
      [name, email, hashedPassword,isadmin]
    );

    // Log the user in
    req.login(newUser.rows[0], (err) => {
      if (err) {
        return next(err);
      }
      const { id, name, email, isadmin } = newUser.rows[0];
      res.status(201).json({ id, name, email, isadmin }); // 201 Created
    });
  } catch (error) {
    res.status(500).json({ error: error.message }); // 500 Internal Server Error
  }
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.status(200).json({
    message: "Logged in successfully",
    user: { id: req.user.id, name : req.user.name, email: req.user.email, isadmin: req.user.isadmin , name : req.user.name},
  }); // 200 OK
});

router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" }); // 500 Internal Server Error
    req.session.destroy();
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out successfully" }); // 200 OK
  });
});

export default router;
