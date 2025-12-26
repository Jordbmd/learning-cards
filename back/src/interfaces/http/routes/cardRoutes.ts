import { Router } from 'express';
import { CardController } from '../controllers/CardController.js';

export function createCardRoutes(cardController: CardController): Router {
  const router = Router();

  router.post('/cards', (req, res) => cardController.create(req, res));
  router.get('/cards/quizz', (req, res) => cardController.getQuizz(req, res));
  router.get('/cards', (req, res) => cardController.getAll(req, res));
  router.patch('/cards/:id/answer', (req, res) => cardController.answer(req, res));

  return router;
}
