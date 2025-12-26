import express, { Request, Response } from 'express';
import { PostgresCardRepository } from './infrastructure/repositories/PostgresCardRepository.js';
import initDatabase from './infrastructure/database/initDatabase.js';
import { CreateCard } from './application/usecases/CreateCard.js';
import { GetCard } from './application/usecases/GetCard.js';
import { GetAllCards } from './application/usecases/GetAllCards.js';
import { ReviewCard } from './application/usecases/ReviewCard.js';
import { DeleteCard } from './application/usecases/DeleteCard.js';
import { GetQuizzCards } from './application/usecases/GetQuizzCards.js';
import { AnswerCard } from './application/usecases/AnswerCard.js';
import { CardController } from './interfaces/http/controllers/CardController.js';
import { createCardRoutes } from './interfaces/http/routes/cardRoutes.js';

export * from './domain/index.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

const repository = new PostgresCardRepository();
const createCard = new CreateCard(repository);
const getCard = new GetCard(repository);
const getAllCards = new GetAllCards(repository);
const reviewCard = new ReviewCard(repository);
const deleteCard = new DeleteCard(repository);
const getQuizzCards = new GetQuizzCards(repository);
const answerCard = new AnswerCard(repository);
const cardController = new CardController(createCard, getCard, getAllCards, reviewCard, deleteCard, getQuizzCards, answerCard);
const cardRoutes = createCardRoutes(cardController);

app.use('/api', cardRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Initialize database and start server
initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
