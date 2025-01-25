// Libraries imports
import express from "express"
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import env from 'dotenv'
env.config()
import flash from 'connect-flash'
import bcryptjs from "bcryptjs"



const app = express()



// start coding


import db from "./config/db.js"

//import connectDb from './config/db.js';  // to conect with database
//let db =connectDb()
let  port = process.env.PORT

const error505msg = "Sorry! It seems we have a problem with our servers. Please try again later."

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET ,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30
    }
})




// middlewares
app.use(sessionMiddleware)
app.use(passport.initialize())
app.use(passport.session())
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use((req, res, next) => {
    // Assuming `req.user` is set by passport or some authentication middleware
    res.locals.currentPath = req.path
    res.locals.session = req.user;
    next();
});
app.use(flash());



db.on('error', error => {
    console.log("\x1b[31m%s\x1b[0m", "[ DB problem ]")
    console.log(error)
})

app.get("/", (req, res) => {
    res.json("Home page :) ")
})


// routers import:
import coursesRouter from "./routers/courses_page.js"
import registrationRouter from "./routers/registration_page.js"
import userRouter from "./routers/user.js"

// routers   middlewares
app.use(coursesRouter)
app.use(registrationRouter)
app.use(userRouter)


app.listen(port, () => console.log(`Server listen to the port ${port}`))