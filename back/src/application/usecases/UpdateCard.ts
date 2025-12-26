import Card from '../../domain/entities/Card.js';
import { ICardRepository } from '../../domain/repositories/ICardRepository.js';

export interface UpdateCardInput {
  cardId: string;
  question?: string;
  answer?: string;
  tags?: string[];
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

    if (input.tags !== undefined) {
      const currentTags = card.getTags();
      currentTags.forEach(tag => card.removeTag(tag));
      input.tags.forEach(tag => {
        if (tag.trim()) {
          card.addTag(tag.trim());
        }
      });
    }

    await this.repository.save(card);

    return card;
  }
}
