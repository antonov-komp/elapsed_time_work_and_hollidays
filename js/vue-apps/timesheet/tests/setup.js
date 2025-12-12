/**
 * Настройка тестового окружения
 * 
 * Этот файл выполняется перед каждым тестом
 * Используется для глобальной настройки моков и утилит
 */

import { vi } from 'vitest';

// Мок для глобального объекта BX (Bitrix24)
global.BX = {
  ajax: vi.fn(),
  ready: vi.fn((callback) => callback()),
  UI: {
    Notification: {
      Center: {
        notify: vi.fn()
      }
    }
  }
};

// Мок для fetch API
global.fetch = vi.fn();

// Мок для window.location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:5173',
    origin: 'http://localhost:5173',
    pathname: '/',
    search: '',
    hash: ''
  },
  writable: true
});

