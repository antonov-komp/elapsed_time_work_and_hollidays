/**
 * Константы приложения
 */

// Статусы
export const STATUSES = {
  SICK: 'Больничный',
  BUSINESS_TRIP: 'Командировка',
  VACATION: 'Отпуск календарный',
  UNPAID_VACATION: 'Отпуск за свой счёт'
};

// Цвета для разных типов дней
export const COLORS = {
  WORKDAY: '#ffffff',
  WEEKEND: '#f0f0f0',
  HOLIDAY: '#ffebee',
  TODAY: '#e3f2fd',
  FILLED: '#e8f5e9',
  INCOMPLETE: '#fff9c4'
};

// Конфигурация
export const CONFIG = {
  MIN_YEAR: 2025,
  MAX_YEAR: 2035,
  HOUR_STEP: 0.5,
  MIN_HOURS: 0,
  MAX_HOURS: 24,
  STANDARD_HOURS: 8
};

