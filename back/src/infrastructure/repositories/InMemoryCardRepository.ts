import Card from '../../domain/entities/Card.js';
import { ICardRepository } from '../../domain/repositories/ICardRepository.js';

export class InMemoryCardRepository implements ICardRepository {
  private cards: Map<string, Card> = new Map();

  async save(card: Card): Promise<void> {
    this.cards.set(card.getId(), card);
  }
}
