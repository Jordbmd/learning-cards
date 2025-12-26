import { randomUUID } from 'crypto';
import User from '../../domain/entities/User.js';
import { IUserRepository } from '../../domain/repositories/IUserRepository.js';

export interface CreateUserInput {
  name: string;
  email: string;
}

export class CreateUser {
  constructor(private readonly repository: IUserRepository) {}

  async execute(input: CreateUserInput): Promise<User> {
    const now = new Date();
    const user = new User({
      id: randomUUID(),
      name: input.name,
      email: input.email,
      createdAt: now,
      updatedAt: now,
    });

    await this.repository.save(user);

    return user;
  }
}
