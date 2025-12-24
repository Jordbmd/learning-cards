import { ICardRepository } from '../../domain/repositories/ICardRepository.js';

export class DeleteCard {
  constructor(private readonly repository: ICardRepository) {}

  async execute(cardId: string): Promise<void> {
    const card = await this.repository.findById(cardId);
    
    if (!card) {
      throw new Error(`Card with id ${cardId} not found`);
    }

    await this.repository.delete(cardId);
  }
}
