import { describe, it, expect, beforeEach } from 'vitest';
import { ReviewCard } from '../../src/application/usecases/ReviewCard.js';
import { CreateCard } from '../../src/application/usecases/CreateCard.js';
import { InMemoryCardRepository } from '../../src/infrastructure/repositories/InMemoryCardRepository.js';

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
      expect(createdCard.getCategory()).toBe(1);

      const updatedCard = await reviewCard.execute({
        cardId: createdCard.getId(),
        newCategory: 3
      });

      expect(updatedCard.getCategory()).toBe(3);
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
        newCategory: 2
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
        newCategory: 5
      });

      const foundCard = await repository.findById(createdCard.getId());
      expect(foundCard?.getCategory()).toBe(5);
    });

    it('should throw error when card does not exist', async () => {
      await expect(reviewCard.execute({
        cardId: 'nonexistent-id',
        newCategory: 2
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
        newCategory: 7
      });

      expect(updatedCard.getCategory()).toBe(7);
      expect(updatedCard.isInFinalCategory()).toBe(true);
    });
  });
});
