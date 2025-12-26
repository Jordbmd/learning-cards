import User from '../../domain/entities/User.js';
import { IUserRepository } from '../../domain/repositories/IUserRepository.js';

export class InMemoryUserRepository implements IUserRepository {
  private users: Map<string, User> = new Map();

  async save(user: User): Promise<void> {
    this.users.set(user.getId(), user);
  }
}
