import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryUserRepository } from '../../src/infrastructure/repositories/InMemoryUserRepository.js';

describe('InMemoryUserRepository', () => {
  let repository: InMemoryUserRepository;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
  });

  describe('findById', () => {
    it('should return null when user does not exist', async () => {
      const user = await repository.findById('non-existent-id');
      expect(user).toBe(null);
    });

    it('should return user when user exists', async () => {
      const input = {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastQuizDate: null
      };

      const User = (await import('../../src/domain/entities/User.js')).default;
      const user = new User(input);
      await repository.save(user);

      const foundUser = await repository.findById('123');
      expect(foundUser).toBeTruthy();
      expect(foundUser?.getId()).toBe('123');
      expect(foundUser?.getName()).toBe('John Doe');
      expect(foundUser?.getEmail()).toBe('john@example.com');
    });

    it('should return null for different ID', async () => {
      const input = {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastQuizDate: null
      };

      const User = (await import('../../src/domain/entities/User.js')).default;
      const user = new User(input);
      await repository.save(user);

      const foundUser = await repository.findById('456');
      expect(foundUser).toBe(null);
    });
  });

  describe('findAll', () => {
    it('should return empty array when no users exist', async () => {
      const users = await repository.findAll();
      expect(users).toEqual([]);
    });

    it('should return all users when users exist', async () => {
      const User = (await import('../../src/domain/entities/User.js')).default;
      
      const user1 = new User({
        id: '123',
        name: 'User One',
        email: 'user1@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastQuizDate: null
      });

      const user2 = new User({
        id: '456',
        name: 'User Two',
        email: 'user2@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastQuizDate: null
      });

      await repository.save(user1);
      await repository.save(user2);

      const users = await repository.findAll();
      expect(users).toHaveLength(2);
    });

    it('should return users with all their properties', async () => {
      const User = (await import('../../src/domain/entities/User.js')).default;
      
      const user = new User({
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastQuizDate: null
      });

      await repository.save(user);

      const users = await repository.findAll();
      expect(users).toHaveLength(1);
      expect(users[0]?.getId()).toBe('123');
      expect(users[0]?.getName()).toBe('John Doe');
      expect(users[0]?.getEmail()).toBe('john@example.com');
    });
  });

  describe('findByEmail', () => {
    it('should return null when email does not exist', async () => {
      const user = await repository.findByEmail('nonexistent@example.com');
      expect(user).toBe(null);
    });

    it('should return user when email exists', async () => {
      const User = (await import('../../src/domain/entities/User.js')).default;
      
      const user = new User({
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastQuizDate: null
      });

      await repository.save(user);

      const foundUser = await repository.findByEmail('john@example.com');
      expect(foundUser).toBeTruthy();
      expect(foundUser?.getId()).toBe('123');
      expect(foundUser?.getName()).toBe('John Doe');
    });

    it('should find user with case-insensitive email', async () => {
      const User = (await import('../../src/domain/entities/User.js')).default;
      
      const user = new User({
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastQuizDate: null
      });

      await repository.save(user);

      const foundUser = await repository.findByEmail('JOHN@EXAMPLE.COM');
      expect(foundUser).toBeTruthy();
      expect(foundUser?.getId()).toBe('123');
    });

    it('should return null for different email', async () => {
      const User = (await import('../../src/domain/entities/User.js')).default;
      
      const user = new User({
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastQuizDate: null
      });

      await repository.save(user);

      const foundUser = await repository.findByEmail('jane@example.com');
      expect(foundUser).toBe(null);
    });

    it('should return correct user when multiple users exist', async () => {
      const User = (await import('../../src/domain/entities/User.js')).default;
      
      const user1 = new User({
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastQuizDate: null
      });

      const user2 = new User({
        id: '456',
        name: 'Jane Doe',
        email: 'jane@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastQuizDate: null
      });

      await repository.save(user1);
      await repository.save(user2);

      const foundUser = await repository.findByEmail('jane@example.com');
      expect(foundUser).toBeTruthy();
      expect(foundUser?.getId()).toBe('456');
      expect(foundUser?.getName()).toBe('Jane Doe');
    });
  });

  describe('delete', () => {
    it('should delete user when user exists', async () => {
      const User = (await import('../../src/domain/entities/User.js')).default;
      
      const user = new User({
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastQuizDate: null
      });

      await repository.save(user);
      await repository.delete('123');

      const foundUser = await repository.findById('123');
      expect(foundUser).toBe(null);
    });

    it('should do nothing when deleting non-existent user', async () => {
      await repository.delete('non-existent-id');
      const users = await repository.findAll();
      expect(users).toEqual([]);
    });

    it('should only delete specified user', async () => {
      const User = (await import('../../src/domain/entities/User.js')).default;
      
      const user1 = new User({
        id: '123',
        name: 'User One',
        email: 'user1@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastQuizDate: null
      });

      const user2 = new User({
        id: '456',
        name: 'User Two',
        email: 'user2@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastQuizDate: null
      });

      await repository.save(user1);
      await repository.save(user2);
      await repository.delete('123');

      const remainingUsers = await repository.findAll();
      expect(remainingUsers).toHaveLength(1);
      expect(remainingUsers[0]?.getId()).toBe('456');
    });
  });
});
