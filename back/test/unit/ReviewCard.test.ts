import { describe, it, expect, beforeEach } from 'vitest';
import { ReviewCard } from '../../src/application/usecases/ReviewCard.js';
import { CreateCard } from '../../src/application/usecases/CreateCard.js';
import { InMemoryCardRepository } from '../../src/infrastructure/repositories/InMemoryCardRepository.js';
import { Category } from '../../src/domain/entities/Category.js';

describe('ReviewCard', () => {
  let reviewCard: ReviewCard;
  let createCard: CreateCard;
  let repository: InMemoryCardRepository;

  beforeEach(() => {
    repository = new InMemoryCardRepository();
    reviewCard = new ReviewCard(repository);
    createCard = new CreateCard(repository);
  });

  describe('execute', () => {
    it('should move card to new category', async () => {
      const input = {
        question: 'What is TypeScript?',
        answer: 'A typed superset of JavaScript'
      };

      const createdCard = await createCard.execute(input);
      expect(createdCard.getCategory()).toBe(Category.FIRST);

      const updatedCard = await reviewCard.execute({
        cardId: createdCard.getId(),
        newCategory: Category.THIRD
      });

      expect(updatedCard.getCategory()).toBe(Category.THIRD);
    });

    it('should update lastReviewedAt when reviewing', async () => {
      const input = {
        question: 'What is JavaScript?',
        answer: 'A programming language'
      };

      const createdCard = await createCard.execute(input);
      expect(createdCard.getLastReviewedAt()).toBeNull();

      const beforeReview = new Date();
      const updatedCard = await reviewCard.execute({
        cardId: createdCard.getId(),
        newCategory: Category.SECOND
      });
      const afterReview = new Date();

      const lastReviewed = updatedCard.getLastReviewedAt();
      expect(lastReviewed).toBeTruthy();
      expect(lastReviewed!.getTime()).toBeGreaterThanOrEqual(beforeReview.getTime());
      expect(lastReviewed!.getTime()).toBeLessThanOrEqual(afterReview.getTime());
    });

    it('should persist the category change', async () => {
      const input = {
        question: 'What is Node.js?',
        answer: 'A JavaScript runtime'
      };

      const createdCard = await createCard.execute(input);
      await reviewCard.execute({
        cardId: createdCard.getId(),
        newCategory: Category.FIFTH
      });

      const foundCard = await repository.findById(createdCard.getId());
      expect(foundCard?.getCategory()).toBe(Category.FIFTH);
    });

    it('should throw error when card does not exist', async () => {
      await expect(reviewCard.execute({
        cardId: 'nonexistent-id',
        newCategory: Category.SECOND
      })).rejects.toThrow('Card with id nonexistent-id not found');
    });

    it('should allow moving to category 7', async () => {
      const input = {
        question: 'What is Vue?',
        answer: 'A JavaScript framework'
      };

      const createdCard = await createCard.execute(input);
      const updatedCard = await reviewCard.execute({
        cardId: createdCard.getId(),
        newCategory: Category.SEVENTH
      });

      expect(updatedCard.getCategory()).toBe(Category.SEVENTH);
      expect(updatedCard.isInFinalCategory()).toBe(true);
    });
  });
});
