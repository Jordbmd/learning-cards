import { IUserRepository } from '../../domain/repositories/IUserRepository.js';

export class MarkQuizCompleted {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    user.markQuizCompleted();
    await this.userRepository.save(user);
  }
}
