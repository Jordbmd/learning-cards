import Card from '../../domain/entities/Card.js';
import { ICardRepository } from '../../domain/repositories/ICardRepository.js';

export interface UpdateCardInput {
  cardId: string;
  question?: string;
  answer?: string;
  tag?: string;
}

export class UpdateCard {
  constructor(private readonly repository: ICardRepository) {}

  async execute(input: UpdateCardInput): Promise<Card> {
    const card = await this.repository.findById(input.cardId);

    if (!card) {
      throw new Error('Card not found');
    }

    if (input.question !== undefined) {
      card.updateQuestion(input.question);
    }

    if (input.answer !== undefined) {
      card.updateAnswer(input.answer);
    }

    await this.repository.save(card);

    return card;
  }
}
