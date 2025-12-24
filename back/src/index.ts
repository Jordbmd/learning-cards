import express, { Request, Response } from 'express';
import { InMemoryCardRepository } from './infrastructure/repositories/InMemoryCardRepository.js';
import { CreateCard } from './application/usecases/CreateCard.js';
import { CardController } from './interfaces/http/controllers/CardController.js';
import { createCardRoutes } from './interfaces/http/routes/cardRoutes.js';

export * from './domain/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const repository = new InMemoryCardRepository();
const createCard = new CreateCard(repository);
const cardController = new CardController(createCard);
const cardRoutes = createCardRoutes(cardController);

app.use('/api', cardRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
