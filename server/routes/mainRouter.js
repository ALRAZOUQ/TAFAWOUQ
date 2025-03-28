import express from 'express';
import userRouter from "./user.js"
import authRouter from './authRouter.js';
import protectedRouter from './protectedRouter.js';
import adminRouter from './adminRouter.js';

//here as classfication of the routes

const mainRouter = express.Router();
mainRouter.use('/auth', authRouter); // Public routes
mainRouter.use('/protected', protectedRouter); // Authenticated routes
mainRouter.use('/admin', adminRouter); // Admin-only routes
//// Razouq: this isn't used??
// Razouq: faisel: this  
mainRouter.use(userRouter)


export default mainRouter;