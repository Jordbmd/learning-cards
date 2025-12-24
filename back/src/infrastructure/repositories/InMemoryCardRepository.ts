import Card from '../../domain/entities/Card.js';
import { ICardRepository } from '../../domain/repositories/ICardRepository.js';

export class InMemoryCardRepository implements ICardRepository {
  private cards: Map<string, Card> = new Map();

  async save(card: Card): Promise<void> {
    this.cards.set(card.getId(), card);
  }

  async findById(id: string): Promise<Card | null> {
    return this.cards.get(id) || null;
  }

  async findAll(): Promise<Card[]> {
    return Array.from(this.cards.values());
  }

  async delete(id: string): Promise<void> {
    this.cards.delete(id);
  }
}
