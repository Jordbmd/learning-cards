import Card from '../../domain/entities/Card.js';
import { ICardRepository } from '../../domain/repositories/ICardRepository.js';

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

    // Nouvelle carte (jamais révisée) : toujours incluse
    if (!lastReviewedAt) {
      return true;
    }

    // Carte en catégorie 7 (DONE) : exclue du quizz
    if (card.isInFinalCategory()) {
      return false;
    }

    // Calcul du nombre de jours selon la catégorie (système de Leitner)
    const daysInterval = this.getDaysIntervalForCategory(category);
    
    // Calcul de la prochaine date de révision
    const nextReviewDate = new Date(lastReviewedAt);
    nextReviewDate.setDate(nextReviewDate.getDate() + daysInterval);

    // Normaliser les dates pour comparer uniquement jour/mois/année
    const normalizedQuizzDate = this.normalizeDate(quizzDate);
    const normalizedNextReviewDate = this.normalizeDate(nextReviewDate);

    // Inclure si la date du quizz est >= à la prochaine date de révision
    return normalizedQuizzDate >= normalizedNextReviewDate;
  }

  private getDaysIntervalForCategory(category: number): number {
    // Système de Leitner : 1, 2, 4, 8, 16, 32, 64 jours
    const intervals: { [key: number]: number } = {
      1: 1,
      2: 2,
      3: 4,
      4: 8,
      5: 16,
      6: 32,
      7: 64
    };
    
    return intervals[category] || 1;
  }

  private normalizeDate(date: Date): Date {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  }
}
