// Libraries imports
import express from "express"
import pg from "pg";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import env from 'dotenv'
import flash from 'connect-flash'
import bcryptjs from "bcryptjs"

const app = express()
// routers import:
import coursesRouter from "./routers/courses_page.js"


// start coding
env.config()
const port = process.env.PORT
const error505msg = "Sorry! It seems we have a problem with our servers. Please try again later."


const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
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
app.use((req, res, next) => {
    // Assuming `req.user` is set by passport or some authentication middleware
    res.locals.currentPath = req.path
    res.locals.session = req.user;
    next();
});
app.use(flash());




let db
if (process.env.DATABASE_URL) {

    console.log('\x1b[38;5;123m%s\x1b[0m', 'Connected to the [Cloud] DB')
    // for cloud
    db = new pg.Client({
        connectionString: process.env.DATABASE_URL, // Use the DATABASE_URL provided by Heroku
        connectionTimeoutMillis: 5000, // 5 seconds timeout

        ssl: {
            rejectUnauthorized: false // Required for Heroku SSL connections
        }
    });
} else {

    console.log('\x1b[38;5;156m%s\x1b[0m', 'Connected to the [LOCAL] DB')

    db = new pg.Client(
        {
            user: process.env.USER,
            host: process.env.HOST,
            database: process.env.DATABASE,
            password: process.env.PASSWORD,
            port: process.env.DATABASEPORT
        }
    )
}
db.connect();
db.on('error', error => {
    console.log("\x1b[31m%s\x1b[0m", "[ DB problem ]")
    console.log(error)
})


app.get("/", (req, res) => {
    res.json("Home page :) ")
})

// routers middlewares
app.use(coursesRouter)


app.listen(port, () => console.log(`Server listen to the port ${port}`))