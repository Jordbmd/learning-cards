import { Request, Response } from 'express';
import { CreateUser } from '../../../application/usecases/CreateUser.js';
import { GetUser } from '../../../application/usecases/GetUser.js';
import { GetAllUsers } from '../../../application/usecases/GetAllUsers.js';
import { UpdateUser } from '../../../application/usecases/UpdateUser.js';
import { DeleteUser } from '../../../application/usecases/DeleteUser.js';
import { CheckQuizAvailability } from '../../../application/usecases/CheckQuizAvailability.js';
import { MarkQuizCompleted } from '../../../application/usecases/MarkQuizCompleted.js';

export class UserController {
  constructor(
    private readonly createUser: CreateUser,
    private readonly getUser: GetUser,
    private readonly getAllUsers: GetAllUsers,
    private readonly updateUser: UpdateUser,
    private readonly deleteUser: DeleteUser,
    private readonly checkQuizAvailabilityUseCase: CheckQuizAvailability,
    private readonly markQuizCompletedUseCase: MarkQuizCompleted
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, email } = req.body;

      if (!name || !email) {
        res.status(400).json({ error: 'Name and email are required' });
        return;
      }

      const user = await this.createUser.execute({ name, email });

      res.status(201).json({
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail(),
        createdAt: user.getCreatedAt(),
        updatedAt: user.getUpdatedAt()
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
        res.status(400).json({ error: 'User ID is required' });
        return;
      }

      const user = await this.getUser.execute(id);

      res.status(200).json({
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail(),
        createdAt: user.getCreatedAt(),
        updatedAt: user.getUpdatedAt()
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
      const users = await this.getAllUsers.execute();

      res.status(200).json(
        users.map(user => ({
          id: user.getId(),
          name: user.getName(),
          email: user.getEmail(),
          createdAt: user.getCreatedAt(),
          updatedAt: user.getUpdatedAt()
        }))
      );
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, email } = req.body;

      if (!id) {
        res.status(400).json({ error: 'User ID is required' });
        return;
      }

      const user = await this.updateUser.execute({
        userId: id,
        name,
        email
      });

      res.status(200).json({
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail(),
        createdAt: user.getCreatedAt(),
        updatedAt: user.getUpdatedAt()
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
        res.status(400).json({ error: 'User ID is required' });
        return;
      }

      await this.deleteUser.execute(id);

      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async checkQuizAvailability(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ error: 'User ID is required' });
        return;
      }

      const result = await this.checkQuizAvailabilityUseCase.execute(id);

      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async markQuizCompleted(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ error: 'User ID is required' });
        return;
      }

      await this.markQuizCompletedUseCase.execute(id);

      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
