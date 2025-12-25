import { Router } from 'express';
import { CardController } from '../controllers/CardController.js';

export function createCardRoutes(cardController: CardController): Router {
  const router = Router();

  router.post('/cards', (req, res) => cardController.create(req, res));
  router.get('/cards/:id', (req, res) => cardController.getById(req, res));
  router.get('/cards', (req, res) => cardController.getAll(req, res));
  router.put('/cards/:id/review', (req, res) => cardController.review(req, res));

  return router;
}
