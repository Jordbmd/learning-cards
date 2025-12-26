import express, { Request, Response } from 'express';
import { PostgresCardRepository } from './infrastructure/repositories/PostgresCardRepository.js';
import { PostgresUserRepository } from './infrastructure/repositories/PostgresUserRepository.js';
import initDatabase from './infrastructure/database/initDatabase.js';
import { CreateCard } from './application/usecases/CreateCard.js';
import { GetCard } from './application/usecases/GetCard.js';
import { GetAllCards } from './application/usecases/GetAllCards.js';
import { ReviewCard } from './application/usecases/ReviewCard.js';
import { DeleteCard } from './application/usecases/DeleteCard.js';
import { GetQuizzCards } from './application/usecases/GetQuizzCards.js';
import { AnswerCard } from './application/usecases/AnswerCard.js';
import { UpdateCard } from './application/usecases/UpdateCard.js';
import { CreateUser } from './application/usecases/CreateUser.js';
import { GetUser } from './application/usecases/GetUser.js';
import { GetAllUsers } from './application/usecases/GetAllUsers.js';
import { UpdateUser } from './application/usecases/UpdateUser.js';
import { DeleteUser } from './application/usecases/DeleteUser.js';
import { CardController } from './interfaces/http/controllers/CardController.js';
import { UserController } from './interfaces/http/controllers/UserController.js';
import { createCardRoutes } from './interfaces/http/routes/cardRoutes.js';
import { createUserRoutes } from './interfaces/http/routes/userRoutes.js';

export * from './domain/index.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

const cardRepository = new PostgresCardRepository();
const createCard = new CreateCard(cardRepository);
const getCard = new GetCard(cardRepository);
const getAllCards = new GetAllCards(cardRepository);
const reviewCard = new ReviewCard(cardRepository);
const deleteCard = new DeleteCard(cardRepository);
const getQuizzCards = new GetQuizzCards(cardRepository);
const answerCard = new AnswerCard(cardRepository);
const updateCard = new UpdateCard(cardRepository);
const cardController = new CardController(createCard, getCard, getAllCards, reviewCard, deleteCard, getQuizzCards, answerCard, updateCard);
const cardRoutes = createCardRoutes(cardController);

const userRepository = new PostgresUserRepository();
const createUser = new CreateUser(userRepository);
const getUser = new GetUser(userRepository);
const getAllUsers = new GetAllUsers(userRepository);
const updateUser = new UpdateUser(userRepository);
const deleteUser = new DeleteUser(userRepository);
const userController = new UserController(createUser, getUser, getAllUsers, updateUser, deleteUser);
const userRoutes = createUserRoutes(userController);

app.use('/api', cardRoutes);
app.use('/api', userRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});


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
