import { describe, it, expect, beforeEach } from 'vitest';
import Card, { CardProps } from '../../src/domain/entities/Card.js';

describe('Card', () => {
  let validProps: CardProps;

  beforeEach(() => {
    validProps = {
      id: '123',
      question: 'What is TypeScript?',
      answer: 'A typed superset of JavaScript',
      category: 1,
      tags: ['programming', 'typescript'],
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
      expect(card.getCategory()).toBe(1);
      expect(card.getTags()).toEqual(['programming', 'typescript']);
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

    it('should throw error when category is less than 1', () => {
      const invalidProps = { ...validProps, category: 0 };
      expect(() => new Card(invalidProps)).toThrow('Card category must be between 1 and 8');
    });

    it('should throw error when category is greater than 8', () => {
      const invalidProps = { ...validProps, category: 9 };
      expect(() => new Card(invalidProps)).toThrow('Card category must be between 1 and 8');
    });

    it('should throw error when category is not an integer', () => {
      const invalidProps = { ...validProps, category: 3.5 };
      expect(() => new Card(invalidProps)).toThrow('Card category must be between 1 and 8');
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
      expect(card.getCategory()).toBe(1);
    });

    it('should return correct tags', () => {
      const card = new Card(validProps);
      expect(card.getTags()).toEqual(['programming', 'typescript']);
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
      card.moveToCategory(3);
      expect(card.getCategory()).toBe(3);
    });

    it('should update lastReviewedAt when moving category', () => {
      const card = new Card(validProps);
      const beforeMove = new Date();
      card.moveToCategory(2);
      const afterMove = new Date();
      
      const lastReviewed = card.getLastReviewedAt();
      expect(lastReviewed).toBeTruthy();
      expect(lastReviewed!.getTime()).toBeGreaterThanOrEqual(beforeMove.getTime());
      expect(lastReviewed!.getTime()).toBeLessThanOrEqual(afterMove.getTime());
    });
  });

  describe('resetToCategory1', () => {
    it('should reset card to category 1', () => {
      const props = { ...validProps, category: 5 };
      const card = new Card(props);
      card.resetToCategory1();
      expect(card.getCategory()).toBe(1);
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

  describe('addTag', () => {
    it('should add a new tag', () => {
      const card = new Card(validProps);
      card.addTag('javascript');
      expect(card.getTags()).toContain('javascript');
    });

    it('should trim tag before adding', () => {
      const card = new Card(validProps);
      card.addTag('  javascript  ');
      expect(card.getTags()).toContain('javascript');
    });

    it('should not add duplicate tags', () => {
      const card = new Card(validProps);
      card.addTag('programming');
      expect(card.getTags().filter(t => t === 'programming').length).toBe(1);
    });

    it('should throw error when tag is empty', () => {
      const card = new Card(validProps);
      expect(() => card.addTag('')).toThrow('Tag cannot be empty');
    });

    it('should throw error when tag is whitespace', () => {
      const card = new Card(validProps);
      expect(() => card.addTag('   ')).toThrow('Tag cannot be empty');
    });
  });

  describe('removeTag', () => {
    it('should remove existing tag', () => {
      const card = new Card(validProps);
      card.removeTag('programming');
      expect(card.hasTag('programming')).toBe(false);
      expect(card.getTags()).toContain('typescript');
    });

    it('should do nothing when tag does not exist', () => {
      const card = new Card(validProps);
      const tagsBefore = [...card.getTags()];
      card.removeTag('nonexistent');
      expect(card.getTags()).toEqual(tagsBefore);
    });
  });

  describe('hasTag', () => {
    it('should return true when tag exists', () => {
      const card = new Card(validProps);
      expect(card.hasTag('programming')).toBe(true);
    });

    it('should return false when tag does not exist', () => {
      const card = new Card(validProps);
      expect(card.hasTag('javascript')).toBe(false);
    });
  });

  describe('isInFinalCategory', () => {
    it('should return true when card is in category 7', () => {
      const props = { ...validProps, category: 7 };
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
      expect(card.getCategory()).toBe(2);
      expect(card.getLastReviewedAt()).not.toBeNull();
    });

    it('should move card from category 6 to category 7', () => {
      const props = { ...validProps, category: 6 };
      const card = new Card(props);
      card.answerCorrectly();
      expect(card.getCategory()).toBe(7);
    });

    it('should move card from category 7 to category 8 (DONE)', () => {
      const props = { ...validProps, category: 7 };
      const card = new Card(props);
      card.answerCorrectly();
      expect(card.getCategory()).toBe(8);
      expect(card.isDone()).toBe(true);
    });

    it('should keep card in category 8 if already done', () => {
      const props = { ...validProps, category: 8 };
      const card = new Card(props);
      card.answerCorrectly();
      expect(card.getCategory()).toBe(8);
    });
  });

  describe('answerIncorrectly', () => {
    it('should reset card to category 1 from category 3', () => {
      const props = { ...validProps, category: 3 };
      const card = new Card(props);
      card.answerIncorrectly();
      expect(card.getCategory()).toBe(1);
      expect(card.getLastReviewedAt()).not.toBeNull();
    });

    it('should reset card to category 1 from category 7', () => {
      const props = { ...validProps, category: 7 };
      const card = new Card(props);
      card.answerIncorrectly();
      expect(card.getCategory()).toBe(1);
    });

    it('should keep card in category 1 if already there', () => {
      const card = new Card(validProps);
      card.answerIncorrectly();
      expect(card.getCategory()).toBe(1);
    });
  });

  describe('isDone', () => {
    it('should return true when card is in category 8', () => {
      const props = { ...validProps, category: 8 };
      const card = new Card(props);
      expect(card.isDone()).toBe(true);
    });

    it('should return false when card is not in category 8', () => {
      const card = new Card(validProps);
      expect(card.isDone()).toBe(false);
    });
  });
});
