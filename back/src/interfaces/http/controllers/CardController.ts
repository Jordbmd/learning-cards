import { Request, Response } from 'express';
import { CreateCard } from '../../../application/usecases/CreateCard.js';
import { GetCard } from '../../../application/usecases/GetCard.js';
import { GetAllCards } from '../../../application/usecases/GetAllCards.js';

export class CardController {
  constructor(
    private readonly createCard: CreateCard,
    private readonly getCard: GetCard,
    private readonly getAllCards: GetAllCards
  ) {}

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

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const card = await this.getCard.execute(id);

      res.status(200).json({
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
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const cards = await this.getAllCards.execute();

      res.status(200).json(
        cards.map(card => ({
          id: card.getId(),
          question: card.getQuestion(),
          answer: card.getAnswer(),
          category: card.getCategory(),
          tags: card.getTags(),
          createdAt: card.getCreatedAt(),
          lastReviewedAt: card.getLastReviewedAt()
        }))
      );
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
