import { describe, it, expect, beforeEach } from 'vitest';
import { DeleteUser } from '../../src/application/usecases/DeleteUser.js';
import { InMemoryUserRepository } from '../../src/infrastructure/repositories/InMemoryUserRepository.js';
import User from '../../src/domain/entities/User.js';

describe('DeleteUser', () => {
  let deleteUser: DeleteUser;
  let repository: InMemoryUserRepository;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
    deleteUser = new DeleteUser(repository);
  });

  describe('execute', () => {
    it('should delete user when user exists', async () => {
      const user = new User({
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastQuizDate: null
      });

      await repository.save(user);
      await deleteUser.execute('123');

      const foundUser = await repository.findById('123');
      expect(foundUser).toBe(null);
    });

    it('should throw error when user does not exist', async () => {
      await expect(deleteUser.execute('non-existent-id')).rejects.toThrow('User not found');
    });

    it('should only delete specified user', async () => {
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
      await deleteUser.execute('123');

      const remainingUsers = await repository.findAll();
      expect(remainingUsers).toHaveLength(1);
      expect(remainingUsers[0]?.getId()).toBe('456');
    });

    it('should allow deletion of all users one by one', async () => {
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

      await deleteUser.execute('123');
      await deleteUser.execute('456');

      const remainingUsers = await repository.findAll();
      expect(remainingUsers).toHaveLength(0);
    });

    it('should throw error when trying to delete same user twice', async () => {
      const user = new User({
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastQuizDate: null
      });

      await repository.save(user);
      await deleteUser.execute('123');

      await expect(deleteUser.execute('123')).rejects.toThrow('User not found');
    });
  });
});
