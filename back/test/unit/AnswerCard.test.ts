import { describe, it, expect, beforeEach } from 'vitest';
import { AnswerCard } from '../../src/application/usecases/AnswerCard.js';
import { InMemoryCardRepository } from '../../src/infrastructure/repositories/InMemoryCardRepository.js';
import Card from '../../src/domain/entities/Card.js';
import { Category } from '../../src/domain/entities/Category.js';

describe('AnswerCard', () => {
  let answerCard: AnswerCard;
  let repository: InMemoryCardRepository;

  beforeEach(() => {
    repository = new InMemoryCardRepository();
    answerCard = new AnswerCard(repository);
  });

  describe('execute', () => {
    it('should move card to next category when answer is correct', async () => {
      const card = new Card({
        id: '1',
        question: 'Question 1',
        answer: 'Answer 1',
        category: Category.FIRST,
        tags: [],
        createdAt: new Date(),
        lastReviewedAt: null
      });
      
      await repository.save(card);
      const result = await answerCard.execute({ cardId: '1', isValid: true });

      expect(result.getCategory()).toBe(Category.SECOND);
      expect(result.getLastReviewedAt()).toBeTruthy();
    });

    it('should reset card to category 1 when answer is incorrect', async () => {
      const card = new Card({
        id: '1',
        question: 'Question 1',
        answer: 'Answer 1',
        category: Category.THIRD,
        tags: [],
        createdAt: new Date(),
        lastReviewedAt: new Date()
      });
      
      await repository.save(card);
      const result = await answerCard.execute({ cardId: '1', isValid: false });

      expect(result.getCategory()).toBe(Category.FIRST);
    });

    it('should move card from category 7 to category 8 when answer is correct', async () => {
      const card = new Card({
        id: '1',
        question: 'Question 1',
        answer: 'Answer 1',
        category: Category.SEVENTH,
        tags: [],
        createdAt: new Date(),
        lastReviewedAt: new Date()
      });
      
      await repository.save(card);
      const result = await answerCard.execute({ cardId: '1', isValid: true });

      expect(result.getCategory()).toBe(8);
      expect(result.isDone()).toBe(true);
    });

    it('should reset card from category 7 to category 1 when answer is incorrect', async () => {
      const card = new Card({
        id: '1',
        question: 'Question 1',
        answer: 'Answer 1',
        category: Category.SEVENTH,
        tags: [],
        createdAt: new Date(),
        lastReviewedAt: new Date()
      });
      
      await repository.save(card);
      const result = await answerCard.execute({ cardId: '1', isValid: false });

      expect(result.getCategory()).toBe(Category.FIRST);
    });

    it('should throw error when card is not found', async () => {
      await expect(
        answerCard.execute({ cardId: 'non-existent', isValid: true })
      ).rejects.toThrow('Card with id non-existent not found');
    });

    it('should persist the updated card in repository', async () => {
      const card = new Card({
        id: '1',
        question: 'Question 1',
        answer: 'Answer 1',
        category: Category.SECOND,
        tags: [],
        createdAt: new Date(),
        lastReviewedAt: null
      });
      
      await repository.save(card);
      await answerCard.execute({ cardId: '1', isValid: true });
      
      const savedCard = await repository.findById('1');
      expect(savedCard?.getCategory()).toBe(Category.THIRD);
    });

    it('should handle multiple incorrect answers correctly', async () => {
      const card = new Card({
        id: '1',
        question: 'Question 1',
        answer: 'Answer 1',
        category: Category.FIFTH,
        tags: [],
        createdAt: new Date(),
        lastReviewedAt: new Date()
      });
      
      await repository.save(card);
      await answerCard.execute({ cardId: '1', isValid: false });
      const result = await answerCard.execute({ cardId: '1', isValid: false });

      expect(result.getCategory()).toBe(Category.FIRST);
    });

    it('should handle category progression through multiple correct answers', async () => {
      const card = new Card({
        id: '1',
        question: 'Question 1',
        answer: 'Answer 1',
        category: Category.FIRST,
        tags: [],
        createdAt: new Date(),
        lastReviewedAt: null
      });
      
      await repository.save(card);
      
      await answerCard.execute({ cardId: '1', isValid: true });
      await answerCard.execute({ cardId: '1', isValid: true });
      const result = await answerCard.execute({ cardId: '1', isValid: true });

      expect(result.getCategory()).toBe(Category.FOURTH);
    });
  });
});
