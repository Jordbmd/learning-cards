import { describe, it, expect, beforeEach } from 'vitest';
import { GetAllUsers } from '../../src/application/usecases/GetAllUsers.js';
import { InMemoryUserRepository } from '../../src/infrastructure/repositories/InMemoryUserRepository.js';
import User from '../../src/domain/entities/User.js';

describe('GetAllUsers', () => {
  let getAllUsers: GetAllUsers;
  let repository: InMemoryUserRepository;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
    getAllUsers = new GetAllUsers(repository);
  });

  describe('execute', () => {
    it('should return empty array when no users exist', async () => {
      const users = await getAllUsers.execute();
      expect(users).toEqual([]);
    });

    it('should return all users', async () => {
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

      const users = await getAllUsers.execute();
      expect(users).toHaveLength(2);
    });

    it('should return users with all their properties', async () => {
      const user = new User({
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await repository.save(user);

      const users = await getAllUsers.execute();
      expect(users).toHaveLength(1);
      expect(users[0]?.getId()).toBe('123');
      expect(users[0]?.getName()).toBe('John Doe');
      expect(users[0]?.getEmail()).toBe('john@example.com');
    });

    it('should return multiple users with different properties', async () => {
      const user1 = new User({
        id: '123',
        name: 'Alice',
        email: 'alice@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const user2 = new User({
        id: '456',
        name: 'Bob',
        email: 'bob@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const user3 = new User({
        id: '789',
        name: 'Charlie',
        email: 'charlie@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await repository.save(user1);
      await repository.save(user2);
      await repository.save(user3);

      const users = await getAllUsers.execute();
      expect(users).toHaveLength(3);

      const names = users.map(u => u.getName());
      expect(names).toContain('Alice');
      expect(names).toContain('Bob');
      expect(names).toContain('Charlie');
    });
  });
});
