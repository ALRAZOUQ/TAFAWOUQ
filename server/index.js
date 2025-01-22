// Libraries imports
import express from "express"



// routers import:
import coursesRouter from "./routers/courses_page.js"
//  =====================

const app = express()
const port = 5000


app.use(coursesRouter)
app.get("/", (req, res) => {
    res.json("Home page :) ")
})


app.listen(port, () => console.log(`Server listen to the port ${port}`))