import Card from '../../domain/entities/Card.js';
import { ICardRepository } from '../../domain/repositories/ICardRepository.js';

export class GetCard {
  constructor(private readonly repository: ICardRepository) {}

  async execute(id: string): Promise<Card> {
    const card = await this.repository.findById(id);
    
    if (!card) {
      throw new Error(`Card with id ${id} not found`);
    }

    return card;
  }
}
