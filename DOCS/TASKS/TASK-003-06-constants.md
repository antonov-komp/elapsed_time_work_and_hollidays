# TASK-003-06: Создание констант

**Дата создания:** 2025-12-12 11:41 (UTC+3, Брест)  
**Статус:** Новая  
**Приоритет:** Средний  
**Исполнитель:** Bitrix24 Программист (Vue.js)  
**Родительская задача:** [TASK-003](TASK-003-services-utilities.md)  
**Подэтап:** 3.6 из 6  
**Длительность:** 0.5 дня

---

## Описание

Создание файла `constants.js` с константами приложения: статусы, цвета для разных типов дней, конфигурация (диапазон лет, шаг часов).

**Связь с ТЗ:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - разделы 10.1, 3.4  
**Связь с этапами:** [DOCS/TZ/implementation-stages.md](../TZ/implementation-stages.md) - Этап 3, Подэтап 3.6

---

## Контекст

Это шестой (последний) подэтап создания сервисов и утилит. Константы необходимы для единообразного использования значений во всех компонентах приложения.

**Зависит от:**
- TASK-001-05: Настройка базовой структуры компонентов (файл уже создан)

---

## Модули и компоненты

### Frontend (JavaScript)
- `js/vue-apps/timesheet/utils/constants.js` — файл с константами

---

## Зависимости

- **От каких задач зависит:**
  - TASK-001-05: Настройка базовой структуры компонентов
- **Какие задачи зависят от этой:**
  - TASK-004: Базовые компоненты Vue.js — будет использовать эти константы

---

## Ступенчатые подзадачи

### Шаг 1: Открытие файла
1. Открыть файл `js/vue-apps/timesheet/utils/constants.js`
2. Проверить, что файл существует

### Шаг 2: Реализация константы STATUSES
1. Создать объект `STATUSES` со статусами:
   - `SICK: 'Больничный'`
   - `BUSINESS_TRIP: 'Командировка'`
   - `VACATION: 'Отпуск календарный'`
   - `UNPAID_VACATION: 'Отпуск за свой счёт'`
2. Добавить массив всех статусов: `STATUSES_LIST`

### Шаг 3: Реализация константы COLORS
1. Создать объект `COLORS` с цветами для разных типов дней:
   - `WORKDAY: '#ffffff'` — рабочий день
   - `WEEKEND: '#f0f0f0'` — выходной
   - `HOLIDAY: '#ffebee'` — праздник
   - `TODAY: '#e3f2fd'` — сегодняшний день
   - `FILLED: '#e8f5e9'` — день с заполненными часами
   - `INCOMPLETE: '#fff9c4'` — неполный день (< 8 часов)
   - `STATUS_SICK: '#ffcdd2'` — больничный
   - `STATUS_BUSINESS_TRIP: '#c8e6c9'` — командировка
   - `STATUS_VACATION: '#b3e5fc'` — отпуск
   - `STATUS_UNPAID_VACATION: '#fff9c4'` — отпуск за свой счёт

### Шаг 4: Реализация константы CONFIG
1. Создать объект `CONFIG` с конфигурацией:
   - `MIN_YEAR: 2025` — минимальный год
   - `MAX_YEAR: 2035` — максимальный год
   - `HOUR_STEP: 0.5` — шаг часов
   - `MIN_HOURS: 0` — минимальное количество часов
   - `MAX_HOURS: 24` — максимальное количество часов
   - `STANDARD_HOURS: 8` — стандартное количество часов в день

### Шаг 5: Экспорт всех констант
1. Экспортировать все константы
2. Проверить синтаксис

---

## Технические требования

### JavaScript
- **Версия:** ES6+ (ES Modules)
- **Формат:** ES Modules (import/export)
- **Типы:** Константы (const)

---

## Критерии приёмки

- [ ] Создан файл с константами
- [ ] Определена константа `STATUSES`:
  - [ ] Все статусы определены
  - [ ] Создан массив `STATUSES_LIST`
- [ ] Определена константа `COLORS`:
  - [ ] Все цвета определены
  - [ ] Цвета соответствуют гайдлайнам
- [ ] Определена константа `CONFIG`:
  - [ ] Все параметры конфигурации определены
- [ ] Все константы экспортированы
- [ ] Код соответствует стандартам ESLint

---

## Примеры кода

