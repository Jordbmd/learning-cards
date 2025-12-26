import { API_BASE_URL } from '../config/constants';
import type { Card, CreateCardDTO, UpdateCardDTO, ReviewCardDTO, GetCardsFilters, GetQuizzParams } from '../domain/types';

class CardService {
  async createCard(data: CreateCardDTO): Promise<Card> {
    const response = await fetch(`${API_BASE_URL}/cards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la création de la carte');
    }

    return response.json();
  }

  async getCardById(id: string): Promise<Card> {
    const response = await fetch(`${API_BASE_URL}/cards/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Carte non trouvée');
      }
      throw new Error('Erreur lors de la récupération de la carte');
    }

    return response.json();
  }

  async getAllCards(filters?: GetCardsFilters): Promise<Card[]> {
    const params = new URLSearchParams();

    if (filters?.category !== undefined) {
      params.append('category', filters.category.toString());
    }

    if (filters?.tags && filters.tags.length > 0) {
      params.append('tags', filters.tags.join(','));
    }

    if (filters?.fromDate) {
      params.append('fromDate', filters.fromDate);
    }

    if (filters?.toDate) {
      params.append('toDate', filters.toDate);
    }

    const url = `${API_BASE_URL}/cards${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des cartes');
    }

    return response.json();
  }

  async getQuizzCards(params?: GetQuizzParams): Promise<Card[]> {
    const queryParams = new URLSearchParams();

    if (params?.date) {
      queryParams.append('date', params.date);
    }

    const url = `${API_BASE_URL}/cards/quizz${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération du quizz');
    }

    return response.json();
  }

  async answerCard(cardId: string, isValid: boolean): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/cards/${cardId}/answer`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isValid }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Carte non trouvée');
      }
      throw new Error('Erreur lors de la réponse à la carte');
    }
  }

  async reviewCard(cardId: string, data: ReviewCardDTO): Promise<Card> {
    const response = await fetch(`${API_BASE_URL}/cards/${cardId}/review`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Carte non trouvée');
      }
      throw new Error('Erreur lors de la révision de la carte');
    }

    return response.json();
  }

  async deleteCard(cardId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/cards/${cardId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Carte non trouvée');
      }
      throw new Error('Erreur lors de la suppression de la carte');
    }
  }

  async updateCard(cardId: string, data: UpdateCardDTO): Promise<Card> {
    const response = await fetch(`${API_BASE_URL}/cards/${cardId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Carte non trouvée');
      }
      throw new Error('Erreur lors de la mise à jour de la carte');
    }

    return response.json();
  }
}

export const cardService = new CardService();
