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
        updatedAt: new Date()
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
        updatedAt: new Date()
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
        updatedAt: new Date()
      });

      const user2 = new User({
        id: '456',
        name: 'User Two',
        email: 'user2@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
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
        updatedAt: new Date()
      });

      await repository.save(user);

      const users = await repository.findAll();
      expect(users).toHaveLength(1);
      expect(users[0]?.getId()).toBe('123');
      expect(users[0]?.getName()).toBe('John Doe');
      expect(users[0]?.getEmail()).toBe('john@example.com');
    });
  });
});
