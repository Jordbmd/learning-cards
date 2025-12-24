import Card from '../entities/Card.js';

export interface ICardRepository {
  save(card: Card): Promise<void>;
  findById(id: string): Promise<Card | null>;
  findAll(): Promise<Card[]>;
}
