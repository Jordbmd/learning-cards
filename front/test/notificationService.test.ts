import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock localStorage before importing the service
const localStorageMock: Record<string, string> = {};
global.localStorage = {
  getItem: vi.fn((key: string) => localStorageMock[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    localStorageMock[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete localStorageMock[key];
  }),
  clear: vi.fn(() => {
    Object.keys(localStorageMock).forEach(key => delete localStorageMock[key]);
  }),
  length: 0,
  key: vi.fn(),
} as Storage;

// Mock Notification API before importing the service
const notificationMock = {
  permission: 'default' as NotificationPermission,
  requestPermission: vi.fn().mockResolvedValue('granted'),
};
global.Notification = notificationMock as unknown as typeof Notification;

// Mock timers
global.setTimeout = vi.fn(() => {
  return 1 as unknown as NodeJS.Timeout;
}) as unknown as typeof setTimeout;
global.clearInterval = vi.fn();
global.setInterval = vi.fn(() => 1) as unknown as typeof setInterval;

import { notificationService } from '../src/services/notificationService';

describe('NotificationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.keys(localStorageMock).forEach(key => delete localStorageMock[key]);
    notificationMock.permission = 'default';
  });



  describe('requestPermission', () => {
    it('should return true when permission is already granted', async () => {
      notificationMock.permission = 'granted';
      const result = await notificationService.requestPermission();
      expect(result).toBe(true);
    });

    it('should request permission when not denied', async () => {
      notificationMock.permission = 'default';
      notificationMock.requestPermission.mockResolvedValue('granted');
      
      const result = await notificationService.requestPermission();
      
      expect(result).toBe(true);
      expect(notificationMock.requestPermission).toHaveBeenCalled();
    });

    it('should return false when permission is denied', async () => {
      notificationMock.permission = 'denied';
      const result = await notificationService.requestPermission();
      expect(result).toBe(false);
    });

    it('should return false when Notification API is not supported', async () => {
      const originalNotification = global.Notification;
      delete (global as { Notification?: typeof Notification }).Notification;
      
      const result = await notificationService.requestPermission();
      
      expect(result).toBe(false);
      
      global.Notification = originalNotification;
    });
  });

  describe('setNotificationTime', () => {
    it('should update existing notification time', () => {
      notificationService.setNotificationTime('10:00');
      notificationService.setNotificationTime('15:00');
      
      expect(notificationService.getNotificationTime()).toBe('15:00');
      expect(localStorage.setItem).toHaveBeenCalledTimes(2);
    });
  });

  describe('getNotificationTime', () => {
    it('should return set notification time', () => {
      notificationService.setNotificationTime('09:00');
      const result = notificationService.getNotificationTime();
      expect(result).toBe('09:00');
    });
  });

  describe('testNotification', () => {
    it('should show notification when permission is granted', () => {
      const notificationConstructor = vi.fn();
      notificationMock.permission = 'granted';
      global.Notification = notificationConstructor as unknown as typeof Notification;
      Object.defineProperty(global.Notification, 'permission', {
        value: 'granted',
        writable: true,
        configurable: true,
      });
      
      notificationService.testNotification();
      
      expect(notificationConstructor).toHaveBeenCalledWith(
        'Learning Cards - Quiz du jour',
        expect.objectContaining({
          body: expect.stringContaining('réviser vos cartes'),
        })
      );
    });

    it('should not show notification when permission is not granted', () => {
      const notificationConstructor = vi.fn();
      notificationMock.permission = 'denied';
      global.Notification = notificationConstructor as unknown as typeof Notification;
      Object.defineProperty(global.Notification, 'permission', {
        value: 'denied',
        writable: true,
        configurable: true,
      });
      
      notificationService.testNotification();
      
      expect(notificationConstructor).not.toHaveBeenCalled();
    });
  });

  describe('localStorage persistence', () => {
    it('should handle missing localStorage data gracefully', () => {
      expect(() => {
        notificationService.getNotificationTime();
      }).not.toThrow();
    });
  });
});
