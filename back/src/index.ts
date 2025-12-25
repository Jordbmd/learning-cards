import express, { Request, Response } from 'express';
import { InMemoryCardRepository } from './infrastructure/repositories/InMemoryCardRepository.js';
import { CreateCard } from './application/usecases/CreateCard.js';
import { GetCard } from './application/usecases/GetCard.js';
import { GetAllCards } from './application/usecases/GetAllCards.js';
import { ReviewCard } from './application/usecases/ReviewCard.js';
import { CardController } from './interfaces/http/controllers/CardController.js';
import { createCardRoutes } from './interfaces/http/routes/cardRoutes.js';

export * from './domain/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const repository = new InMemoryCardRepository();
const createCard = new CreateCard(repository);
const getCard = new GetCard(repository);
const getAllCards = new GetAllCards(repository);
const reviewCard = new ReviewCard(repository);
const cardController = new CardController(createCard, getCard, getAllCards, reviewCard);
const cardRoutes = createCardRoutes(cardController);

app.use('/api', cardRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
