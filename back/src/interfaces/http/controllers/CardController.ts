import { Request, Response } from 'express';
import { CreateCard } from '../../../application/usecases/CreateCard.js';
import { GetCard } from '../../../application/usecases/GetCard.js';
import { GetAllCards } from '../../../application/usecases/GetAllCards.js';
import { ReviewCard } from '../../../application/usecases/ReviewCard.js';
import { DeleteCard } from '../../../application/usecases/DeleteCard.js';
import { GetQuizzCards } from '../../../application/usecases/GetQuizzCards.js';
import { AnswerCard } from '../../../application/usecases/AnswerCard.js';
import { UpdateCard } from '../../../application/usecases/UpdateCard.js';

export class CardController {
  constructor(
    private readonly createCard: CreateCard,
    private readonly getCard: GetCard,
    private readonly getAllCards: GetAllCards,
    private readonly reviewCard: ReviewCard,
    private readonly deleteCard: DeleteCard,
    private readonly getQuizzCards: GetQuizzCards,
    private readonly answerCard: AnswerCard,
    private readonly updateCard: UpdateCard
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { question, answer, tag } = req.body;

      if (!question || !answer) {
        res.status(400).json({ error: 'Question and answer are required' });
        return;
      }

      const card = await this.createCard.execute({
        question,
        answer,
        tag
      });

      res.status(201).json({
        id: card.getId(),
        question: card.getQuestion(),
        answer: card.getAnswer(),
        category: card.getCategory(),
        tag: card.getTag()
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
      
      if (!id) {
        res.status(400).json({ error: 'Card ID is required' });
        return;
      }

      const card = await this.getCard.execute(id);

      res.status(200).json({
        id: card.getId(),
        question: card.getQuestion(),
        answer: card.getAnswer(),
        category: card.getCategory(),
        tag: card.getTag()
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
      const filters: any = {};

      if (req.query.category) {
        filters.category = parseInt(req.query.category as string);
      }

      if (req.query.tags) {
        filters.tags = (req.query.tags as string).split(',').map(t => t.trim());
      }

      if (req.query.fromDate) {
        filters.fromDate = new Date(req.query.fromDate as string);
      }

      if (req.query.toDate) {
        filters.toDate = new Date(req.query.toDate as string);
      }

      const cards = await this.getAllCards.execute(filters);

      res.status(200).json(
        cards.map(card => ({
          id: card.getId(),
          question: card.getQuestion(),
          answer: card.getAnswer(),
          category: card.getCategory(),
          tag: card.getTag()
        }))
      );
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getQuizz(req: Request, res: Response): Promise<void> {
    try {
      const dateParam = req.query.date as string | undefined;
      const date = dateParam ? new Date(dateParam) : undefined;

      const cards = await this.getQuizzCards.execute(date);

      res.status(200).json(
        cards.map(card => ({
          id: card.getId(),
          question: card.getQuestion(),
          answer: card.getAnswer(),
          category: card.getCategory(),
          tag: card.getTag()
        }))
      );
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async answer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { isValid } = req.body;

      if (!id) {
        res.status(400).json({ error: 'Card ID is required' });
        return;
      }

      if (typeof isValid !== 'boolean') {
        res.status(400).json({ error: 'isValid is required and must be a boolean' });
        return;
      }

      await this.answerCard.execute({
        cardId: id,
        isValid
      });

      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async review(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { newCategory } = req.body;

      if (!id) {
        res.status(400).json({ error: 'Card ID is required' });
        return;
      }

      if (!newCategory) {
        res.status(400).json({ error: 'newCategory is required' });
        return;
      }

      const card = await this.reviewCard.execute({
        cardId: id,
        newCategory
      });

      res.status(200).json({
        id: card.getId(),
        question: card.getQuestion(),
        answer: card.getAnswer(),
        category: card.getCategory(),
        tag: card.getTag()
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({ error: 'Card ID is required' });
        return;
      }

      await this.deleteCard.execute(id);

      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { question, answer, tag } = req.body;

      if (!id) {
        res.status(400).json({ error: 'Card ID is required' });
        return;
      }

      const card = await this.updateCard.execute({
        cardId: id,
        question,
        answer,
        tag
      });

      res.status(200).json({
        id: card.getId(),
        question: card.getQuestion(),
        answer: card.getAnswer(),
        category: card.getCategory(),
        tag: card.getTag()
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Card not found') {
          res.status(404).json({ error: error.message });
        } else {
          res.status(400).json({ error: error.message });
        }
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
