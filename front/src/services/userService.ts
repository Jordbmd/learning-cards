import { API_BASE_URL } from '../config/constants';
import type { User } from '../domain/types';

interface CreateUserDTO {
  name: string;
  email: string;
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
    const response = await fetch(`${API_BASE_URL}/users?email=${encodeURIComponent(email)}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Erreur lors de la récupération de l\'utilisateur');
    }

    return response.json();
  },

  async getAllUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/users`);

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des utilisateurs');
    }

    return response.json();
  },
};
