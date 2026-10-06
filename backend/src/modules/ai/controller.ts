import { Request, Response, NextFunction } from 'express';
import AISuggestionService from './service';

export class AIController {
  private aiService: AISuggestionService;

  constructor(aiService = new AISuggestionService()) {
    this.aiService = aiService;
  }

  getSuggestions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'User not authenticated' });
        return;
      }
      const suggestions = await this.aiService.getSuggestions(userId);
      res.status(200).json({
        success: true,
        data: suggestions
      });
    } catch (error) {
      next(error);
    }
  };
}
export default AIController;
