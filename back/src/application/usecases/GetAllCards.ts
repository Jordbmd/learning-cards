import Card from '../../domain/entities/Card.js';
import { ICardRepository } from '../../domain/repositories/ICardRepository.js';

export class GetAllCards {
  constructor(private readonly repository: ICardRepository) {}

  async execute(): Promise<Card[]> {
    return await this.repository.findAll();
  }
}
