import { IUserRepository } from '../../domain/repositories/IUserRepository.js';

export class DeleteUser {
  constructor(private readonly repository: IUserRepository) {}

  async execute(id: string): Promise<void> {
    const user = await this.repository.findById(id);

    if (!user) {
      throw new Error('User not found');
    }

    await this.repository.delete(id);
  }
}
