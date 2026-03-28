import { Router } from 'express';
import {
  createShareLink,
  getUserContent,
} from '../controllers/shareController';
import authMiddleware from '../middlewares/authMiddleware';
import { shareLimiter } from '../middlewares/rateLimiter';

const shareRouter = Router();

shareRouter.post('/share', authMiddleware, shareLimiter, createShareLink);

shareRouter.get('/:shareLink', getUserContent);

export default shareRouter;
