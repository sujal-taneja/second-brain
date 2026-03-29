import { Request, Response } from 'express';
import ContentSchema from '../validators/contentValidator';
import ContentModel, { ContentTypes } from '../models/Content';
import handleTagsInput from '../utils/tagsHandler';

interface AuthRequest extends Request {
  userId?: string;
}

export async function addContent(req: AuthRequest, res: Response) {
  try {
    const parsedData = ContentSchema.safeParse(req.body);

    // If input format is invalid
    if (!parsedData.success) {
      res.status(403).json({ error: parsedData.error });
      return;
    }

    const contentData = { ...parsedData.data, userId: req.userId };

    // Update tags database
    const tags = await handleTagsInput(contentData);

    const newData = { ...contentData, tags };

    // Add content to database
    const createdContent = await ContentModel.create(newData);
    
    // Populate the tags before sending response
    await createdContent.populate('tags', 'title');
    
    res.json({ 
      message: 'Content added',
      content: createdContent
    });
  } catch (err) {
    console.error('Content creation failed:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getContent(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId;

    // Get content from database
    const content = await ContentModel.find({ userId: userId })
      .populate('userId', 'username')
      .populate('tags', 'title');

    res.json({ content });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteContent(req: AuthRequest, res: Response) {
  try {
    const contentId = req.body.contentId;
    const userId = req.userId;

    // Check if content exists and user owns it
    const content = await ContentModel.findOne({ _id: contentId, userId });

    if (!content) {
      res.status(403).json({ error: 'Content not found' });
      return;
    }

    await ContentModel.deleteMany({ _id: contentId, userId });

    res.json({ message: 'Content deleted' });
  } catch (err) {
    console.error('Content deletion failed:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getContentBasedOnType(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId;
    const type: string = req.params.type;

    // If type is invalid
    if (!ContentTypes.includes(type)) {
      res.status(400).json({ message: 'Invalid type' });
      return;
    }

    // Get content from database
    const content = await ContentModel.find({ userId: userId, type })
      .populate('userId', 'username')
      .populate('tags', 'title');

    res.json({ content });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
