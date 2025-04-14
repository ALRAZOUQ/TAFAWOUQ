// Libraries imports

import express from 'express';
import passport from 'passport';
import session from 'express-session';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import db from './config/db.js'; // database conection
import env from 'dotenv'
import flash from 'connect-flash'
import errorHandler from "./middleware/errorHandler.js";
import mainRouter from "./routes/mainRouter.js"; // all route's middlewares
import cors from "cors";
//quiz anf file upload imports
import { GoogleGenAI } from "@google/genai"; // Corrected import
import multer from "multer";
import pdfParse from "pdf-parse";
import fs from "fs";
import path from "path";
//End quiz and file upload imports

const app = express();

app.use(flash());
// start coding
app.use(express.urlencoded({ extended: true }))
env.config()
app.use(express.json());
const port = process.env.PORT;
// Multer config for file upload
const upload = multer({ dest: "uploads/" });

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
      `SELECT u.*, case when b.studentid  is not null then true else false end as "isBanned" 
      FROM "user" u
      LEFT JOIN ban b ON b.studentId = u.id
      WHERE u.email = $1 limit 1;`,
      [email]
    );

    if (!rows.length) return done(null, false);

    const user = rows[0];

    if (user.isBanned == true) { // Check if user.isBanned is  true (banned)
      return done(null, false, { message: 'You are banned.' });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) return done(null, false, { message: 'Invalid email or password.' });

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



// cross to prepare communicate with client server (React)
app.use(cors({
  origin: ['https://nwsb8x0b-5173.inc1.devtunnels.ms', process.env.DEVELOPMENT_CLIENT_URL, process.env.PRODUCTION_CLIENT_URL], //React link. we have to check if will work normally or not
  credentials: true
}));


// TODO Razouq: after merging with the main branch, this will be removed, and the user will see the main front end page when he open the sserver port in the browser 
app.get("/", (req, res) => {
  res.json("Home page :) ");
});

// Initialize Gemini with your API key.
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Helper function to generate quiz from text
async function generateQuizFromText(text) {
  try {
    const prompt = `
You are an AI tutor. Based on the following text, create a quiz with these requirements:
- 10 multiple-choice questions
- Each question must have either 2 or 4 options
- Include the correct answer for each question
- Format the output as JSON, like this:

{
    "questions": [
    {
        "question": "Sample question?",
        "options": ["A", "B", "C", "D"],
        "correctAnswer": "A"
    }
    ]
}

Here is the text:
${text}
    `.trim();
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const textResponse = response.text;
    console.log(textResponse);
    // Try to safely parse the quiz JSON
    const match = textResponse.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Quiz format not found in response.");
    console.log("reddy/n============/n", JSON.parse(match[0]));
    return JSON.parse(match[0]);
  } catch (error) {
    console.error("Error in generateQuizFromText:", error); // Important: Log the error
    throw error; // Re-throw the error to be caught in the route handler
  }
}

// Endpoint to handle PDF upload and quiz generation
app.post("/generateQuiz", upload.single("pdf"), async (req, res) => {
  try {
    const title = req.body.title;
    // Ensure title is provided
    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Quiz title is required." });
    }
    // Ensure file is uploaded
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No PDF file uploaded." });
    }

    // **DEBUGGING INFORMATION:**
    console.log("req.file:", req.file); // Inspect the req.file object
    if (req.file && req.file.path) {
      console.log("req.file.path:", req.file.path);
    }

    // **CORRECTED PATH USAGE:** Use req.file.path directly
    const filePath = req.file.path;
    console.log("Attempting to read file from:", filePath); // Log the file path

    // Check if the file exists before attempting to read it (optional but good practice)
    if (!fs.existsSync(filePath)) {
      console.error(`File not found at path: ${filePath}`);
      return res.status(404).json({
        success: false,
        message: "Uploaded file not found on the server.",
      });
    }

    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);

    // Generate quiz using extracted text
    const question = await generateQuizFromText(pdfData.text);

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    // Send only one response
    res.status(200).json({
      success: true,
      message: "Quiz generated successfully",
      quiz: { title: title, questions: question.questions },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong generating the quiz.",
    });
  }
});
// Use this if u want to debug client-requests-mistakes
// app.use((req, res, next) => {
//   console.log("🔍 Request received:", req.path);
//   console.log("🔹 Headers:", req.headers);
//   console.log("🔹 Body:", req.body);
//   console.log("===")
//   next();
// });

// one router for all routes
app.use("/api", mainRouter)


// Error handling
app.use(errorHandler);
app.listen(port, () => console.log(`Server listen to the port ${port}`))

