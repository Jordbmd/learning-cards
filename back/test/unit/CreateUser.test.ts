import { describe, it, expect, beforeEach } from 'vitest';
import { CreateUser } from '../../src/application/usecases/CreateUser.js';
import { InMemoryUserRepository } from '../../src/infrastructure/repositories/InMemoryUserRepository.js';

describe('CreateUser', () => {
  let createUser: CreateUser;
  let repository: InMemoryUserRepository;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
    createUser = new CreateUser(repository);
  });

  describe('execute', () => {
    it('should create a user with valid input', async () => {
      const input = {
        name: 'John Doe',
        email: 'john@example.com'
      };

      const user = await createUser.execute(input);

      expect(user.getId()).toBeTruthy();
      expect(user.getName()).toBe('John Doe');
      expect(user.getEmail()).toBe('john@example.com');
      expect(user.getCreatedAt()).toBeInstanceOf(Date);
      expect(user.getUpdatedAt()).toBeInstanceOf(Date);
    });

    it('should generate a unique ID for each user', async () => {
      const input1 = {
        name: 'User One',
        email: 'user1@example.com'
      };
      const input2 = {
        name: 'User Two',
        email: 'user2@example.com'
      };

      const user1 = await createUser.execute(input1);
      const user2 = await createUser.execute(input2);

      expect(user1.getId() !== user2.getId()).toBe(true);
    });

    it('should throw error when name is empty', async () => {
      const input = {
        name: '',
        email: 'test@example.com'
      };

      await expect(createUser.execute(input)).rejects.toThrow('Name cannot be empty');
    });

    it('should throw error when email is invalid', async () => {
      const input = {
        name: 'Test User',
        email: 'invalid-email'
      };

      await expect(createUser.execute(input)).rejects.toThrow('Invalid email format');
    });

    it('should set createdAt and updatedAt to the same time', async () => {
      const input = {
        name: 'Time Test',
        email: 'time@example.com'
      };

      const user = await createUser.execute(input);

      expect(user.getCreatedAt().getTime()).toBe(user.getUpdatedAt().getTime());
    });

    it('should handle special characters in name', async () => {
      const input = {
        name: "John O'Brien-Smith",
        email: 'john@example.com'
      };

      const user = await createUser.execute(input);

      expect(user.getName()).toBe("John O'Brien-Smith");
    });

    it('should handle email with subdomain', async () => {
      const input = {
        name: 'Test User',
        email: 'user@mail.example.com'
      };

      const user = await createUser.execute(input);

      expect(user.getEmail()).toBe('user@mail.example.com');
    });

    it('should throw error when email already exists', async () => {
      const input1 = {
        name: 'First User',
        email: 'duplicate@example.com'
      };

      await createUser.execute(input1);

      const input2 = {
        name: 'Second User',
        email: 'duplicate@example.com'
      };

      await expect(createUser.execute(input2)).rejects.toThrow('Email already exists');
    });

    it('should throw error when email exists with different case', async () => {
      const input1 = {
        name: 'First User',
        email: 'test@example.com'
      };

      await createUser.execute(input1);

      const input2 = {
        name: 'Second User',
        email: 'TEST@EXAMPLE.COM'
      };

      await expect(createUser.execute(input2)).rejects.toThrow('Email already exists');
    });
  });
});
