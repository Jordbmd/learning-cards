import { describe, it, expect, beforeEach } from 'vitest';
import { UpdateCard } from '../../src/application/usecases/UpdateCard.js';
import { InMemoryCardRepository } from '../../src/infrastructure/repositories/InMemoryCardRepository.js';
import Card from '../../src/domain/entities/Card.js';

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
      category: 1,
      tags: ['tag1'],
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
    expect(result.getTags()).toEqual(['tag1']);
  });

  it('should update card answer', async () => {
    const card = new Card({
      id: 'card-1',
      question: 'What is TypeScript?',
      answer: 'Old answer',
      category: 1,
      tags: ['tag1'],
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
    expect(result.getTags()).toEqual(['tag1']);
  });

  it('should update card tags', async () => {
    const card = new Card({
      id: 'card-1',
      question: 'What is TypeScript?',
      answer: 'A typed superset of JavaScript',
      category: 1,
      tags: ['old-tag1', 'old-tag2'],
      createdAt: new Date('2024-01-01'),
      lastReviewedAt: null,
    });
    await repository.save(card);

    const result = await updateCard.execute({
      cardId: 'card-1',
      tags: ['new-tag1', 'new-tag2', 'new-tag3'],
    });

    expect(result.getTags()).toEqual(['new-tag1', 'new-tag2', 'new-tag3']);
    expect(result.getQuestion()).toBe('What is TypeScript?');
    expect(result.getAnswer()).toBe('A typed superset of JavaScript');
  });

  it('should update question and answer together', async () => {
    const card = new Card({
      id: 'card-1',
      question: 'Old question?',
      answer: 'Old answer',
      category: 1,
      tags: ['tag1'],
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
    expect(result.getTags()).toEqual(['tag1']);
  });

  it('should update all fields together', async () => {
    const card = new Card({
      id: 'card-1',
      question: 'Old question?',
      answer: 'Old answer',
      category: 1,
      tags: ['old-tag'],
      createdAt: new Date('2024-01-01'),
      lastReviewedAt: null,
    });
    await repository.save(card);

    const result = await updateCard.execute({
      cardId: 'card-1',
      question: 'New question?',
      answer: 'New answer',
      tags: ['new-tag1', 'new-tag2'],
    });

    expect(result.getQuestion()).toBe('New question?');
    expect(result.getAnswer()).toBe('New answer');
    expect(result.getTags()).toEqual(['new-tag1', 'new-tag2']);
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
      category: 1,
      tags: ['tag1'],
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
      category: 1,
      tags: ['tag1'],
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

  it('should trim whitespace from tags', async () => {
    const card = new Card({
      id: 'card-1',
      question: 'What is TypeScript?',
      answer: 'A typed superset of JavaScript',
      category: 1,
      tags: ['old-tag'],
      createdAt: new Date('2024-01-01'),
      lastReviewedAt: null,
    });
    await repository.save(card);

    const result = await updateCard.execute({
      cardId: 'card-1',
      tags: ['  tag1  ', 'tag2  ', '  tag3'],
    });

    expect(result.getTags()).toEqual(['tag1', 'tag2', 'tag3']);
  });

  it('should filter empty tags', async () => {
    const card = new Card({
      id: 'card-1',
      question: 'What is TypeScript?',
      answer: 'A typed superset of JavaScript',
      category: 1,
      tags: ['old-tag'],
      createdAt: new Date('2024-01-01'),
      lastReviewedAt: null,
    });
    await repository.save(card);

    const result = await updateCard.execute({
      cardId: 'card-1',
      tags: ['tag1', '', '  ', 'tag2'],
    });

    expect(result.getTags()).toEqual(['tag1', 'tag2']);
  });

  it('should clear all tags when empty array provided', async () => {
    const card = new Card({
      id: 'card-1',
      question: 'What is TypeScript?',
      answer: 'A typed superset of JavaScript',
      category: 1,
      tags: ['tag1', 'tag2'],
      createdAt: new Date('2024-01-01'),
      lastReviewedAt: null,
    });
    await repository.save(card);

    const result = await updateCard.execute({
      cardId: 'card-1',
      tags: [],
    });

    expect(result.getTags()).toEqual([]);
  });

  it('should not modify card when no fields provided', async () => {
    const card = new Card({
      id: 'card-1',
      question: 'What is TypeScript?',
      answer: 'A typed superset of JavaScript',
      category: 1,
      tags: ['tag1'],
      createdAt: new Date('2024-01-01'),
      lastReviewedAt: null,
    });
    await repository.save(card);

    const result = await updateCard.execute({
      cardId: 'card-1',
    });

    expect(result.getQuestion()).toBe('What is TypeScript?');
    expect(result.getAnswer()).toBe('A typed superset of JavaScript');
    expect(result.getTags()).toEqual(['tag1']);
  });
});