### constants.js
```javascript
/**
 * Константы приложения табеля присутствия
 */

/**
 * Статусы для дней табеля
 */
export const STATUSES = {
    SICK: 'Больничный',
    BUSINESS_TRIP: 'Командировка',
    VACATION: 'Отпуск календарный',
    UNPAID_VACATION: 'Отпуск за свой счёт'
};

/**
 * Массив всех статусов
 */
export const STATUSES_LIST = Object.values(STATUSES);

/**
 * Цвета для разных типов дней
 */
export const COLORS = {
    // Базовые цвета
    WORKDAY: '#ffffff',           // Рабочий день (белый)
    WEEKEND: '#f0f0f0',          // Выходной (светло-серый)
    HOLIDAY: '#ffebee',          // Праздник (светло-красный)
    TODAY: '#e3f2fd',            // Сегодняшний день (светло-синий)
    
    // Цвета для заполненных дней
    FILLED: '#e8f5e9',           // День с заполненными часами (светло-зелёный)
    INCOMPLETE: '#fff9c4',       // Неполный день < 8 часов (светло-жёлтый)
    
    // Цвета для статусов
    STATUS_SICK: '#ffcdd2',      // Больничный (розовый)
    STATUS_BUSINESS_TRIP: '#c8e6c9', // Командировка (светло-зелёный)
    STATUS_VACATION: '#b3e5fc',  // Отпуск календарный (светло-голубой)
    STATUS_UNPAID_VACATION: '#fff9c4' // Отпуск за свой счёт (светло-жёлтый)
};

/**
 * Конфигурация приложения
 */
export const CONFIG = {
    // Диапазон лет
    MIN_YEAR: 2025,
    MAX_YEAR: 2035,
    
    // Часы
    HOUR_STEP: 0.5,              // Шаг часов (30 минут)
    MIN_HOURS: 0,                // Минимальное количество часов
    MAX_HOURS: 24,               // Максимальное количество часов
    STANDARD_HOURS: 8,           // Стандартное количество часов в день
    
    // Часовой пояс
    TIMEZONE: 'Europe/Minsk',    // UTC+3 (Брест, РБ)
    
    // Форматы дат
    DATE_FORMAT_DISPLAY: 'DD.MM.YYYY',  // Формат отображения
    DATE_FORMAT_API: 'YYYY-MM-DD'       // Формат для API
};
```

### Использование
```javascript
import { STATUSES, COLORS, CONFIG } from './utils/constants.js';

// Использование статусов
const status = STATUSES.SICK; // 'Больничный'
const allStatuses = STATUSES_LIST; // ['Больничный', 'Командировка', ...]

// Использование цветов
const workdayColor = COLORS.WORKDAY; // '#ffffff'
const todayColor = COLORS.TODAY; // '#e3f2fd'

// Использование конфигурации
const minYear = CONFIG.MIN_YEAR; // 2025
const hourStep = CONFIG.HOUR_STEP; // 0.5
const standardHours = CONFIG.STANDARD_HOURS; // 8
```

### Использование в компоненте Vue.js
```vue
<script setup>
import { STATUSES, COLORS, CONFIG } from './utils/constants.js';

const dayStatus = STATUSES.SICK;
const dayColor = COLORS.STATUS_SICK;

// Проверка года
const year = 2025;
if (year >= CONFIG.MIN_YEAR && year <= CONFIG.MAX_YEAR) {
    // Год валиден
}
</script>

<template>
    <div :style="{ backgroundColor: dayColor }">
        {{ dayStatus }}
    </div>
</template>
```

---

## Тестирование

### Проверка констант
```javascript
import { STATUSES, COLORS, CONFIG } from './utils/constants.js';

// Проверка статусов
console.log('Statuses:', STATUSES);
console.log('Sick status:', STATUSES.SICK); // 'Больничный'

// Проверка цветов
console.log('Colors:', COLORS);
console.log('Workday color:', COLORS.WORKDAY); // '#ffffff'

// Проверка конфигурации
console.log('Config:', CONFIG);
console.log('Min year:', CONFIG.MIN_YEAR); // 2025
console.log('Hour step:', CONFIG.HOUR_STEP); // 0.5
```

---

## История правок

- **2025-12-12 11:41 (UTC+3, Брест):** Создана задача TASK-003-06

---

## Примечания

### Важные замечания
- Все константы должны быть неизменяемыми (const)
- Цвета должны соответствовать гайдлайнам Bitrix24 (если применимо)
- Конфигурация должна быть централизованной для удобства изменения

### Следующие шаги
После завершения этого подэтапа можно переходить к:
- TASK-004: Базовые компоненты Vue.js — будет использовать эти константы

---

## Связь с документацией

- **Родительская задача:** [TASK-003](TASK-003-services-utilities.md)
- **Техническое задание:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - разделы 10.1, 3.4


