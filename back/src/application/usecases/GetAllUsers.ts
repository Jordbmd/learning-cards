import User from '../../domain/entities/User.js';
import { IUserRepository } from '../../domain/repositories/IUserRepository.js';

export class GetAllUsers {
  constructor(private readonly repository: IUserRepository) {}

  async execute(): Promise<User[]> {
    return await this.repository.findAll();
  }
}
