import express, { Router } from 'express';
import {
  signinController,
  signupController,
} from '../controllers/authController';
import { authLimiter } from '../middlewares/rateLimiter';

const authRouter = Router();

authRouter.post('/signup', authLimiter, signupController);
authRouter.post('/signin', authLimiter, signinController);

export default authRouter;
