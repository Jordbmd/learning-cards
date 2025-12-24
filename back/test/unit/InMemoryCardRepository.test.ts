import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryCardRepository } from '../../src/infrastructure/repositories/InMemoryCardRepository.js';
import Card, { CardProps } from '../../src/domain/entities/Card.js';

describe('InMemoryCardRepository', () => {
  let repository: InMemoryCardRepository;
  let validCardProps: CardProps;

  beforeEach(() => {
    repository = new InMemoryCardRepository();
    validCardProps = {
      id: '123',
      question: 'What is TypeScript?',
      answer: 'A typed superset of JavaScript',
      category: 1,
      tags: ['programming', 'typescript'],
      createdAt: new Date('2024-01-01'),
      lastReviewedAt: null
    };
  });

  describe('save', () => {
    it('should save a card', async () => {
      const card = new Card(validCardProps);
      await repository.save(card);
    });

    it('should update an existing card when saving with same id', async () => {
      const card = new Card(validCardProps);
      await repository.save(card);

      card.moveToCategory(2);
      await repository.save(card);
    });
  });
});
