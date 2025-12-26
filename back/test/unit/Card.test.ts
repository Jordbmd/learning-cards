import { describe, it, expect, beforeEach } from 'vitest';
import Card, { CardProps } from '../../src/domain/entities/Card.js';
import { Category } from '../../src/domain/entities/Category.js';

describe('Card', () => {
  let validProps: CardProps;

  beforeEach(() => {
    validProps = {
      id: '123',
      question: 'What is TypeScript?',
      answer: 'A typed superset of JavaScript',
      category: Category.FIRST,
      tag: 'programming',
      createdAt: new Date('2024-01-01'),
      lastReviewedAt: null
    };
  });

  describe('constructor', () => {
    it('should create a card with valid props', () => {
      const card = new Card(validProps);
      expect(card.getId()).toBe('123');
      expect(card.getQuestion()).toBe('What is TypeScript?');
      expect(card.getAnswer()).toBe('A typed superset of JavaScript');
      expect(card.getCategory()).toBe(Category.FIRST);
      expect(card.getTag()).toBe('programming');
    });

    it('should throw error when id is empty', () => {
      const invalidProps = { ...validProps, id: '' };
      expect(() => new Card(invalidProps)).toThrow('Card id is required');
    });

    it('should throw error when id is whitespace', () => {
      const invalidProps = { ...validProps, id: '   ' };
      expect(() => new Card(invalidProps)).toThrow('Card id is required');
    });

    it('should throw error when question is empty', () => {
      const invalidProps = { ...validProps, question: '' };
      expect(() => new Card(invalidProps)).toThrow('Card question is required');
    });

    it('should throw error when answer is empty', () => {
      const invalidProps = { ...validProps, answer: '' };
      expect(() => new Card(invalidProps)).toThrow('Card answer is required');
    });
  });

  describe('getters', () => {
    it('should return correct id', () => {
      const card = new Card(validProps);
      expect(card.getId()).toBe('123');
    });

    it('should return correct question', () => {
      const card = new Card(validProps);
      expect(card.getQuestion()).toBe('What is TypeScript?');
    });

    it('should return correct answer', () => {
      const card = new Card(validProps);
      expect(card.getAnswer()).toBe('A typed superset of JavaScript');
    });

    it('should return correct category', () => {
      const card = new Card(validProps);
      expect(card.getCategory()).toBe(Category.FIRST);
    });

    it('should return correct tag', () => {
      const card = new Card(validProps);
      expect(card.getTag()).toBe('programming');
    });

    it('should return correct createdAt date', () => {
      const card = new Card(validProps);
      expect(card.getCreatedAt()).toEqual(new Date('2024-01-01'));
    });

    it('should return null for lastReviewedAt when not reviewed', () => {
      const card = new Card(validProps);
      expect(card.getLastReviewedAt()).toBeNull();
    });

    it('should return correct lastReviewedAt when reviewed', () => {
      const reviewedDate = new Date('2024-06-01');
      const props = { ...validProps, lastReviewedAt: reviewedDate };
      const card = new Card(props);
      expect(card.getLastReviewedAt()).toEqual(reviewedDate);
    });
  });

  describe('moveToCategory', () => {
    it('should move card to new category', () => {
      const card = new Card(validProps);
      card.moveToCategory(Category.THIRD);
      expect(card.getCategory()).toBe(Category.THIRD);
    });

    it('should update lastReviewedAt when moving category', () => {
      const card = new Card(validProps);
      const beforeMove = new Date();
      card.moveToCategory(Category.SECOND);
      const afterMove = new Date();
      
      const lastReviewed = card.getLastReviewedAt();
      expect(lastReviewed).toBeTruthy();
      expect(lastReviewed!.getTime()).toBeGreaterThanOrEqual(beforeMove.getTime());
      expect(lastReviewed!.getTime()).toBeLessThanOrEqual(afterMove.getTime());
    });
  });

  describe('resetToCategory1', () => {
    it('should reset card to category 1', () => {
      const props = { ...validProps, category: Category.FIFTH };
      const card = new Card(props);
      card.resetToCategory1();
      expect(card.getCategory()).toBe(Category.FIRST);
    });

    it('should update lastReviewedAt when resetting', () => {
      const card = new Card(validProps);
      const beforeReset = new Date();
      card.resetToCategory1();
      const afterReset = new Date();
      
      const lastReviewed = card.getLastReviewedAt();
      expect(lastReviewed).toBeTruthy();
      expect(lastReviewed!.getTime()).toBeGreaterThanOrEqual(beforeReset.getTime());
      expect(lastReviewed!.getTime()).toBeLessThanOrEqual(afterReset.getTime());
    });
  });



  describe('isInFinalCategory', () => {
    it('should return true when card is in category 7', () => {
      const props = { ...validProps, category: Category.SEVENTH };
      const card = new Card(props);
      expect(card.isInFinalCategory()).toBe(true);
    });

    it('should return false when card is not in category 7', () => {
      const card = new Card(validProps);
      expect(card.isInFinalCategory()).toBe(false);
    });
  });

  describe('answerCorrectly', () => {
    it('should move card from category 1 to category 2', () => {
      const card = new Card(validProps);
      card.answerCorrectly();
      expect(card.getCategory()).toBe(Category.SECOND);
      expect(card.getLastReviewedAt()).toBeTruthy();
    });

    it('should move card from category 6 to category 7', () => {
      const props = { ...validProps, category: Category.SIXTH };
      const card = new Card(props);
      card.answerCorrectly();
      expect(card.getCategory()).toBe(Category.SEVENTH);
    });

    it('should move card from category 7 to category 8 (DONE)', () => {
      const props = { ...validProps, category: Category.SEVENTH };
      const card = new Card(props);
      card.answerCorrectly();
      expect(card.getCategory()).toBe(Category.DONE);
      expect(card.isDone()).toBe(true);
    });

    it('should keep card in category 8 if already done', () => {
      const props = { ...validProps, category: Category.DONE };
      const card = new Card(props);
      card.answerCorrectly();
      expect(card.getCategory()).toBe(Category.DONE);
    });
  });

  describe('answerIncorrectly', () => {
    it('should reset card to category 1 from category 3', () => {
      const props = { ...validProps, category: Category.THIRD };
      const card = new Card(props);
      card.answerIncorrectly();
      expect(card.getCategory()).toBe(Category.FIRST);
      expect(card.getLastReviewedAt()).toBeTruthy();
    });

    it('should reset card to category 1 from category 7', () => {
      const props = { ...validProps, category: Category.SEVENTH };
      const card = new Card(props);
      card.answerIncorrectly();
      expect(card.getCategory()).toBe(Category.FIRST);
    });

    it('should keep card in category 1 if already there', () => {
      const card = new Card(validProps);
      card.answerIncorrectly();
      expect(card.getCategory()).toBe(Category.FIRST);
    });
  });

  describe('isDone', () => {
    it('should return true when card is in category 8', () => {
      const props = { ...validProps, category: Category.DONE };
      const card = new Card(props);
      expect(card.isDone()).toBe(true);
    });

    it('should return false when card is not in category 8', () => {
      const card = new Card(validProps);
      expect(card.isDone()).toBe(false);
    });
  });

  describe('updateQuestion', () => {
    it('should update question with valid value', () => {
      const card = new Card(validProps);
      card.updateQuestion('What is JavaScript?');
      expect(card.getQuestion()).toBe('What is JavaScript?');
    });

    it('should trim whitespace from new question', () => {
      const card = new Card(validProps);
      card.updateQuestion('  New question  ');
      expect(card.getQuestion()).toBe('New question');
    });

    it('should throw error when new question is empty', () => {
      const card = new Card(validProps);
      expect(() => card.updateQuestion('')).toThrow('Card question is required');
    });

    it('should throw error when new question is whitespace', () => {
      const card = new Card(validProps);
      expect(() => card.updateQuestion('   ')).toThrow('Card question is required');
    });

    it('should throw error when new question is null', () => {
      const card = new Card(validProps);
      expect(() => card.updateQuestion(null as any)).toThrow('Card question is required');
    });

    it('should throw error when new question is undefined', () => {
      const card = new Card(validProps);
      expect(() => card.updateQuestion(undefined as any)).toThrow('Card question is required');
    });
  });

  describe('updateAnswer', () => {
    it('should update answer with valid value', () => {
      const card = new Card(validProps);
      card.updateAnswer('A programming language');
      expect(card.getAnswer()).toBe('A programming language');
    });

    it('should trim whitespace from new answer', () => {
      const card = new Card(validProps);
      card.updateAnswer('  New answer  ');
      expect(card.getAnswer()).toBe('New answer');
    });

    it('should throw error when new answer is empty', () => {
      const card = new Card(validProps);
      expect(() => card.updateAnswer('')).toThrow('Card answer is required');
    });

    it('should throw error when new answer is whitespace', () => {
      const card = new Card(validProps);
      expect(() => card.updateAnswer('   ')).toThrow('Card answer is required');
    });

    it('should throw error when new answer is null', () => {
      const card = new Card(validProps);
      expect(() => card.updateAnswer(null as any)).toThrow('Card answer is required');
    });

    it('should throw error when new answer is undefined', () => {
      const card = new Card(validProps);
      expect(() => card.updateAnswer(undefined as any)).toThrow('Card answer is required');
    });
  });
});
