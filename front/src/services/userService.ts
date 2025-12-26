import { API_BASE_URL } from '../config/constants';
import type { User } from '../domain/types';

interface CreateUserDTO {
  name: string;
  email: string;
}

interface QuizAvailability {
  canDoQuiz: boolean;
  lastQuizDate: string | null;
}

export const userService = {
  async createUser(data: CreateUserDTO): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la création de l\'utilisateur');
    }

    return response.json();
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const users = await this.getAllUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    return user || null;
  },

  async getAllUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/users`);

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des utilisateurs');
    }

    return response.json();
  },

  async checkQuizAvailability(userId: string): Promise<QuizAvailability> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/quiz/availability`);

    if (!response.ok) {
      throw new Error('Erreur lors de la vérification de la disponibilité du quiz');
    }

    return response.json();
  },

  async markQuizCompleted(userId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/quiz/complete`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la validation du quiz');
    }
  },
};
