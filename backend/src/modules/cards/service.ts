import { CardRepository, ICardRepository } from './repository';
import { CardResponseDTO, toCardResponseDTO } from './types';
import { NotFoundError, ForbiddenError } from '../../errors/AppError';

export class CardService {
  private cardRepository: ICardRepository;

  constructor(cardRepository = new CardRepository()) {
    this.cardRepository = cardRepository;
  }

  async createCard(userId: string, companyId?: string, cardData?: any): Promise<CardResponseDTO> {
    const defaultQr = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://smartcard.com/c/`;
    
    const card = await this.cardRepository.create({
      ...cardData,
      userId,
      companyId,
      qrCodeUrl: defaultQr // Post-create, we'll patch with actual card ID
    });

    // Update with real ID in QR code link
    const qrCodeUrl = `${defaultQr}${card.id}`;
    const updated = await this.cardRepository.update(card.id, { $set: { qrCodeUrl } });

    return toCardResponseDTO(updated || card);
  }

  async getCardById(cardId: string, requestActorId?: string): Promise<CardResponseDTO> {
    const card = await this.cardRepository.findById(cardId);
    if (!card) {
      throw new NotFoundError('SmartCard not found');
    }

    // Access control: If card is private, only owner can view
    if (!card.isPublic && card.userId.toString() !== requestActorId) {
      throw new ForbiddenError('This SmartCard is set to private');
    }

    // Async record of card view
    await this.cardRepository.incrementViews(cardId);

    return toCardResponseDTO(card);
  }

  async getCardsByUser(userId: string): Promise<CardResponseDTO[]> {
    const cards = await this.cardRepository.findByUser(userId);
    return cards.map(toCardResponseDTO);
  }

  async updateCard(cardId: string, actorId: string, updateData: any): Promise<CardResponseDTO> {
    const card = await this.cardRepository.findById(cardId);
    if (!card) {
      throw new NotFoundError('SmartCard not found');
    }

    if (card.userId.toString() !== actorId) {
      throw new ForbiddenError('You do not own this SmartCard');
    }

    const updated = await this.cardRepository.update(cardId, { $set: updateData });
    if (!updated) {
      throw new NotFoundError('Failed to apply card updates');
    }

    return toCardResponseDTO(updated);
  }

  async deleteCard(cardId: string, actorId: string): Promise<void> {
    const card = await this.cardRepository.findById(cardId);
    if (!card) {
      throw new NotFoundError('SmartCard not found');
    }

    if (card.userId.toString() !== actorId) {
      throw new ForbiddenError('You do not own this SmartCard');
    }

    await this.cardRepository.softDelete(cardId);
  }
}
export default CardService;
