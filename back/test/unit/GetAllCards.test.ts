import { describe, it, expect, beforeEach } from 'vitest';
import { GetAllCards } from '../../src/application/usecases/GetAllCards.js';
import { CreateCard } from '../../src/application/usecases/CreateCard.js';
import { InMemoryCardRepository } from '../../src/infrastructure/repositories/InMemoryCardRepository.js';

describe('GetAllCards', () => {
  let getAllCards: GetAllCards;
  let createCard: CreateCard;
  let repository: InMemoryCardRepository;

  beforeEach(() => {
    repository = new InMemoryCardRepository();
    getAllCards = new GetAllCards(repository);
    createCard = new CreateCard(repository);
  });

  describe('execute', () => {
    it('should return empty array when no cards exist', async () => {
      const cards = await getAllCards.execute();
      expect(cards).toEqual([]);
    });

    it('should return all cards', async () => {
      const input1 = {
        question: 'What is TypeScript?',
        answer: 'A typed superset of JavaScript'
      };
      const input2 = {
        question: 'What is JavaScript?',
        answer: 'A programming language'
      };

      await createCard.execute(input1);
      await createCard.execute(input2);

      const cards = await getAllCards.execute();
      expect(cards).toHaveLength(2);
    });

    it('should return cards with all their properties', async () => {
      const input = {
        question: 'What is Node.js?',
        answer: 'A JavaScript runtime',
        tags: ['programming', 'nodejs']
      };

      await createCard.execute(input);

      const cards = await getAllCards.execute();
      expect(cards).toHaveLength(1);
      expect(cards[0]?.getQuestion()).toBe('What is Node.js?');
      expect(cards[0]?.getAnswer()).toBe('A JavaScript runtime');
      expect(cards[0]?.getTags()).toEqual(['programming', 'nodejs']);
      expect(cards[0]?.getCategory()).toBe(1);
    });

    it('should return multiple cards with different properties', async () => {
      const input1 = {
        question: 'Question 1',
        answer: 'Answer 1',
        tags: ['tag1']
      };
      const input2 = {
        question: 'Question 2',
        answer: 'Answer 2',
        tags: ['tag2', 'tag3']
      };
      const input3 = {
        question: 'Question 3',
        answer: 'Answer 3'
      };

      await createCard.execute(input1);
      await createCard.execute(input2);
      await createCard.execute(input3);

      const cards = await getAllCards.execute();
      expect(cards).toHaveLength(3);
      
      const questions = cards.map(c => c.getQuestion());
      expect(questions).toContain('Question 1');
      expect(questions).toContain('Question 2');
      expect(questions).toContain('Question 3');
    });
  });
});
