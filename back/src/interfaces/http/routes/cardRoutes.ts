import { Router } from 'express';
import { CardController } from '../controllers/CardController.js';

export function createCardRoutes(cardController: CardController): Router {
  const router = Router();

  router.post('/cards', (req, res) => cardController.create(req, res));

  return router;
}
