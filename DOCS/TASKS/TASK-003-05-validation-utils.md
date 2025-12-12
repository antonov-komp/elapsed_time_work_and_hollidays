# TASK-003-05: Создание утилит валидации

**Дата создания:** 2025-12-12 11:41 (UTC+3, Брест)  
**Статус:** Новая  
**Приоритет:** Высокий  
**Исполнитель:** Bitrix24 Программист (Vue.js)  
**Родительская задача:** [TASK-003](TASK-003-services-utilities.md)  
**Подэтап:** 3.5 из 6  
**Длительность:** 0.5 дня

---

## Описание

Создание утилит `validation.js` для валидации данных на фронтенде. Реализация функций проверки часов, статусов, записей дней, года и месяца.

**Связь с ТЗ:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - разделы 10.1, 7.2  
**Связь с этапами:** [DOCS/TZ/implementation-stages.md](../TZ/implementation-stages.md) - Этап 3, Подэтап 3.5

---

## Контекст

Это пятый подэтап создания сервисов и утилит. Утилиты валидации необходимы для проверки данных перед отправкой на сервер и для отображения ошибок пользователю.

**Зависит от:**
- TASK-001-05: Настройка базовой структуры компонентов (файл уже создан)

---

## Модули и компоненты

### Frontend (JavaScript)
- `js/vue-apps/timesheet/utils/validation.js` — утилиты валидации

---

## Зависимости

- **От каких задач зависит:**
  - TASK-001-05: Настройка базовой структуры компонентов
- **Какие задачи зависят от этой:**
  - TASK-004: Базовые компоненты Vue.js — будет использовать эти утилиты

---

## Ступенчатые подзадачи

### Шаг 1: Открытие файла
1. Открыть файл `js/vue-apps/timesheet/utils/validation.js`
2. Проверить, что файл существует

### Шаг 2: Реализация функции validateHours
1. Создать функцию `validateHours(hours)`
2. Проверить, что часы — число
3. Проверить диапазон: 0-24
4. Проверить шаг: должен быть кратен 0.5
5. Вернуть объект `{valid: boolean, error: string|null}`

### Шаг 3: Реализация функции validateStatus
1. Создать функцию `validateStatus(status)`
2. Проверить, что статус — строка или null
3. Если строка, проверить допустимые значения
4. Вернуть объект `{valid: boolean, error: string|null}`

### Шаг 4: Реализация функции validateDayEntry
1. Создать функцию `validateDayEntry(dayEntry)`
2. Проверить структуру (объект с полями `hours` и `status`)
3. Проверить бизнес-правило: часы и статус не одновременно
4. Вызвать `validateHours()` и `validateStatus()` при необходимости
5. Вернуть объект `{valid: boolean, errors: string[]}`

### Шаг 5: Реализация функций validateYear и validateMonth
1. `validateYear(year)` — проверка года (2025-2035)
2. `validateMonth(month)` — проверка месяца (1-12)
3. Вернуть объект `{valid: boolean, error: string|null}`

### Шаг 6: Экспорт всех функций
1. Экспортировать все функции
2. Проверить синтаксис

---

## Технические требования

### JavaScript
- **Версия:** ES6+ (ES Modules)
- **Формат:** ES Modules (import/export)
- **Типы:** Чистые функции

### Формат возврата
- Все функции возвращают объект с полями:
  - `valid: boolean` — валидны ли данные
  - `error: string|null` — сообщение об ошибке (для простых функций)
  - `errors: string[]` — массив ошибок (для сложных функций)

---

## Критерии приёмки

- [ ] Созданы все функции валидации:
  - [ ] `validateHours()`
  - [ ] `validateStatus()`
  - [ ] `validateDayEntry()`
  - [ ] `validateYear()`
  - [ ] `validateMonth()`
- [ ] Функции возвращают ошибки валидации
- [ ] Функции работают корректно
- [ ] Функции экспортированы
- [ ] Код соответствует стандартам ESLint

---

## Примеры кода

