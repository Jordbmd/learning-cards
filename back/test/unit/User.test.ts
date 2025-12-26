import { describe, it, expect } from 'vitest';
import User from '../../src/domain/entities/User.js';

describe('User', () => {
  const validProps = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'John Doe',
    email: 'john@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
    lastQuizDate: null
  };

  describe('constructor', () => {
    it('should create a valid user', () => {
      const user = new User(validProps);
      
      expect(user.getId()).toBe(validProps.id);
      expect(user.getName()).toBe(validProps.name);
      expect(user.getEmail()).toBe(validProps.email);
      expect(user.getCreatedAt()).toBe(validProps.createdAt);
      expect(user.getUpdatedAt()).toBe(validProps.updatedAt);
    });

    it('should throw error when id is empty', () => {
      const props = { ...validProps, id: '' };
      expect(() => new User(props)).toThrow('User ID cannot be empty');
    });

    it('should throw error when id is only whitespace', () => {
      const props = { ...validProps, id: '   ' };
      expect(() => new User(props)).toThrow('User ID cannot be empty');
    });

    it('should throw error when name is empty', () => {
      const props = { ...validProps, name: '' };
      expect(() => new User(props)).toThrow('Name cannot be empty');
    });

    it('should throw error when name is only whitespace', () => {
      const props = { ...validProps, name: '   ' };
      expect(() => new User(props)).toThrow('Name cannot be empty');
    });

    it('should throw error when name exceeds 100 characters', () => {
      const props = { ...validProps, name: 'a'.repeat(101) };
      expect(() => new User(props)).toThrow('Name cannot exceed 100 characters');
    });

    it('should accept name with exactly 100 characters', () => {
      const props = { ...validProps, name: 'a'.repeat(100) };
      const user = new User(props);
      expect(user.getName()).toBe('a'.repeat(100));
    });

    it('should throw error when email is empty', () => {
      const props = { ...validProps, email: '' };
      expect(() => new User(props)).toThrow('Email cannot be empty');
    });

    it('should throw error when email is only whitespace', () => {
      const props = { ...validProps, email: '   ' };
      expect(() => new User(props)).toThrow('Email cannot be empty');
    });

    it('should throw error when email has invalid format - no @', () => {
      const props = { ...validProps, email: 'invalidemail.com' };
      expect(() => new User(props)).toThrow('Invalid email format');
    });

    it('should throw error when email has invalid format - no domain', () => {
      const props = { ...validProps, email: 'test@' };
      expect(() => new User(props)).toThrow('Invalid email format');
    });

    it('should throw error when email has invalid format - no extension', () => {
      const props = { ...validProps, email: 'test@domain' };
      expect(() => new User(props)).toThrow('Invalid email format');
    });

    it('should accept valid email with subdomain', () => {
      const props = { ...validProps, email: 'user@mail.example.com' };
      const user = new User(props);
      expect(user.getEmail()).toBe('user@mail.example.com');
    });

    it('should accept email with numbers', () => {
      const props = { ...validProps, email: 'user123@example.com' };
      const user = new User(props);
      expect(user.getEmail()).toBe('user123@example.com');
    });

    it('should accept email with dots', () => {
      const props = { ...validProps, email: 'first.last@example.com' };
      const user = new User(props);
      expect(user.getEmail()).toBe('first.last@example.com');
    });

    it('should accept email with hyphens', () => {
      const props = { ...validProps, email: 'user-name@example.com' };
      const user = new User(props);
      expect(user.getEmail()).toBe('user-name@example.com');
    });
  });

  describe('updateName', () => {
    it('should update name successfully', () => {
      const user = new User(validProps);
      const originalUpdatedAt = user.getUpdatedAt();

      user.updateName('Jane Smith');

      expect(user.getName()).toBe('Jane Smith');
      expect(user.getUpdatedAt().getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });

    it('should trim name when updating', () => {
      const user = new User(validProps);
      user.updateName('  Jane Smith  ');
      expect(user.getName()).toBe('Jane Smith');
    });

    it('should throw error if name is empty', () => {
      const user = new User(validProps);
      expect(() => user.updateName('')).toThrow('Name cannot be empty');
    });

    it('should throw error if name exceeds 100 characters', () => {
      const user = new User(validProps);
      const longName = 'a'.repeat(101);
      expect(() => user.updateName(longName)).toThrow('Name cannot exceed 100 characters');
    });
  });

  describe('updateEmail', () => {
    it('should update email successfully', async () => {
      const user = new User(validProps);
      const originalUpdatedAt = user.getUpdatedAt();

      await new Promise(resolve => setTimeout(resolve, 1));

      user.updateEmail('newemail@example.com');

      expect(user.getEmail()).toBe('newemail@example.com');
      expect(user.getUpdatedAt().getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });

    it('should normalize email to lowercase', () => {
      const user = new User(validProps);
      user.updateEmail('NewEmail@Example.COM');
      expect(user.getEmail()).toBe('newemail@example.com');
    });

    it('should trim email when updating', () => {
      const user = new User(validProps);
      user.updateEmail('  test@example.com  ');
      expect(user.getEmail()).toBe('test@example.com');
    });

    it('should throw error if email format is invalid', () => {
      const user = new User(validProps);
      expect(() => user.updateEmail('invalid-email')).toThrow('Invalid email format');
    });

    it('should throw error if email exceeds 255 characters', () => {
      const user = new User(validProps);
      const longEmail = 'a'.repeat(247) + '@test.com'; 
      expect(() => user.updateEmail(longEmail)).toThrow('Email cannot exceed 255 characters');
    });
  });
});
