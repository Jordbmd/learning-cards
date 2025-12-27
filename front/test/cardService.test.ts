import { describe, it, expect, beforeEach, vi } from 'vitest';
import { cardService } from '../src/services/cardService';
import { Category } from '../src/domain/types';

const mockFetch = vi.fn();
global.fetch = mockFetch as typeof fetch;

describe('CardService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('createCard', () => {
    it('should create a card successfully', async () => {
      const mockCard = {
        id: '1',
        question: 'Test question',
        answer: 'Test answer',
        category: Category.FIRST,
        tag: 'test'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCard,
      } as Response);

      const result = await cardService.createCard({
        question: 'Test question',
        answer: 'Test answer',
        tag: 'test'
      });

      expect(result).toEqual(mockCard);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/cards'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });

    it('should throw error when creation fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      } as Response);

      await expect(
        cardService.createCard({ question: 'Q', answer: 'A' })
      ).rejects.toThrow('Erreur lors de la création de la carte');
    });

    it('should create a card in category FIRST by default', async () => {
      const mockCard = {
        id: '2',
        question: 'Catégorie test',
        answer: 'Réponse test',
        category: Category.FIRST,
        tag: 'unit'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCard,
      } as Response);

      const result = await cardService.createCard({
        question: 'Catégorie test',
        answer: 'Réponse test',
        tag: 'unit'
      });

      expect(result.category).toBe(Category.FIRST);
    });
  });

  describe('getAllCards', () => {
    it('should fetch all cards without filters', async () => {
      const mockCards = [
        { id: '1', question: 'Q1', answer: 'A1', category: Category.FIRST },
        { id: '2', question: 'Q2', answer: 'A2', category: Category.SECOND },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCards,
      } as Response);

      const result = await cardService.getAllCards();

      expect(result).toEqual(mockCards);
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/cards'));
    });
  });

  describe('getQuizzCards', () => {
    it('should fetch quizz cards for today', async () => {
      const mockCards = [
        { id: '1', question: 'Q1', answer: 'A1', category: Category.FIRST }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCards,
      } as Response);

      const result = await cardService.getQuizzCards();

      expect(result).toEqual(mockCards);
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/cards/quizz'));
    });

    it('should fetch quizz cards for specific date', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      } as Response);

      await cardService.getQuizzCards({ date: '2024-01-01' });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('date=2024-01-01')
      );
    });
  });

  describe('answerCard', () => {
    it('should answer card correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
      } as Response);

      await cardService.answerCard('card-id', true);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/cards/card-id/answer'),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ isValid: true }),
        })
      );
    });

    it('should throw error when card not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response);

      await expect(
        cardService.answerCard('invalid-id', true)
      ).rejects.toThrow('Carte non trouvée');
    });
  });
});
