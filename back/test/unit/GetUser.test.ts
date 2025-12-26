import { describe, it, expect, beforeEach } from 'vitest';
import { GetUser } from '../../src/application/usecases/GetUser.js';
import { InMemoryUserRepository } from '../../src/infrastructure/repositories/InMemoryUserRepository.js';
import User from '../../src/domain/entities/User.js';

describe('GetUser', () => {
  let getUser: GetUser;
  let repository: InMemoryUserRepository;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
    getUser = new GetUser(repository);
  });

  describe('execute', () => {
    it('should return user when user exists', async () => {
      const userData = {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const user = new User(userData);
      await repository.save(user);

      const foundUser = await getUser.execute('123');

      expect(foundUser.getId()).toBe('123');
      expect(foundUser.getName()).toBe('John Doe');
      expect(foundUser.getEmail()).toBe('john@example.com');
    });

    it('should throw error when user does not exist', async () => {
      await expect(getUser.execute('non-existent-id')).rejects.toThrow('User not found');
    });

    it('should return correct user when multiple users exist', async () => {
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

      const foundUser = await getUser.execute('456');

      expect(foundUser.getId()).toBe('456');
      expect(foundUser.getName()).toBe('User Two');
    });
  });
});
