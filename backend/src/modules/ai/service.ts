import { CardRepository } from '../cards/repository';

export class AISuggestionService {
  private cardRepository: CardRepository;

  constructor(cardRepository = new CardRepository()) {
    this.cardRepository = cardRepository;
  }

  async getSuggestions(userId: string): Promise<{ score: number; tips: string[] }> {
    const cards = await this.cardRepository.findByUser(userId);
    if (cards.length === 0) {
      return {
        score: 10,
        tips: [
          'Create your first professional smart identity card to get started.',
          'Add a headline or professional role so people understand your profile.',
          'Fill in contact information such as email and phone.'
        ]
      };
    }

    const card = cards[0];
    let score = 20;
    const tips: string[] = [];

    if (card.name) score += 10;
    
    if (card.role) {
      score += 10;
    } else {
      tips.push('Add a specific professional role/title (e.g., Senior Software Developer) to let visitors identify your expertise instantly.');
    }

    if (card.company) {
      score += 10;
    } else {
      tips.push('Specify your active company or organization name to establish corporate context.');
    }

    if (card.profileImage) {
      score += 10;
    } else {
      tips.push('Upload a professional profile photo. Cards with faces build 80% higher trust and network conversion rates.');
    }

    if (card.bio && card.bio.trim().length > 10) {
      score += 10;
    } else {
      tips.push('Write a short, compelling bio summarizing your professional focus and active pitch.');
    }

    if (card.resumeUrl) {
      score += 10;
    } else {
      tips.push('Add a link to your active Resume or CV. Recruiters browse resume links frequently.');
    }

    if (card.calendarUrl) {
      score += 10;
    } else {
      tips.push('Synchronize your calendar (e.g., Calendly link) so prospects can book direct meetings on your profile page.');
    }

    if (card.projects && card.projects.length > 0) {
      score += 5;
    } else {
      tips.push('Showcase 1-2 major projects in your portfolio to provide tangible evidence of your experience.');
    }

    if (card.testimonials && card.testimonials.length > 0) {
      score += 5;
    } else {
      tips.push('Incorporate client testimonials or reviews on your card to establish strong social proof.');
    }

    return {
      score: Math.min(score, 100),
      tips: tips.length > 0 ? tips : ['Congratulations! Your smart card profile is fully optimized for maximum conversion.']
    };
  }
}
export default AISuggestionService;
