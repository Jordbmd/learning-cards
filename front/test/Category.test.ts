import { describe, it, expect } from 'vitest';
import { Category, getCategoryLabel } from '../src/domain/types/Category';

describe('Category', () => {
  describe('Category enum', () => {
    it('should have all expected categories', () => {
      expect(Category.FIRST).toBe('FIRST');
      expect(Category.SECOND).toBe('SECOND');
      expect(Category.THIRD).toBe('THIRD');
      expect(Category.FOURTH).toBe('FOURTH');
      expect(Category.FIFTH).toBe('FIFTH');
      expect(Category.SIXTH).toBe('SIXTH');
      expect(Category.SEVENTH).toBe('SEVENTH');
      expect(Category.DONE).toBe('DONE');
    });
  });

  describe('getCategoryLabel', () => {
    it('should return correct label for each category', () => {
      expect(getCategoryLabel(Category.FIRST)).toBe('Nouveau');
      expect(getCategoryLabel(Category.SECOND)).toBe('Jour 1');
      expect(getCategoryLabel(Category.THIRD)).toBe('Jour 3');
      expect(getCategoryLabel(Category.FOURTH)).toBe('Semaine 1');
      expect(getCategoryLabel(Category.FIFTH)).toBe('Semaine 2');
      expect(getCategoryLabel(Category.SIXTH)).toBe('Mois 1');
      expect(getCategoryLabel(Category.SEVENTH)).toBe('Mois 4');
      expect(getCategoryLabel(Category.DONE)).toBe('Maîtrisé');
    });
  });
});
