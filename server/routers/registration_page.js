import express from "express";
const router = express.Router()
router.post("/login", (req, res) => {

    console.log("/login: work!!!")
    console.log(req.body)
    const { username, password } = req.body
    if (username == "a@ab.com" && password == "123123") {
        res.status(200).json({ success: true })
    } else {
        res.status(400).json({ success: false })
    }

})

export default router