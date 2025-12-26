import User from '../../domain/entities/User.js';
import { IUserRepository } from '../../domain/repositories/IUserRepository.js';

export class GetUser {
  constructor(private readonly repository: IUserRepository) {}

  async execute(id: string): Promise<User> {
    const user = await this.repository.findById(id);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}
