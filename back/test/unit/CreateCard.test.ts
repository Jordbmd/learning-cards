import { describe, it, expect, beforeEach } from 'vitest';
import { CreateCard } from '../../src/application/usecases/CreateCard.js';
import { InMemoryCardRepository } from '../../src/infrastructure/repositories/InMemoryCardRepository.js';
import { Category } from '../../src/domain/entities/Category.js';

describe('CreateCard', () => {
  let createCard: CreateCard;
  let repository: InMemoryCardRepository;

  beforeEach(() => {
    repository = new InMemoryCardRepository();
    createCard = new CreateCard(repository);
  });

  describe('execute', () => {
    it('should create a card with valid input', async () => {
      const input = {
        question: 'What is TypeScript?',
        answer: 'A typed superset of JavaScript'
      };

      const card = await createCard.execute(input);

      expect(card.getQuestion()).toBe('What is TypeScript?');
      expect(card.getAnswer()).toBe('A typed superset of JavaScript');
      expect(card.getCategory()).toBe(Category.FIRST);
      expect(card.getTag()).toBeUndefined();
      expect(card.getLastReviewedAt()).toBeNull();
      expect(card.getId()).toBeTruthy();
      expect(card.getCreatedAt()).toBeInstanceOf(Date);
    });

    it('should create a card with tag', async () => {
      const input = {
        question: 'What is JavaScript?',
        answer: 'A programming language',
        tag: 'programming'
      };

      const card = await createCard.execute(input);

      expect(card.getTag()).toBe('programming');
    });

    it('should save the card in repository', async () => {
      const input = {
        question: 'What is Node.js?',
        answer: 'A JavaScript runtime'
      };

      const card = await createCard.execute(input);
      const foundCard = await repository.findById(card.getId());

      expect(foundCard).toBeTruthy();
      expect(foundCard?.getQuestion()).toBe('What is Node.js?');
    });

    it('should generate unique IDs for different cards', async () => {
      const input1 = {
        question: 'Question 1',
        answer: 'Answer 1'
      };
      const input2 = {
        question: 'Question 2',
        answer: 'Answer 2'
      };

      const card1 = await createCard.execute(input1);
      const card2 = await createCard.execute(input2);

      expect(card1.getId() === card2.getId()).toBe(false);
    });

    it('should throw error when question is empty', async () => {
      const input = {
        question: '',
        answer: 'An answer'
      };

      await expect(createCard.execute(input)).rejects.toThrow('Card question is required');
    });

    it('should throw error when answer is empty', async () => {
      const input = {
        question: 'A question',
        answer: ''
      };

      await expect(createCard.execute(input)).rejects.toThrow('Card answer is required');
    });
  });
});
