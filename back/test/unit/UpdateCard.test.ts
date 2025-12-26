import { describe, it, expect, beforeEach } from 'vitest';
import { UpdateCard } from '../../src/application/usecases/UpdateCard.js';
import { InMemoryCardRepository } from '../../src/infrastructure/repositories/InMemoryCardRepository.js';
import Card from '../../src/domain/entities/Card.js';
import { Category } from '../../src/domain/entities/Category.js';

describe('UpdateCard', () => {
  let updateCard: UpdateCard;
  let repository: InMemoryCardRepository;

  beforeEach(() => {
    repository = new InMemoryCardRepository();
    updateCard = new UpdateCard(repository);
  });

  it('should update card question', async () => {
    const card = new Card({
      id: 'card-1',
      question: 'Old question?',
      answer: 'Old answer',
      category: Category.FIRST,
      tag: 'tag1',
      createdAt: new Date('2024-01-01'),
      lastReviewedAt: null,
    });
    await repository.save(card);

    const result = await updateCard.execute({
      cardId: 'card-1',
      question: 'New question?',
    });

    expect(result.getQuestion()).toBe('New question?');
    expect(result.getAnswer()).toBe('Old answer');
    expect(result.getTag()).toBe('tag1');
  });

  it('should update card answer', async () => {
    const card = new Card({
      id: 'card-1',
      question: 'What is TypeScript?',
      answer: 'Old answer',
      category: Category.FIRST,
      tag: 'tag1',
      createdAt: new Date('2024-01-01'),
      lastReviewedAt: null,
    });
    await repository.save(card);

    const result = await updateCard.execute({
      cardId: 'card-1',
      answer: 'New answer',
    });

    expect(result.getQuestion()).toBe('What is TypeScript?');
    expect(result.getAnswer()).toBe('New answer');
    expect(result.getTag()).toBe('tag1');
  });



  it('should update question and answer together', async () => {
    const card = new Card({
      id: 'card-1',
      question: 'Old question?',
      answer: 'Old answer',
      category: Category.FIRST,
      tag: 'tag1',
      createdAt: new Date('2024-01-01'),
      lastReviewedAt: null,
    });
    await repository.save(card);

    const result = await updateCard.execute({
      cardId: 'card-1',
      question: 'New question?',
      answer: 'New answer',
    });

    expect(result.getQuestion()).toBe('New question?');
    expect(result.getAnswer()).toBe('New answer');
    expect(result.getTag()).toBe('tag1');
  });



  it('should throw error when card not found', async () => {
    await expect(
      updateCard.execute({
        cardId: 'non-existent',
        question: 'New question?',
      })
    ).rejects.toThrow('Card not found');
  });

  it('should throw error when question is empty', async () => {
    const card = new Card({
      id: 'card-1',
      question: 'What is TypeScript?',
      answer: 'A typed superset of JavaScript',
      category: Category.FIRST,
      tag: 'tag1',
      createdAt: new Date('2024-01-01'),
      lastReviewedAt: null,
    });
    await repository.save(card);

    await expect(
      updateCard.execute({
        cardId: 'card-1',
        question: '',
      })
    ).rejects.toThrow('Card question is required');
  });

  it('should throw error when answer is empty', async () => {
    const card = new Card({
      id: 'card-1',
      question: 'What is TypeScript?',
      answer: 'A typed superset of JavaScript',
      category: Category.FIRST,
      tag: 'tag1',
      createdAt: new Date('2024-01-01'),
      lastReviewedAt: null,
    });
    await repository.save(card);

    await expect(
      updateCard.execute({
        cardId: 'card-1',
        answer: '',
      })
    ).rejects.toThrow('Card answer is required');
  });







  it('should not modify card when no fields provided', async () => {
    const card = new Card({
      id: 'card-1',
      question: 'What is TypeScript?',
      answer: 'A typed superset of JavaScript',
      category: Category.FIRST,
      tag: 'tag1',
      createdAt: new Date('2024-01-01'),
      lastReviewedAt: null,
    });
    await repository.save(card);

    const result = await updateCard.execute({
      cardId: 'card-1',
    });

    expect(result.getQuestion()).toBe('What is TypeScript?');
    expect(result.getAnswer()).toBe('A typed superset of JavaScript');
    expect(result.getTag()).toBe('tag1');
  });
});
