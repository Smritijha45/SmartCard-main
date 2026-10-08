import { CardRepository, ICardRepository } from './repository';
import { CardResponseDTO, PublicCardDTO, toCardResponseDTO, toPublicCardDTO } from './types';
import { NotFoundError, ForbiddenError, ValidationError } from '../../errors/AppError';

export const RESERVED_USERNAMES = [
  'admin', 'administrator', 'dashboard', 'login', 'signup', 'signin', 'register',
  'api', 'settings', 'pricing', 'features', 'about', 'notifications', 'analytics',
  'profile', 'contacts', 'cards', 'leads', 'demo', 'c', '_not-found', 'help',
  'terms', 'privacy', 'auth', 'app', 'www', 'root', 'support', 'status', 'account'
];

export class CardService {
  private cardRepository: ICardRepository;

  constructor(cardRepository = new CardRepository()) {
    this.cardRepository = cardRepository;
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'card';
  }

  private validateUsername(rawUsername: string): string {
    const trimmed = (rawUsername || '').trim().toLowerCase();
    if (!trimmed || trimmed.length < 3) {
      throw new ValidationError('Username must be at least 3 characters');
    }
    if (trimmed.length > 30) {
      throw new ValidationError('Username cannot exceed 30 characters');
    }
    if (/\s/.test(rawUsername)) {
      throw new ValidationError('Username cannot contain spaces');
    }
    if (!/^[a-z0-9_-]+$/.test(trimmed)) {
      throw new ValidationError('Username can only contain alphanumeric characters, hyphens, and underscores');
    }
    if (/^[-_]|[-_]$/.test(trimmed)) {
      throw new ValidationError('Username cannot start or end with a hyphen or underscore');
    }
    if (RESERVED_USERNAMES.includes(trimmed)) {
      throw new ValidationError(`"${trimmed}" is a reserved system username`);
    }
    return trimmed;
  }

  private async ensureUniqueUsername(baseUsername: string, excludeCardId?: string): Promise<string> {
    const validBase = this.validateUsername(baseUsername);
    let candidate = validBase;
    let counter = 1;

    while (true) {
      const existing = await this.cardRepository.findByUsername(candidate);
      if (!existing || (excludeCardId && existing._id.toString() === excludeCardId)) {
        return candidate;
      }
      counter += 1;
      candidate = `${validBase}-${counter}`;
    }
  }

  async createCard(userId: string, companyId?: string, cardData?: any): Promise<CardResponseDTO> {
    const rawUsername = cardData?.username || this.generateSlug(cardData?.name || 'user');
    const username = await this.ensureUniqueUsername(rawUsername);
    const appBaseUrl = (process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://smartcard.app').replace(/\/+$/, '');
    const publicCardUrl = `${appBaseUrl}/${username}`;

    const card = await this.cardRepository.create({
      ...cardData,
      userId,
      companyId,
      username,
      qrCodeUrl: publicCardUrl,
      cardTheme: cardData?.cardTheme || 'minimal-modern',
      cardLayout: cardData?.cardLayout || 'vertical',
      title: cardData?.title || cardData?.role,
      role: cardData?.role || cardData?.title,
      github: cardData?.github || cardData?.socialLinks?.github,
      linkedin: cardData?.linkedin || cardData?.socialLinks?.linkedin,
      instagram: cardData?.instagram || cardData?.socialLinks?.instagram,
      twitter: cardData?.twitter || cardData?.socialLinks?.twitter || cardData?.socialLinks?.x,
    });

    return toCardResponseDTO(card);
  }

  async getPublicCardByUsername(username: string): Promise<PublicCardDTO> {
    const card = await this.cardRepository.findByIdOrUsername(username);
    if (!card) {
      throw new NotFoundError('SmartCard not found');
    }

    if (!card.isPublic) {
      throw new ForbiddenError('This SmartCard is currently private');
    }

    // Async record of card view
    await this.cardRepository.incrementViews(card._id.toString());

    return toPublicCardDTO(card);
  }

  async getCardById(cardId: string, requestActorId?: string): Promise<CardResponseDTO> {
    const card = await this.cardRepository.findByIdOrUsername(cardId);
    if (!card) {
      throw new NotFoundError('SmartCard not found');
    }

    // Access control: If card is private, only owner can view
    if (!card.isPublic && card.userId.toString() !== requestActorId) {
      throw new ForbiddenError('This SmartCard is currently private');
    }

    // Async record of card view
    await this.cardRepository.incrementViews(card._id.toString());

    return toCardResponseDTO(card);
  }

  async getCardsByUser(userId: string): Promise<CardResponseDTO[]> {
    const cards = await this.cardRepository.findByUser(userId);
    return cards.map(toCardResponseDTO);
  }

  async updateCard(cardId: string, actorId: string, updateData: any): Promise<CardResponseDTO> {
    const card = await this.cardRepository.findByIdOrUsername(cardId);
    if (!card) {
      throw new NotFoundError('SmartCard not found');
    }

    if (card.userId.toString() !== actorId) {
      throw new ForbiddenError('You do not own this SmartCard');
    }

    const payload = { ...updateData };
    const appBaseUrl = (process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://smartcard.app').replace(/\/+$/, '');

    if (payload.username && payload.username !== card.username) {
      payload.username = await this.ensureUniqueUsername(payload.username, card._id.toString());
      payload.qrCodeUrl = `${appBaseUrl}/${payload.username}`;
    }

    if (payload.title && !payload.role) {
      payload.role = payload.title;
    }
    if (payload.role && !payload.title) {
      payload.title = payload.role;
    }

    const updated = await this.cardRepository.update(card._id.toString(), { $set: payload });
    if (!updated) {
      throw new NotFoundError('Failed to apply card updates');
    }

    return toCardResponseDTO(updated);
  }

  async getMyCard(userId: string): Promise<CardResponseDTO> {
    const cards = await this.cardRepository.findByUser(userId);
    if (!cards || cards.length === 0) {
      throw new NotFoundError('No SmartCard found for current user');
    }
    return toCardResponseDTO(cards[0]);
  }

  async updateMyCard(userId: string, updateData: any): Promise<CardResponseDTO> {
    const cards = await this.cardRepository.findByUser(userId);
    if (!cards || cards.length === 0) {
      return this.createCard(userId, undefined, updateData);
    }
    const cardId = cards[0]._id.toString();
    return this.updateCard(cardId, userId, updateData);
  }

  async deleteMyCard(userId: string): Promise<void> {
    const cards = await this.cardRepository.findByUser(userId);
    if (!cards || cards.length === 0) {
      throw new NotFoundError('No SmartCard found to delete');
    }
    await this.deleteCard(cards[0]._id.toString(), userId);
  }

  async deleteCard(cardId: string, actorId: string): Promise<void> {
    const card = await this.cardRepository.findByIdOrUsername(cardId);
    if (!card) {
      throw new NotFoundError('SmartCard not found');
    }

    if (card.userId.toString() !== actorId) {
      throw new ForbiddenError('You do not own this SmartCard');
    }

    await this.cardRepository.softDelete(card._id.toString());
  }
}
export default CardService;
