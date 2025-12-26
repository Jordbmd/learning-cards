import Card from '../../domain/entities/Card.js';
import { ICardRepository } from '../../domain/repositories/ICardRepository.js';
import { Category } from '../../domain/entities/Category.js';

export class InMemoryCardRepository implements ICardRepository {
  private cards: Map<string, Card> = new Map();

  async save(card: Card): Promise<void> {
    this.cards.set(card.getId(), card);
  }

  async findById(id: string): Promise<Card | null> {
    return this.cards.get(id) || null;
  }

  async findAll(filters?: { category?: Category; tags?: string[]; fromDate?: Date; toDate?: Date }): Promise<Card[]> {
    let cards = Array.from(this.cards.values());

    if (filters?.category) {
      cards = cards.filter(card => card.getCategory() === filters.category);
    }

    if (filters?.tags && filters.tags.length > 0) {
      cards = cards.filter(card => 
        filters.tags!.some(tag => card.hasTag(tag))
      );
    }

    if (filters?.fromDate) {
      cards = cards.filter(card => card.getCreatedAt() >= filters.fromDate!);
    }

    if (filters?.toDate) {
      cards = cards.filter(card => card.getCreatedAt() <= filters.toDate!);
    }

    return cards;
  }

  async delete(id: string): Promise<void> {
    this.cards.delete(id);
  }
}
