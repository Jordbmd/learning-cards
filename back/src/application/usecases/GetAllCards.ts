import Card from '../../domain/entities/Card.js';
import { ICardRepository, CardFilters } from '../../domain/repositories/ICardRepository.js';

export class GetAllCards {
  constructor(private readonly repository: ICardRepository) {}

  async execute(filters?: CardFilters): Promise<Card[]> {
    return await this.repository.findAll(filters);
  }
}
