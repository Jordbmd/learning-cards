import { Router } from 'express';
import { UserController } from '../controllers/UserController.js';

export function createUserRoutes(userController: UserController): Router {
  const router = Router();

  router.post('/users', (req, res) => userController.create(req, res));
  router.get('/users/:id', (req, res) => userController.getById(req, res));
  router.get('/users', (req, res) => userController.getAll(req, res));
  router.put('/users/:id', (req, res) => userController.update(req, res));
  router.delete('/users/:id', (req, res) => userController.delete(req, res));
  router.get('/users/:id/quiz/availability', (req, res) => userController.checkQuizAvailability(req, res));
  router.post('/users/:id/quiz/complete', (req, res) => userController.markQuizCompleted(req, res));

  return router;
}
