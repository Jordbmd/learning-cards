import { IUserRepository } from '../../domain/repositories/IUserRepository.js';

export interface CheckQuizAvailabilityOutput {
  canDoQuiz: boolean;
  lastQuizDate: Date | null;
}

export class CheckQuizAvailability {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<CheckQuizAvailabilityOutput> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return {
      canDoQuiz: !user.hasCompletedQuizToday(),
      lastQuizDate: user.getLastQuizDate(),
    };
  }
}
