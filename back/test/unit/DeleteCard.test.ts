import { describe, it, expect, beforeEach } from 'vitest';
import { DeleteCard } from '../../src/application/usecases/DeleteCard.js';
import { CreateCard } from '../../src/application/usecases/CreateCard.js';
import { GetCard } from '../../src/application/usecases/GetCard.js';
import { InMemoryCardRepository } from '../../src/infrastructure/repositories/InMemoryCardRepository.js';

describe('DeleteCard', () => {
  let deleteCard: DeleteCard;
  let createCard: CreateCard;
  let getCard: GetCard;
  let repository: InMemoryCardRepository;

  beforeEach(() => {
    repository = new InMemoryCardRepository();
    deleteCard = new DeleteCard(repository);
    createCard = new CreateCard(repository);
    getCard = new GetCard(repository);
  });

  describe('execute', () => {
    it('should delete an existing card', async () => {
      const input = {
        question: 'What is TypeScript?',
        answer: 'A typed superset of JavaScript'
      };

      const createdCard = await createCard.execute(input);
      await deleteCard.execute(createdCard.getId());

      await expect(getCard.execute(createdCard.getId())).rejects.toThrow('Card with id');
    });

    it('should remove card from repository', async () => {
      const input = {
        question: 'What is JavaScript?',
        answer: 'A programming language'
      };

      const createdCard = await createCard.execute(input);
      await deleteCard.execute(createdCard.getId());

      const allCards = await repository.findAll();
      expect(allCards).toHaveLength(0);
    });

    it('should throw error when card does not exist', async () => {
      await expect(deleteCard.execute('nonexistent-id')).rejects.toThrow('Card with id nonexistent-id not found');
    });

    it('should only delete the specified card', async () => {
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

      await deleteCard.execute(card1.getId());

      const allCards = await repository.findAll();
      expect(allCards).toHaveLength(1);
      expect(allCards[0]?.getId()).toBe(card2.getId());
    });

    it('should allow deleting multiple cards sequentially', async () => {
      const input1 = {
        question: 'Question 1',
        answer: 'Answer 1'
      };
      const input2 = {
        question: 'Question 2',
        answer: 'Answer 2'
      };
      const input3 = {
        question: 'Question 3',
        answer: 'Answer 3'
      };

      const card1 = await createCard.execute(input1);
      const card2 = await createCard.execute(input2);
      const card3 = await createCard.execute(input3);

      await deleteCard.execute(card1.getId());
      await deleteCard.execute(card3.getId());

      const allCards = await repository.findAll();
      expect(allCards).toHaveLength(1);
      expect(allCards[0]?.getId()).toBe(card2.getId());
    });
  });
});
