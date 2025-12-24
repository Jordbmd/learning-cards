import { Request, Response } from 'express';
import { CreateCard } from '../../../application/usecases/CreateCard.js';

export class CardController {
  constructor(private readonly createCard: CreateCard) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { question, answer, tags } = req.body;

      if (!question || !answer) {
        res.status(400).json({ error: 'Question and answer are required' });
        return;
      }

      const card = await this.createCard.execute({
        question,
        answer,
        tags
      });

      res.status(201).json({
        id: card.getId(),
        question: card.getQuestion(),
        answer: card.getAnswer(),
        category: card.getCategory(),
        tags: card.getTags(),
        createdAt: card.getCreatedAt(),
        lastReviewedAt: card.getLastReviewedAt()
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
