import express from "express";
import { checkAuth, checkAdmin } from "../middleware/authMiddleware.js";
import db from "../config/db.js";
import adminController from "../controllers/adminController.js"
import dashboardRouter from './dashboardRouter.js'
const router = express.Router();

// Apply both middlewares to all admin routes like hide cooment or hide quiz
router.use(checkAuth, checkAdmin);

//this just for testing
router.get("/users", adminController.getAllUsers);

//==================================================
//================= course =========================
//==================================================

router.post("/addCourse", adminController.createCourse);

router.put("/updateCourse", adminController.updateCourse);

router.delete("/deleteCourse/:courseId", adminController.deleteCourse);


//==================================================
//================= comment =========================
//==================================================
router.get("/hiddenComments", adminController.hiddenComments);

router.put("/hideComment", adminController.hideComment);

router.put("/unHideComment", adminController.unHideComment);

//==================================================
//================= quiz =========================
//==================================================
router.get("/hiddenQuizzes", adminController.hiddenQuizzes);

router.put("/hideQuiz", adminController.hideQuiz);

router.put("/unHideQuiz", adminController.unHideQuiz);

//==================================================
//================= report =========================
//==================================================

router.get("/reports/comments", adminController.commentsReports);

router.get("/reports/quizzes", adminController.quizzesReports);

router.delete("/deleteReport", adminController.deleteReport);

//==================================================
//==================== ban =========================
//==================================================
router.get("/bannendAccounts", adminController.bannendAccounts);


router.post("/banUser", adminController.banUser);

router.put("/unBanUser", adminController.banUser);

//==================================================
//==================== term =========================
//==================================================

router.post("/AddTerm", adminController.createTerm);

router.delete("/deleteTerm", adminController.deleteTerm);

//==================================================
//================= Dashbaord ======================
//==================================================
router.use("/dashboard", dashboardRouter)


export default router;
