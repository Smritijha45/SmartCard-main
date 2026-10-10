import { CardService } from '../src/modules/cards/service';
import { ForbiddenError } from '../src/errors/AppError';
import { PLAN_CONFIGS } from '../src/config/plans';

describe('Plan Entitlement & Limits Enforcement Test Suite', () => {
  let cardService: CardService;
  let mockCardRepo: any;
  let mockUserRepo: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCardRepo = {
      findByUsername: jest.fn(),
      findByUser: jest.fn(),
      create: jest.fn(),
    };
    mockUserRepo = {
      findById: jest.fn(),
    };
    cardService = new CardService(mockCardRepo, mockUserRepo);
  });

  describe('Starter Plan Limits', () => {
    it('should allow Starter user to create their first digital card', async () => {
      const mockUser = {
        id: '507f1f77bcf86cd799439011',
        email: 'starter@smartcard.app',
        subscriptionPlan: 'starter',
      };

      mockUserRepo.findById.mockResolvedValue(mockUser);
      mockCardRepo.findByUser.mockResolvedValue([]);
      mockCardRepo.findByUsername.mockResolvedValue(null);

      const mockCreatedCard = {
        _id: 'card_starter_1',
        id: 'card_starter_1',
        userId: mockUser.id,
        name: 'Starter User',
        username: 'starter-user',
        qrCodeUrl: 'https://smartcard.app/starter-user',
        cardTheme: 'minimal-modern',
        cardLayout: 'vertical',
      };
      mockCardRepo.create.mockResolvedValue(mockCreatedCard);

      const result = await cardService.createCard(mockUser.id, undefined, {
        name: 'Starter User',
        username: 'starter-user',
        title: 'Software Engineer',
      });

      expect(result).toBeDefined();
      expect(result.id).toBe('card_starter_1');
    });

    it('should block Starter user from creating a 2nd active card', async () => {
      const mockUser = {
        id: '507f1f77bcf86cd799439011',
        email: 'starter@smartcard.app',
        subscriptionPlan: 'starter',
      };

      mockUserRepo.findById.mockResolvedValue(mockUser);
      // Already has 1 active card
      mockCardRepo.findByUser.mockResolvedValue([
        { _id: 'card_existing_1', id: 'card_existing_1', userId: mockUser.id }
      ]);

      await expect(
        cardService.createCard(mockUser.id, undefined, {
          name: 'Second Card',
          username: 'starter-second',
        })
      ).rejects.toThrow(ForbiddenError);
    });
  });

  describe('Professional Plan Limits', () => {
    it('should allow Professional user to create multiple cards up to 10', async () => {
      const mockUser = {
        id: '507f1f77bcf86cd799439022',
        email: 'pro@smartcard.app',
        subscriptionPlan: 'professional',
      };

      mockUserRepo.findById.mockResolvedValue(mockUser);
      // Already has 4 cards (limit is 10)
      const existingCards = Array.from({ length: 4 }, (_, i) => ({
        _id: `card_${i}`,
        id: `card_${i}`,
        userId: mockUser.id,
      }));
      mockCardRepo.findByUser.mockResolvedValue(existingCards);
      mockCardRepo.findByUsername.mockResolvedValue(null);

      const mockCreatedCard = {
        _id: 'card_pro_5',
        id: 'card_pro_5',
        userId: mockUser.id,
        name: 'Pro Card 5',
        username: 'pro-card-5',
        qrCodeUrl: 'https://smartcard.app/pro-card-5',
        cardTheme: 'minimal-modern',
        cardLayout: 'vertical',
      };
      mockCardRepo.create.mockResolvedValue(mockCreatedCard);

      const result = await cardService.createCard(mockUser.id, undefined, {
        name: 'Pro Card 5',
        username: 'pro-card-5',
      });

      expect(result).toBeDefined();
      expect(result.id).toBe('card_pro_5');
    });

    it('should reject card creation when Professional user reaches max limit of 10 cards', async () => {
      const mockUser = {
        id: '507f1f77bcf86cd799439022',
        email: 'pro@smartcard.app',
        subscriptionPlan: 'professional',
      };

      mockUserRepo.findById.mockResolvedValue(mockUser);
      const existingCards = Array.from({ length: 10 }, (_, i) => ({
        _id: `card_${i}`,
        id: `card_${i}`,
        userId: mockUser.id,
      }));
      mockCardRepo.findByUser.mockResolvedValue(existingCards);

      await expect(
        cardService.createCard(mockUser.id, undefined, {
          name: '11th Card',
          username: 'pro-card-11',
        })
      ).rejects.toThrow(ForbiddenError);
    });
  });

  describe('Plan Configuration Matrix', () => {
    it('should verify correct configuration limits for all 3 tiers', () => {
      expect(PLAN_CONFIGS.starter.limits.maxActiveCards).toBe(1);
      expect(PLAN_CONFIGS.starter.limits.allowCrmLeads).toBe(false);
      expect(PLAN_CONFIGS.starter.limits.allowTeamAdministration).toBe(false);

      expect(PLAN_CONFIGS.professional.limits.maxActiveCards).toBe(10);
      expect(PLAN_CONFIGS.professional.limits.allowCrmLeads).toBe(true);
      expect(PLAN_CONFIGS.professional.limits.allowAdvancedAnalytics).toBe(true);
      expect(PLAN_CONFIGS.professional.limits.allowTeamAdministration).toBe(false);

      expect(PLAN_CONFIGS.enterprise.limits.maxActiveCards).toBe(100);
      expect(PLAN_CONFIGS.enterprise.limits.maxTeamMembers).toBe(25);
      expect(PLAN_CONFIGS.enterprise.limits.allowTeamAdministration).toBe(true);
      expect(PLAN_CONFIGS.enterprise.limits.allowCustomDomains).toBe(true);
      expect(PLAN_CONFIGS.enterprise.limits.allowEnterpriseSso).toBe(true);
    });
  });
});
