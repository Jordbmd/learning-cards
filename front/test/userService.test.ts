import { describe, it, expect, beforeEach, vi } from 'vitest';
import { userService } from '../src/services/userService';
import type { User } from '../src/domain/types';

describe('UserService', () => {
  let localStorageMock: Record<string, string>;
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    localStorageMock = {};
    
    global.localStorage = {
      getItem: vi.fn((key: string) => localStorageMock[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        localStorageMock[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete localStorageMock[key];
      }),
      clear: vi.fn(() => {
        Object.keys(localStorageMock).forEach(key => delete localStorageMock[key]);
      }),
      length: 0,
      key: vi.fn(),
    } as Storage;

    mockFetch = vi.fn();
    global.fetch = mockFetch;

    vi.spyOn(crypto, 'randomUUID').mockReturnValue('test-uuid-123-456-789-abc');
  });

  describe('createUser', () => {
    it('should create a new user and save to localStorage', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      const user = await userService.createUser(userData);

      expect(user).toEqual({
        id: 'test-uuid-123-456-789-abc',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'users',
        expect.stringContaining('john@example.com')
      );
    });

    it('should add user to existing users list', async () => {
      const existingUsers = [
        {
          id: 'existing-id',
          name: 'Existing User',
          email: 'existing@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      localStorageMock['users'] = JSON.stringify(existingUsers);

      await userService.createUser({
        name: 'New User',
        email: 'new@example.com',
      });

      const savedUsers = JSON.parse(localStorageMock['users'] || '[]');
      expect(savedUsers).toHaveLength(2);
      expect(savedUsers[1].email).toBe('new@example.com');
    });
  });

  describe('getUserByEmail', () => {
    it('should return existing user if found', async () => {
      const existingUser: User = {
        id: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      localStorageMock['users'] = JSON.stringify([existingUser]);

      const user = await userService.getUserByEmail('test@example.com');

      expect(user).toEqual(expect.objectContaining({
        id: 'user-123',
        email: 'test@example.com',
      }));
    });

    it('should be case-insensitive when finding user', async () => {
      const existingUser: User = {
        id: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      localStorageMock['users'] = JSON.stringify([existingUser]);

      const user = await userService.getUserByEmail('TEST@EXAMPLE.COM');

      expect(user).toEqual(expect.objectContaining({
        id: 'user-123',
        email: 'test@example.com',
      }));
    });

    it('should create new user if not found', async () => {
      localStorageMock['users'] = '[]';

      const user = await userService.getUserByEmail('newuser@example.com');

      expect(user).toEqual({
        id: 'test-uuid-123-456-789-abc',
        name: 'newuser',
        email: 'newuser@example.com',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      const savedUsers = JSON.parse(localStorageMock['users'] || '[]');
      expect(savedUsers).toHaveLength(1);
    });

    it('should extract name from email for new user', async () => {
      const user = await userService.getUserByEmail('john.doe@company.com');

      expect(user?.name).toBe('john.doe');
    });
  });

  describe('getAllUsers', () => {
    it('should return all users from localStorage', async () => {
      const users: User[] = [
        {
          id: '1',
          name: 'User 1',
          email: 'user1@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'User 2',
          email: 'user2@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      localStorageMock['users'] = JSON.stringify(users);

      const result = await userService.getAllUsers();

      expect(result).toHaveLength(2);
      expect(result[0].email).toBe('user1@example.com');
      expect(result[1].email).toBe('user2@example.com');
    });

    it('should return empty array if no users', async () => {
      const result = await userService.getAllUsers();

      expect(result).toEqual([]);
    });
  });

  describe('getLocalUsers', () => {
    it('should return users from localStorage', () => {
      const users: User[] = [
        {
          id: '1',
          name: 'Test',
          email: 'test@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      localStorageMock['users'] = JSON.stringify(users);

      const result = userService.getLocalUsers();

      expect(result).toHaveLength(1);
      expect(result[0].email).toBe('test@example.com');
    });

    it('should return empty array if localStorage is empty', () => {
      const result = userService.getLocalUsers();

      expect(result).toEqual([]);
    });
  });

  describe('checkQuizAvailability', () => {
    it('should fetch quiz availability from API', async () => {
      const mockResponse = {
        canDoQuiz: true,
        lastQuizDate: '2024-01-15',
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await userService.checkQuizAvailability('user-123');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/users/user-123/quiz/availability'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error if API request fails', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
      } as Response);

      await expect(userService.checkQuizAvailability('user-123')).rejects.toThrow(
        'Erreur lors de la vérification de la disponibilité du quiz'
      );
    });
  });

  describe('markQuizCompleted', () => {
    it('should mark quiz as completed via API', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
      } as Response);

      await userService.markQuizCompleted('user-123');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/users/user-123/quiz/complete',
        {
          method: 'POST',
        }
      );
    });

    it('should throw error if API request fails', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
      } as Response);

      await expect(userService.markQuizCompleted('user-123')).rejects.toThrow(
        'Erreur lors de la validation du quiz'
      );
    });
  });
});
