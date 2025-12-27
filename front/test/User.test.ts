import { describe, it, expect } from 'vitest';
import type { User } from '../src/domain/types/User';

describe('User Type', () => {
  it('should have correct User interface structure', () => {
    const user: User = {
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
    };

    expect(user.id).toBe('user-123');
    expect(user.name).toBe('Test User');
    expect(user.email).toBe('test@example.com');
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });

  it('should allow valid user object', () => {
    const validUser: User = {
      id: '12345',
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(validUser).toBeDefined();
    expect(typeof validUser.id).toBe('string');
    expect(typeof validUser.name).toBe('string');
    expect(typeof validUser.email).toBe('string');
  });
});
