import Card from '../../domain/entities/Card.js';
import { ICardRepository } from '../../domain/repositories/ICardRepository.js';

export interface AnswerCardInput {
  cardId: string;
  isValid: boolean;
}

export class AnswerCard {
  constructor(private readonly repository: ICardRepository) {}

  async execute(input: AnswerCardInput): Promise<Card> {
    const card = await this.repository.findById(input.cardId);
    
    if (!card) {
      throw new Error(`Card with id ${input.cardId} not found`);
    }

    if (input.isValid) {
      card.answerCorrectly();
    } else {
      card.answerIncorrectly();
    }

    await this.repository.save(card);

    return card;
  }
}
