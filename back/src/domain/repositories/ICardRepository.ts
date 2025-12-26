import Card from '../entities/Card.js';
import { Category } from '../entities/Category.js';

export interface CardFilters {
  category?: Category;
  tag?: string;
  fromDate?: Date;
  toDate?: Date;
}

export interface ICardRepository {
  save(card: Card): Promise<void>;
  findById(id: string): Promise<Card | null>;
  findAll(filters?: CardFilters): Promise<Card[]>;
  delete(id: string): Promise<void>;
}
