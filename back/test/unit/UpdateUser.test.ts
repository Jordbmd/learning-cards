import { describe, it, expect, beforeEach } from 'vitest';
import { UpdateUser } from '../../src/application/usecases/UpdateUser.js';
import { InMemoryUserRepository } from '../../src/infrastructure/repositories/InMemoryUserRepository.js';
import User from '../../src/domain/entities/User.js';

describe('UpdateUser', () => {
  let updateUser: UpdateUser;
  let repository: InMemoryUserRepository;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
    updateUser = new UpdateUser(repository);
  });

  it('should update user name', async () => {
    const user = new User({
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      lastQuizDate: null,
    });
    await repository.save(user);
    const originalUpdatedAt = user.getUpdatedAt().getTime();

    await new Promise(resolve => setTimeout(resolve, 1));

    const result = await updateUser.execute({
      userId: 'user-1',
      name: 'Jane Doe',
    });

    expect(result.getName()).toBe('Jane Doe');
    expect(result.getEmail()).toBe('john@example.com');
    expect(result.getUpdatedAt().getTime()).toBeGreaterThan(originalUpdatedAt);
  });

  it('should update user email', async () => {
    const user = new User({
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      lastQuizDate: null,
    });
    await repository.save(user);
    const originalUpdatedAt = user.getUpdatedAt().getTime();

    await new Promise(resolve => setTimeout(resolve, 1));

    const result = await updateUser.execute({
      userId: 'user-1',
      email: 'newemail@example.com',
    });

    expect(result.getName()).toBe('John Doe');
    expect(result.getEmail()).toBe('newemail@example.com');
    expect(result.getUpdatedAt().getTime()).toBeGreaterThan(originalUpdatedAt);
  });

  it('should update both name and email', async () => {
    const user = new User({
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      lastQuizDate: null,
    });
    await repository.save(user);
    const originalUpdatedAt = user.getUpdatedAt().getTime();

    await new Promise(resolve => setTimeout(resolve, 1));

    const result = await updateUser.execute({
      userId: 'user-1',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
    });

    expect(result.getName()).toBe('Jane Smith');
    expect(result.getEmail()).toBe('jane.smith@example.com');
    expect(result.getUpdatedAt().getTime()).toBeGreaterThan(originalUpdatedAt);
  });

  it('should throw error if user does not exist', async () => {
    await expect(
      updateUser.execute({
        userId: 'non-existent',
        name: 'Test User',
      })
    ).rejects.toThrow('User not found');
  });

  it('should throw error if new email already exists', async () => {
    const user1 = new User({
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastQuizDate: null,
    });
    const user2 = new User({
      id: 'user-2',
      name: 'Jane Doe',
      email: 'jane@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastQuizDate: null,
    });
    await repository.save(user1);
    await repository.save(user2);

    await expect(
      updateUser.execute({
        userId: 'user-1',
        email: 'jane@example.com',
      })
    ).rejects.toThrow('Email already exists');
  });

  it('should be case-insensitive when checking email uniqueness', async () => {
    const user1 = new User({
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastQuizDate: null,
    });
    const user2 = new User({
      id: 'user-2',
      name: 'Jane Doe',
      email: 'jane@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastQuizDate: null,
    });
    await repository.save(user1);
    await repository.save(user2);

    await expect(
      updateUser.execute({
        userId: 'user-1',
        email: 'JANE@example.com',
      })
    ).rejects.toThrow('Email already exists');
  });

  it('should allow updating to the same email (same user)', async () => {
    const user = new User({
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      lastQuizDate: null,
    });
    await repository.save(user);

    const result = await updateUser.execute({
      userId: 'user-1',
      email: 'john@example.com',
    });

    expect(result.getEmail()).toBe('john@example.com');
  });

  it('should normalize email to lowercase', async () => {
    const user = new User({
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      lastQuizDate: null,
    });
    await repository.save(user);

    const result = await updateUser.execute({
      userId: 'user-1',
      email: 'NewEmail@Example.COM',
    });

    expect(result.getEmail()).toBe('newemail@example.com');
  });

  it('should trim name when updating', async () => {
    const user = new User({
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      lastQuizDate: null,
    });
    await repository.save(user);

    const result = await updateUser.execute({
      userId: 'user-1',
      name: '  Jane Doe  ',
    });

    expect(result.getName()).toBe('Jane Doe');
  });

  it('should not update if no changes provided', async () => {
    const user = new User({
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      lastQuizDate: null,
    });
    await repository.save(user);

    const result = await updateUser.execute({
      userId: 'user-1',
    });

    expect(result.getName()).toBe('John Doe');
    expect(result.getEmail()).toBe('john@example.com');
  });
});
