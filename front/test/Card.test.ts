import { describe, it, expect } from 'vitest';
import type { Card, CreateCardDTO } from '../src/domain/types';
import { Category } from '../src/domain/types';

describe('Card Type', () => {
  it('should validate card structure', () => {
    const card: Card = {
      id: '123',
      question: 'What is TypeScript?',
      answer: 'A typed superset of JavaScript',
      category: Category.FIRST,
      tag: 'programming'
    };

    expect(card.id).toBeTruthy();
    expect(card.question).toBeTruthy();
    expect(card.answer).toBeTruthy();
    expect(card.category).toBeTruthy();
  });

  it('should allow card without tag', () => {
    const card: Card = {
      id: '123',
      question: 'Test',
      answer: 'Answer',
      category: Category.FIRST
    };

    expect(card.tag).toBeUndefined();
  });
});

describe('CreateCardDTO', () => {
  it('should validate create card DTO structure', () => {
    const dto: CreateCardDTO = {
      question: 'New question',
      answer: 'New answer',
      tag: 'test'
    };

    expect(dto.question).toBeTruthy();
    expect(dto.answer).toBeTruthy();
  });

  it('should allow DTO without tag', () => {
    const dto: CreateCardDTO = {
      question: 'Question',
      answer: 'Answer'
    };

    expect(dto.tag).toBeUndefined();
  });
});
