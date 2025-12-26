import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryCardRepository } from '../../src/infrastructure/repositories/InMemoryCardRepository.js';
import Card, { CardProps } from '../../src/domain/entities/Card.js';
import { Category } from '../../src/domain/entities/Category.js';

describe('InMemoryCardRepository', () => {
  let repository: InMemoryCardRepository;
  let validCardProps: CardProps;

  beforeEach(() => {
    repository = new InMemoryCardRepository();
    validCardProps = {
      id: '123',
      question: 'What is TypeScript?',
      answer: 'A typed superset of JavaScript',
      category: Category.FIRST,
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

      card.moveToCategory(Category.SECOND);
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

      card.moveToCategory(Category.THIRD);
      await repository.save(card);

      const foundCard = await repository.findById('123');
      expect(foundCard?.getCategory()).toBe(Category.THIRD);
    });
  });

  describe('findAll', () => {
    it('should return empty array when no cards exist', async () => {
      const cards = await repository.findAll();
      expect(cards).toEqual([]);
    });

    it('should return all saved cards', async () => {
      const card1 = new Card(validCardProps);
      const card2Props = {
        ...validCardProps,
        id: '456',
        question: 'What is JavaScript?',
        answer: 'A programming language'
      };
      const card2 = new Card(card2Props);

      await repository.save(card1);
      await repository.save(card2);

      const cards = await repository.findAll();
      expect(cards).toHaveLength(2);
      expect(cards.map(c => c.getId())).toContain('123');
      expect(cards.map(c => c.getId())).toContain('456');
    });

    it('should return updated cards', async () => {
      const card = new Card(validCardProps);
      await repository.save(card);

      card.moveToCategory(Category.FIFTH);
      await repository.save(card);

      const cards = await repository.findAll();
      expect(cards).toHaveLength(1);
      expect(cards[0]?.getCategory()).toBe(Category.FIFTH);
    });
  });

  describe('delete', () => {
    it('should delete an existing card', async () => {
      const card = new Card(validCardProps);
      await repository.save(card);

      await repository.delete('123');

      const foundCard = await repository.findById('123');
      expect(foundCard).toBeNull();
    });

    it('should do nothing when deleting non-existent card', async () => {
      await repository.delete('nonexistent');
      const cards = await repository.findAll();
      expect(cards).toEqual([]);
    });

    it('should only delete the specified card', async () => {
      const card1 = new Card(validCardProps);
      const card2Props = {
        ...validCardProps,
        id: '456',
        question: 'What is JavaScript?'
      };
      const card2 = new Card(card2Props);

      await repository.save(card1);
      await repository.save(card2);
      await repository.delete('123');

      const cards = await repository.findAll();
      expect(cards).toHaveLength(1);
      expect(cards[0]?.getId()).toBe('456');
    });
  });
});
