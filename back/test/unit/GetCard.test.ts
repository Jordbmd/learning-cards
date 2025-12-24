import { describe, it, expect, beforeEach } from 'vitest';
import { GetCard } from '../../src/application/usecases/GetCard.js';
import { CreateCard } from '../../src/application/usecases/CreateCard.js';
import { InMemoryCardRepository } from '../../src/infrastructure/repositories/InMemoryCardRepository.js';

describe('GetCard', () => {
  let getCard: GetCard;
  let createCard: CreateCard;
  let repository: InMemoryCardRepository;

  beforeEach(() => {
    repository = new InMemoryCardRepository();
    getCard = new GetCard(repository);
    createCard = new CreateCard(repository);
  });

  describe('execute', () => {
    it('should return a card when it exists', async () => {
      const input = {
        question: 'What is TypeScript?',
        answer: 'A typed superset of JavaScript'
      };

      const createdCard = await createCard.execute(input);
      const foundCard = await getCard.execute(createdCard.getId());

      expect(foundCard.getId()).toBe(createdCard.getId());
      expect(foundCard.getQuestion()).toBe('What is TypeScript?');
      expect(foundCard.getAnswer()).toBe('A typed superset of JavaScript');
    });

    it('should throw error when card does not exist', async () => {
      await expect(getCard.execute('nonexistent-id')).rejects.toThrow('Card with id nonexistent-id not found');
    });

    it('should return card with all its properties', async () => {
      const input = {
        question: 'What is JavaScript?',
        answer: 'A programming language',
        tags: ['programming', 'javascript']
      };

      const createdCard = await createCard.execute(input);
      const foundCard = await getCard.execute(createdCard.getId());

      expect(foundCard.getQuestion()).toBe('What is JavaScript?');
      expect(foundCard.getAnswer()).toBe('A programming language');
      expect(foundCard.getTags()).toEqual(['programming', 'javascript']);
      expect(foundCard.getCategory()).toBe(1);
      expect(foundCard.getLastReviewedAt()).toBeNull();
    });
  });
});
