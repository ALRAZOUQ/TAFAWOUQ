import express from "express";
const router = express.Router()
router.get("/courses", (req, res) => {
    res.json("worked!!!")
})

export default router