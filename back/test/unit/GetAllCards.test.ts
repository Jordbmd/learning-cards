import { describe, it, expect, beforeEach } from 'vitest';
import { GetAllCards } from '../../src/application/usecases/GetAllCards.js';
import { CreateCard } from '../../src/application/usecases/CreateCard.js';
import { ReviewCard } from '../../src/application/usecases/ReviewCard.js';
import { InMemoryCardRepository } from '../../src/infrastructure/repositories/InMemoryCardRepository.js';
import { Category } from '../../src/domain/entities/Category.js';

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
        tag: 'programming'
      };

      await createCard.execute(input);

      const cards = await getAllCards.execute();
      expect(cards).toHaveLength(1);
      expect(cards[0]?.getQuestion()).toBe('What is Node.js?');
      expect(cards[0]?.getAnswer()).toBe('A JavaScript runtime');
      expect(cards[0]?.getTag()).toBe('programming');
      expect(cards[0]?.getCategory()).toBe(Category.FIRST);
    });

    it('should return multiple cards with different properties', async () => {
      const input1 = {
        question: 'Question 1',
        answer: 'Answer 1',
        tag: 'tag1'
      };
      const input2 = {
        question: 'Question 2',
        answer: 'Answer 2',
        tag: 'tag2'
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

  describe('execute with filters', () => {
    beforeEach(async () => {
      // Créer des cartes de test
      await createCard.execute({
        question: 'JavaScript Question',
        answer: 'JavaScript Answer',
        tag: 'javascript'
      });

      await createCard.execute({
        question: 'TypeScript Question',
        answer: 'TypeScript Answer',
        tag: 'frontend'
      });

      await createCard.execute({
        question: 'Node.js Question',
        answer: 'Node.js Answer',
        tag: 'backend'
      });
    });

    it('should filter cards by category', async () => {
      const allCards = await getAllCards.execute();
      const firstCardId = allCards[0]?.getId();

      if (firstCardId) {
        const reviewCard = new ReviewCard(repository);
        await reviewCard.execute({ cardId: firstCardId, newCategory: Category.SECOND });
      }

      const category2Cards = await getAllCards.execute({ category: Category.SECOND });
      expect(category2Cards).toHaveLength(1);
      expect(category2Cards[0]?.getCategory()).toBe(Category.SECOND);

      const category1Cards = await getAllCards.execute({ category: Category.FIRST });
      expect(category1Cards).toHaveLength(2);
    });

    it('should filter cards by single tag', async () => {
      const cards = await getAllCards.execute({ tag: 'javascript' });
      expect(cards).toHaveLength(1);
      expect(cards[0]?.getQuestion()).toBe('JavaScript Question');
    });

    it('should filter cards by multiple tags', async () => {
      const cards = await getAllCards.execute({ tag: 'frontend' });
      expect(cards).toHaveLength(1);
      
      const questions = cards.map(c => c.getQuestion());
      expect(questions).toContain('TypeScript Question');
    });

    it('should filter cards by backend tag', async () => {
      const cards = await getAllCards.execute({ tag: 'backend' });
      expect(cards).toHaveLength(1);
      expect(cards[0]?.getQuestion()).toBe('Node.js Question');
    });

    it('should filter cards by date range', async () => {
      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const cards = await getAllCards.execute({
        fromDate: yesterday,
        toDate: tomorrow
      });

      expect(cards).toHaveLength(3);
    });

    it('should filter cards from a specific date', async () => {
      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);

      const cards = await getAllCards.execute({
        fromDate: yesterday
      });

      expect(cards).toHaveLength(3);
    });

    it('should return empty array when filtering with future date', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const cards = await getAllCards.execute({
        fromDate: tomorrow
      });

      expect(cards).toHaveLength(0);
    });

    it('should combine category and tag filters', async () => {
      const allCards = await getAllCards.execute();
      const firstCardId = allCards[0]?.getId();

      if (firstCardId) {
        const reviewCard = new ReviewCard(repository);
        await reviewCard.execute({ cardId: firstCardId, newCategory: Category.THIRD });
      }

      const cards = await getAllCards.execute({
        category: Category.THIRD,
        tag: 'javascript'
      });

      expect(cards).toHaveLength(1);
      expect(cards[0]?.getCategory()).toBe(Category.THIRD);
      expect(cards[0]?.getTag()).toBe('javascript');
    });

    it('should return all cards when no filters provided', async () => {
      const cards = await getAllCards.execute({});
      expect(cards).toHaveLength(3);
    });

    it('should return empty array when no cards match filters', async () => {
      const cards = await getAllCards.execute({ tag: 'nonexistent' });
      expect(cards).toHaveLength(0);
    });
  });
});
