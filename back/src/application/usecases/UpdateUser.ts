import User from '../../domain/entities/User.js';
import { IUserRepository } from '../../domain/repositories/IUserRepository.js';

export interface UpdateUserInput {
  userId: string;
  name?: string;
  email?: string;
}

export class UpdateUser {
  constructor(private readonly repository: IUserRepository) {}

  async execute(input: UpdateUserInput): Promise<User> {
    const user = await this.repository.findById(input.userId);

    if (!user) {
      throw new Error('User not found');
    }

    if (input.email && input.email !== user.getEmail()) {
      const existingUser = await this.repository.findByEmail(input.email);
      if (existingUser) {
        throw new Error('Email already exists');
      }
      user.updateEmail(input.email);
    }

    if (input.name) {
      user.updateName(input.name);
    }

    await this.repository.save(user);

    return user;
  }
}
