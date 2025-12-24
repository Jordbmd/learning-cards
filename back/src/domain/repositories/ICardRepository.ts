import Card from '../entities/Card.js';

export interface ICardRepository {
  save(card: Card): Promise<void>;
}