### validation.js
```javascript
/**
 * Утилиты для валидации данных на фронтенде
 */

/**
 * Валидация часов
 * 
 * @param {number} hours Часы для проверки
 * @returns {Object} {valid: boolean, error: string|null}
 */
export function validateHours(hours) {
    if (typeof hours !== 'number' || isNaN(hours)) {
        return { valid: false, error: 'Часы должны быть числом' };
    }
    
    if (hours < 0 || hours > 24) {
        return { valid: false, error: 'Часы должны быть в диапазоне 0-24' };
    }
    
    // Проверка шага 0.5
    const step = 0.5;
    const remainder = hours % step;
    
    if (remainder > 0.001 && remainder < (step - 0.001)) {
        return { valid: false, error: 'Часы должны быть кратны 0.5' };
    }
    
    return { valid: true, error: null };
}

/**
 * Валидация статуса
 * 
 * @param {string|null} status Статус для проверки
 * @returns {Object} {valid: boolean, error: string|null}
 */
export function validateStatus(status) {
    // null допустим
    if (status === null || status === undefined) {
        return { valid: true, error: null };
    }
    
    if (typeof status !== 'string') {
        return { valid: false, error: 'Статус должен быть строкой или null' };
    }
    
    const allowedStatuses = [
        'Больничный',
        'Командировка',
        'Отпуск календарный',
        'Отпуск за свой счёт'
    ];
    
    if (!allowedStatuses.includes(status)) {
        return {
            valid: false,
            error: `Неверный статус. Допустимые значения: ${allowedStatuses.join(', ')}`
        };
    }
    
    return { valid: true, error: null };
}

/**
 * Валидация записи дня
 * 
 * @param {Object} dayEntry Запись дня {hours: number, status: string|null}
 * @returns {Object} {valid: boolean, errors: string[]}
 */
export function validateDayEntry(dayEntry) {
    const errors = [];
    
    // Проверка структуры
    if (!dayEntry || typeof dayEntry !== 'object') {
        return { valid: false, errors: ['Запись дня должна быть объектом'] };
    }
    
    if (!('hours' in dayEntry) || !('status' in dayEntry)) {
        return { valid: false, errors: ['Запись дня должна содержать поля "hours" и "status"'] };
    }
    
    const { hours, status } = dayEntry;
    
    // Проверка бизнес-правила: часы и статус не одновременно
    const hasHours = typeof hours === 'number' && hours > 0;
    const hasStatus = status !== null && status !== undefined && status !== '';
    
    if (hasHours && hasStatus) {
        errors.push('Нельзя указать одновременно часы и статус');
    }
    
    // Валидация часов (если указаны)
    if (hasHours) {
        const hoursValidation = validateHours(hours);
        if (!hoursValidation.valid) {
            errors.push(hoursValidation.error);
        }
    } else if (hours !== 0 && hours !== null && hours !== undefined) {
        errors.push('Если указан статус, часы должны быть 0 или null');
    }
    
    // Валидация статуса (если указан)
    if (hasStatus) {
        const statusValidation = validateStatus(status);
        if (!statusValidation.valid) {
            errors.push(statusValidation.error);
        }
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Валидация года
 * 
 * @param {number} year Год для проверки
 * @returns {Object} {valid: boolean, error: string|null}
 */
export function validateYear(year) {
    if (typeof year !== 'number' || isNaN(year)) {
        return { valid: false, error: 'Год должен быть числом' };
    }
    
    const yearInt = Math.floor(year);
    
    if (yearInt < 2025 || yearInt > 2035) {
        return { valid: false, error: 'Год должен быть в диапазоне 2025-2035' };
    }
    
    return { valid: true, error: null };
}

/**
 * Валидация месяца
 * 
 * @param {number} month Месяц для проверки
 * @returns {Object} {valid: boolean, error: string|null}
 */
export function validateMonth(month) {
    if (typeof month !== 'number' || isNaN(month)) {
        return { valid: false, error: 'Месяц должен быть числом' };
    }
    
    const monthInt = Math.floor(month);
    
    if (monthInt < 1 || monthInt > 12) {
        return { valid: false, error: 'Месяц должен быть в диапазоне 1-12' };
    }
    
    return { valid: true, error: null };
}
```

### Использование
```javascript
import {
    validateHours,
    validateStatus,
    validateDayEntry,
    validateYear,
    validateMonth
} from './utils/validation.js';

// Валидация часов
const hoursResult = validateHours(8.0);
console.log(hoursResult); // {valid: true, error: null}

const hoursResult2 = validateHours(8.3);
console.log(hoursResult2); // {valid: false, error: 'Часы должны быть кратны 0.5'}

// Валидация статуса
const statusResult = validateStatus('Больничный');
console.log(statusResult); // {valid: true, error: null}

// Валидация записи дня
const dayEntry = { hours: 8.0, status: null };
const dayResult = validateDayEntry(dayEntry);
console.log(dayResult); // {valid: true, errors: []}

const invalidDayEntry = { hours: 8.0, status: 'Больничный' };
const invalidDayResult = validateDayEntry(invalidDayEntry);
console.log(invalidDayResult); // {valid: false, errors: ['Нельзя указать одновременно часы и статус']}
```

---

## Тестирование

### Тестирование функций
```javascript
import * as validation from './utils/validation.js';

// Тест validateHours
console.log(validation.validateHours(8.0)); // {valid: true}
console.log(validation.validateHours(8.3)); // {valid: false}
console.log(validation.validateHours(25)); // {valid: false}

// Тест validateStatus
console.log(validation.validateStatus('Больничный')); // {valid: true}
console.log(validation.validateStatus(null)); // {valid: true}
console.log(validation.validateStatus('Неверный')); // {valid: false}

// Тест validateDayEntry
console.log(validation.validateDayEntry({hours: 8.0, status: null})); // {valid: true}
console.log(validation.validateDayEntry({hours: 0, status: 'Больничный'})); // {valid: true}
console.log(validation.validateDayEntry({hours: 8.0, status: 'Больничный'})); // {valid: false}
```

---

## История правок

- **2025-12-12 11:41 (UTC+3, Брест):** Создана задача TASK-003-05

---

## Примечания

### Важные замечания
- Все функции должны возвращать понятные сообщения об ошибках
- Бизнес-правила должны проверяться строго
- Функции должны быть чистыми (без побочных эффектов)

### Следующие шаги
После завершения этого подэтапа можно переходить к:
- TASK-003-06: Создание констант
- TASK-004: Базовые компоненты Vue.js — будет использовать эти утилиты

---

## Связь с документацией

- **Родительская задача:** [TASK-003](TASK-003-services-utilities.md)
- **Техническое задание:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - разделы 10.1, 7.2


