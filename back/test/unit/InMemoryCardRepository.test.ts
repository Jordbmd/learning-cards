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

  describe('findById', () => {
    it('should return a card when it exists', async () => {
      const card = new Card(validCardProps);
      await repository.save(card);

      const foundCard = await repository.findById('123');
      expect(foundCard).toBeTruthy();
      expect(foundCard?.getId()).toBe('123');
      expect(foundCard?.getQuestion()).toBe('What is TypeScript?');
    });

    it('should return null when card does not exist', async () => {
      const foundCard = await repository.findById('nonexistent');
      expect(foundCard).toBeNull();
    });

    it('should return updated card after modification', async () => {
      const card = new Card(validCardProps);
      await repository.save(card);

      card.moveToCategory(3);
      await repository.save(card);

      const foundCard = await repository.findById('123');
      expect(foundCard?.getCategory()).toBe(3);
    });
  });
});
