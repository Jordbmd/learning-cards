import { describe, it, expect, beforeEach } from 'vitest';
import { GetQuizzCards } from '../../src/application/usecases/GetQuizzCards.js';
import { InMemoryCardRepository } from '../../src/infrastructure/repositories/InMemoryCardRepository.js';
import Card from '../../src/domain/entities/Card.js';
import { Category } from '../../src/domain/entities/Category.js';

describe('GetQuizzCards', () => {
  let getQuizzCards: GetQuizzCards;
  let repository: InMemoryCardRepository;

  beforeEach(() => {
    repository = new InMemoryCardRepository();
    getQuizzCards = new GetQuizzCards(repository);
  });

  describe('execute', () => {
    it('should exclude cards in category 7', async () => {
      const card = new Card({
        id: '1',
        question: 'Question 1',
        answer: 'Answer 1',
        category: Category.SEVENTH,
        createdAt: new Date(),
        lastReviewedAt: new Date()
      });
      
      await repository.save(card);
      const quizzCards = await getQuizzCards.execute(new Date());

      expect(quizzCards).toHaveLength(0);
    });

    it('should include category 1 card after 1 day', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const card = new Card({
        id: '1',
        question: 'Question 1',
        answer: 'Answer 1',
        category: Category.FIRST,
        createdAt: new Date(),
        lastReviewedAt: yesterday
      });
      
      await repository.save(card);
      const quizzCards = await getQuizzCards.execute(new Date());

      expect(quizzCards).toHaveLength(1);
    });

    it('should exclude category 1 card before 1 day has passed', async () => {
      const today = new Date();

      const card = new Card({
        id: '1',
        question: 'Question 1',
        answer: 'Answer 1',
        category: Category.FIRST,
        createdAt: new Date(),
        lastReviewedAt: today
      });
      
      await repository.save(card);
      const quizzCards = await getQuizzCards.execute(today);

      expect(quizzCards).toHaveLength(0);
    });

    it('should include category 2 card after 2 days', async () => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      const card = new Card({
        id: '1',
        question: 'Question 1',
        answer: 'Answer 1',
        category: Category.SECOND,
        createdAt: new Date(),
        lastReviewedAt: twoDaysAgo
      });
      
      await repository.save(card);
      const quizzCards = await getQuizzCards.execute(new Date());

      expect(quizzCards).toHaveLength(1);
    });

    it('should include category 4 card after 8 days', async () => {
      const eightDaysAgo = new Date();
      eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);

      const card = new Card({
        id: '1',
        question: 'Question 1',
        answer: 'Answer 1',
        category: Category.FOURTH,
        createdAt: new Date(),
        lastReviewedAt: eightDaysAgo
      });
      
      await repository.save(card);
      const quizzCards = await getQuizzCards.execute(new Date());

      expect(quizzCards).toHaveLength(1);
    });

    it('should filter cards based on correct intervals for multiple categories', async () => {
      const today = new Date();
      const oneDayAgo = new Date(today);
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      const twoDaysAgo = new Date(today);
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      const card1 = new Card({
        id: '1',
        question: 'Question 1',
        answer: 'Answer 1',
        category: Category.FIRST,
        createdAt: new Date(),
        lastReviewedAt: oneDayAgo
      });

      const card2 = new Card({
        id: '2',
        question: 'Question 2',
        answer: 'Answer 2',
        category: Category.SECOND,
        createdAt: new Date(),
        lastReviewedAt: today
      });

      const card3 = new Card({
        id: '3',
        question: 'Question 3',
        answer: 'Answer 3',
        category: Category.SECOND,
        createdAt: new Date(),
        lastReviewedAt: twoDaysAgo
      });

      await repository.save(card1);
      await repository.save(card2);
      await repository.save(card3);

      const quizzCards = await getQuizzCards.execute(today);

      expect(quizzCards).toHaveLength(2);
      expect(quizzCards.map(c => c.getId())).toContain('1');
      expect(quizzCards.map(c => c.getId())).toContain('3');
    });

    it('should use current date when no date parameter provided', async () => {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const card = new Card({
        id: '1',
        question: 'Question 1',
        answer: 'Answer 1',
        category: Category.FIRST,
        createdAt: new Date(),
        lastReviewedAt: oneDayAgo
      });
      
      await repository.save(card);
      const quizzCards = await getQuizzCards.execute();

      expect(quizzCards).toHaveLength(1);
    });
  });
});
