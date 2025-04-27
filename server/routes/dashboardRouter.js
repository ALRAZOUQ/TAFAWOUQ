import express from 'express'
import dashboardController from '../controllers/dashboardController.js'

const router = express.Router()

router.get("/getTwoMonthsComparison", dashboardController.getTwoMonthsComparison)

router.get("/getCourseCommentsPerDay", dashboardController.getCourseCommentsPerDay)

router.get("/getTop20Commenters", dashboardController.getTop20Commenters)

router.get("/getTop20Courses", dashboardController.getTop20Courses)

export default router