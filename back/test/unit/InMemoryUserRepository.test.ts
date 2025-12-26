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
});
