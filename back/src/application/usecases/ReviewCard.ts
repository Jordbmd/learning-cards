import Card from '../../domain/entities/Card.js';
import { ICardRepository } from '../../domain/repositories/ICardRepository.js';
import { Category } from '../../domain/entities/Category.js';

export interface ReviewCardInput {
  cardId: string;
  newCategory: Category;
}

export class ReviewCard {
  constructor(private readonly repository: ICardRepository) {}

  async execute(input: ReviewCardInput): Promise<Card> {
    const card = await this.repository.findById(input.cardId);
    
    if (!card) {
      throw new Error(`Card with id ${input.cardId} not found`);
    }

    card.moveToCategory(input.newCategory);
    await this.repository.save(card);

    return card;
  }
}
