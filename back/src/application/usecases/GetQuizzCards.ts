import Card from '../../domain/entities/Card.js';
import { ICardRepository } from '../../domain/repositories/ICardRepository.js';
import { Category } from '../../domain/entities/Category.js';

export class GetQuizzCards {
  constructor(private readonly repository: ICardRepository) {}

  async execute(date?: Date): Promise<Card[]> {
    const quizzDate = date || new Date();
    const allCards = await this.repository.findAll();
    
    return allCards.filter(card => this.shouldIncludeInQuizz(card, quizzDate));
  }

  private shouldIncludeInQuizz(card: Card, quizzDate: Date): boolean {
    const category = card.getCategory();
    const lastReviewedAt = card.getLastReviewedAt();

    if (card.isDone()) {
      return false;
    }

    if (!lastReviewedAt) {
      return true;
    }

    const daysInterval = this.getDaysIntervalForCategory(category);
    
    const nextReviewDate = new Date(lastReviewedAt);
    nextReviewDate.setDate(nextReviewDate.getDate() + daysInterval);

    const normalizedQuizzDate = this.normalizeDate(quizzDate);
    const normalizedNextReviewDate = this.normalizeDate(nextReviewDate);

    return normalizedQuizzDate >= normalizedNextReviewDate;
  }

  private getDaysIntervalForCategory(category: Category): number {
    const intervals: Record<Category, number> = {
      [Category.FIRST]: 1,
      [Category.SECOND]: 2,
      [Category.THIRD]: 4,
      [Category.FOURTH]: 8,
      [Category.FIFTH]: 16,
      [Category.SIXTH]: 32,
      [Category.SEVENTH]: 64,
      [Category.DONE]: 0
    };
    
    return intervals[category] || 1;
  }

  private normalizeDate(date: Date): Date {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  }
}
