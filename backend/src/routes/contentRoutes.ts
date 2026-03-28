import { Router } from 'express';
import {
  addContent,
  deleteContent,
  getContent,
  getContentBasedOnType,
} from '../controllers/contentController';
import authMiddleware from '../middlewares/authMiddleware';
import { contentCreationLimiter } from '../middlewares/rateLimiter';

const contentRouter = Router();

contentRouter.post('/', authMiddleware, contentCreationLimiter, addContent);

contentRouter.get('/', authMiddleware, getContent);

contentRouter.get('/:type', authMiddleware, getContentBasedOnType);

contentRouter.delete('/', authMiddleware, deleteContent);

export default contentRouter;
