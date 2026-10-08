import { Request, Response, NextFunction } from 'express';
import CardService from './service';

export class CardController {
  private cardService: CardService;

  constructor(cardService = new CardService()) {
    this.cardService = cardService;
  }

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const companyId = req.user!.companyId;
      const card = await this.cardService.createCard(userId, companyId, req.body);

      res.status(201).json({
        success: true,
        message: 'SmartCard created successfully',
        data: card
      });
    } catch (error) {
      next(error);
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const actorId = req.user?.id; // Optional (some endpoints can be public)
      const card = await this.cardService.getCardById(id, actorId);

      res.status(200).json({
        success: true,
        data: card
      });
    } catch (error) {
      next(error);
    }
  };

  getPublicCard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { username } = req.params;
      const card = await this.cardService.getPublicCardByUsername(username);

      res.status(200).json({
        success: true,
        data: card
      });
    } catch (error) {
      next(error);
    }
  };

  getMyCard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const card = await this.cardService.getMyCard(userId);

      res.status(200).json({
        success: true,
        data: card
      });
    } catch (error) {
      next(error);
    }
  };

  updateMyCard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const card = await this.cardService.updateMyCard(userId, req.body);

      res.status(200).json({
        success: true,
        message: 'SmartCard updated successfully',
        data: card
      });
    } catch (error) {
      next(error);
    }
  };

  deleteMyCard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      await this.cardService.deleteMyCard(userId);

      res.status(200).json({
        success: true,
        message: 'SmartCard deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  getMyCards = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const cards = await this.cardService.getCardsByUser(userId);

      res.status(200).json({
        success: true,
        data: cards
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const actorId = req.user!.id;
      const card = await this.cardService.updateCard(id, actorId, req.body);

      res.status(200).json({
        success: true,
        message: 'SmartCard updated successfully',
        data: card
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const actorId = req.user!.id;
      await this.cardService.deleteCard(id, actorId);

      res.status(200).json({
        success: true,
        message: 'SmartCard deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  sendWhatsApp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { phone } = req.body;
      if (!phone) {
        res.status(400).json({ success: false, message: 'Recipient phone number is required' });
        return;
      }
      const card = await this.cardService.getCardById(id);
      if (!card) {
        res.status(404).json({ success: false, message: 'Card not found' });
        return;
      }

      const cardUrl = `http://localhost:3000/c/${card.id}`;
      const { sendCardViaWhatsApp } = await import('../../lib/whatsapp');
      const success = await sendCardViaWhatsApp(phone, card.name, cardUrl);

      res.status(200).json({
        success,
        message: success ? 'WhatsApp dispatch webhook triggered' : 'Failed to trigger WhatsApp dispatch'
      });
    } catch (error) {
      next(error);
    }
  };
}
export default CardController;
