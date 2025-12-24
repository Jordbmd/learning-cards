import { randomUUID } from 'crypto';
import Card from '../../domain/entities/Card.js';
import { ICardRepository } from '../../domain/repositories/ICardRepository.js';

export interface CreateCardInput {
  question: string;
  answer: string;
  tags?: string[];
}

export class CreateCard {
  constructor(private readonly repository: ICardRepository) {}

  async execute(input: CreateCardInput): Promise<Card> {
    const card = new Card({
      id: randomUUID(),
      question: input.question,
      answer: input.answer,
      category: 1,
      tags: input.tags || [],
      createdAt: new Date(),
      lastReviewedAt: null
    });

    await this.repository.save(card);
    return card;
  }
}
