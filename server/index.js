// Libraries imports
console.log('==================')
console.log(module.paths[0]);
import('express')
  .then(express => {
    console.log('Express loaded successfully.');
    console.log(module.paths);
    return import('passport');
  })
  .then(passport => {
    console.log(module.paths);
    console.log('Passport loaded successfully.');
  })
  .catch(err => {
    console.log(module.paths);
    console.error('Error loading modules:', err);
  });

// import express from 'express';
import passport from 'passport';
import session from 'express-session';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import db from './config/db.js'; // database conection
import env from 'dotenv'
import flash from 'connect-flash'
import errorHandler from "./middleware/errorHandler.js";
import cors from 'cors';

const app = express();

app.use(flash());
// start coding
app.use(express.urlencoded({ extended: true }))
env.config()
app.use(express.json());
const port = process.env.PORT
const error505msg = "Sorry! It seems we have a problem with our servers. Please try again later."
// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}))




// Passport initialization
app.use(passport.initialize())
app.use(passport.session())


// Local Strategy with bcrypt
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM "user" WHERE email = $1',
      [email]
    );

    if (!rows.length) return done(null, false);

    const user = rows[0];
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) return done(null, false);

    return done(null, { id: user.id, email: user.email, isadmin: user.isadmin, name: user.name });
  } catch (error) {
    return done(error);
  }
}));

// Serialization/Deserialization
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await db.query(
      'SELECT id, email , isadmin ,name FROM "user" WHERE id = $1',
      [id]
    );
    //console.log("test values" , rows[0])
    done(null, rows[0]);
  } catch (error) {
    done(error);
  }
});

/*app.use((req, res, next) => {

    // Assuming `req.user` is set by passport or some authentication middleware
    res.locals.currentPath = req.path
    res.locals.session = req.user;
    next();
});*/





// cross to prepare communicate with client server (React)
app.use(cors({
  origin: ['https://nwsb8x0b-5173.inc1.devtunnels.ms', process.env.DEVELOPMENT_CLIENT_URL, process.env.PRODUCTION_CLIENT_URL], //React link. we have to check if will work normally or not
  credentials: true
}));




db.on('error', error => {

  console.log("\x1b[31m%s\x1b[0m", "[ DB problem ]")
  console.log(error)
})



app.get("/", (req, res) => {
  res.json("Home page :) ")
})

// routes import:
import mainRouter from './routes/mainRouter.js' // one router for all routes n need any route in index.js file


// routes middlewares
app.use("/api", mainRouter)

// Error handling
app.use(errorHandler);

// Razouq: this snippet is necassry for the deployment:
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from React's build folder
app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});
// Razouq: END OF THE DEPLOYMENT CODE


app.listen(port, () => console.log(`Server listen to the port ${port}`))

