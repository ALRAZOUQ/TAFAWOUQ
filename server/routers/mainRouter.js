import express from 'express';
import userRouter from "./user.js"
import authRouter from './authRouter.js';
import protectedRouter from './protectedRouter.js';
import adminRouter from './adminRouter.js';

//here as classfication of the routers

const mainRouter = express.Router();
mainRouter.use('/auth', authRouter); // Public routers
mainRouter.use('/protected', protectedRouter); // Authenticated routers
mainRouter.use('/admin', adminRouter); // Admin-only routers
mainRouter.use(userRouter)


export default mainRouter;