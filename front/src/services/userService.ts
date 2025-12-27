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
    const user: User = {
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const users = this.getLocalUsers();

    if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      throw new Error('Cet email est déjà utilisé');
    }

    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));

    return user;
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const users = this.getLocalUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    return user || null;
  },

  async getAllUsers(): Promise<User[]> {
    return this.getLocalUsers();
  },

  getLocalUsers(): User[] {
    const usersJson = localStorage.getItem('users');
    return usersJson ? JSON.parse(usersJson) : [];
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
