# TASK-003-04: Создание утилит для работы с датами

**Дата создания:** 2025-12-12 11:41 (UTC+3, Брест)  
**Статус:** Новая  
**Приоритет:** Высокий  
**Исполнитель:** Bitrix24 Программист (Vue.js)  
**Родительская задача:** [TASK-003](TASK-003-services-utilities.md)  
**Подэтап:** 3.4 из 6  
**Длительность:** 1 день

---

## Описание

Создание утилит `dateHelpers.js` для работы с датами в приложении табеля присутствия. Реализация функций для определения сегодняшнего дня, выходных, праздников, количества дней в месяце и текущей недели.

**Связь с ТЗ:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - разделы 10.1, 5.3  
**Связь с этапами:** [DOCS/TZ/implementation-stages.md](../TZ/implementation-stages.md) - Этап 3, Подэтап 3.4

---

## Контекст

Это четвёртый подэтап создания сервисов и утилит. Утилиты для работы с датами необходимы для правильного отображения календаря, определения выходных и праздников, работы с неделями.

**Зависит от:**
- TASK-001-05: Настройка базовой структуры компонентов (файл уже создан)

---

## Модули и компоненты

### Frontend (JavaScript)
- `js/vue-apps/timesheet/utils/dateHelpers.js` — утилиты для работы с датами

---

## Зависимости

- **От каких задач зависит:**
  - TASK-001-05: Настройка базовой структуры компонентов
- **Какие задачи зависят от этой:**
  - TASK-004: Базовые компоненты Vue.js — будет использовать эти утилиты

---

## Ступенчатые подзадачи

### Шаг 1: Открытие файла
1. Открыть файл `js/vue-apps/timesheet/utils/dateHelpers.js`
2. Проверить, что файл существует

### Шаг 2: Реализация базовых функций
1. `getCurrentDate()` — получение текущей даты
2. `getCurrentYear()` — получение текущего года
3. `getCurrentMonth()` — получение текущего месяца (1-12)

### Шаг 3: Реализация функций проверки дат
1. `isToday(date)` — проверка, является ли дата сегодняшним днём
2. `isWeekend(date)` — проверка, является ли дата выходным (суббота, воскресенье)
3. `isHoliday(date, holidays)` — проверка, является ли дата праздником

### Шаг 4: Реализация функций работы с месяцами
1. `getDaysInMonth(year, month)` — получение количества дней в месяце
2. `getFirstDayOfMonth(year, month)` — получение первого дня месяца
3. `getLastDayOfMonth(year, month)` — получение последнего дня месяца

### Шаг 5: Реализация функций работы с неделями
1. `getCurrentWeek()` — получение текущей недели (понедельник-воскресенье)
2. `getWeekRange(date)` — получение диапазона недели для указанной даты
3. `isDateInWeek(date, weekStart, weekEnd)` — проверка, входит ли дата в неделю

### Шаг 6: Реализация функций форматирования
1. `formatDate(date)` — форматирование даты для отображения
2. `formatDateForAPI(date)` — форматирование даты для API (YYYY-MM-DD)
3. `parseDate(dateString)` — парсинг строки даты

### Шаг 7: Экспорт всех функций
1. Экспортировать все функции
2. Проверить синтаксис

---

## Технические требования

### JavaScript
- **Версия:** ES6+ (ES Modules)
- **Формат:** ES Modules (import/export)
- **Типы:** Чистые функции (без побочных эффектов)

### Работа с датами
- Использование встроенного объекта `Date`
- Учёт часового пояса UTC+3 (Брест, РБ)
- Формат дат: ISO 8601 для API, локализованный для отображения

---

## Критерии приёмки

- [ ] Созданы все функции для работы с датами
- [ ] Функции работают корректно:
  - [ ] `getCurrentDate()`, `getCurrentYear()`, `getCurrentMonth()`
  - [ ] `isToday()`, `isWeekend()`, `isHoliday()`
  - [ ] `getDaysInMonth()`, `getFirstDayOfMonth()`, `getLastDayOfMonth()`
  - [ ] `getCurrentWeek()`, `getWeekRange()`, `isDateInWeek()`
  - [ ] `formatDate()`, `formatDateForAPI()`, `parseDate()`
- [ ] Функции экспортированы
- [ ] Код соответствует стандартам ESLint

---

## Примеры кода

### dateHelpers.js
```javascript
/**
 * Утилиты для работы с датами
 * 
 * Все функции работают с датами в часовом поясе UTC+3 (Брест, РБ)
 */

/**
 * Получение текущей даты
 * 
 * @returns {Date} Текущая дата
 */
export function getCurrentDate() {
    return new Date();
}

/**
 * Получение текущего года
 * 
 * @returns {number} Текущий год
 */
export function getCurrentYear() {
    return new Date().getFullYear();
}

/**
 * Получение текущего месяца (1-12)
 * 
 * @returns {number} Текущий месяц (1-12)
 */
export function getCurrentMonth() {
    return new Date().getMonth() + 1;
}

/**
 * Проверка, является ли дата сегодняшним днём
 * 
 * @param {Date|string} date Дата для проверки
 * @returns {boolean} true если дата сегодняшняя
 */
export function isToday(date) {
    const today = new Date();
    const checkDate = date instanceof Date ? date : new Date(date);
    
    return today.getFullYear() === checkDate.getFullYear() &&
           today.getMonth() === checkDate.getMonth() &&
           today.getDate() === checkDate.getDate();
}

/**
 * Проверка, является ли дата выходным (суббота, воскресенье)
 * 
 * @param {Date|string} date Дата для проверки
 * @returns {boolean} true если дата выходная
 */
export function isWeekend(date) {
    const checkDate = date instanceof Date ? date : new Date(date);
    const dayOfWeek = checkDate.getDay();
    
    return dayOfWeek === 0 || dayOfWeek === 6; // 0 = воскресенье, 6 = суббота
}

/**
 * Проверка, является ли дата праздником
 * 
 * @param {Date|string} date Дата для проверки
 * @param {string[]} holidays Массив праздников (формат "YYYY-MM-DD")
 * @returns {boolean} true если дата праздничная
 */
export function isHoliday(date, holidays) {
    if (!holidays || !Array.isArray(holidays) || holidays.length === 0) {
        return false;
    }
    
    const dateStr = formatDateForAPI(date);
    return holidays.includes(dateStr);
}

/**
 * Получение количества дней в месяце
 * 
 * @param {number} year Год
 * @param {number} month Месяц (1-12)
 * @returns {number} Количество дней в месяце
 */
export function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}

/**
 * Получение первого дня месяца
 * 
 * @param {number} year Год
 * @param {number} month Месяц (1-12)
 * @returns {Date} Первый день месяца
 */
export function getFirstDayOfMonth(year, month) {
    return new Date(year, month - 1, 1);
}

/**
 * Получение последнего дня месяца
 * 
 * @param {number} year Год
 * @param {number} month Месяц (1-12)
 * @returns {Date} Последний день месяца
 */
export function getLastDayOfMonth(year, month) {
    const daysInMonth = getDaysInMonth(year, month);
    return new Date(year, month - 1, daysInMonth);
}

/**
 * Получение текущей недели (понедельник-воскресенье)
 * 
 * @returns {Object} Объект с полями monday и sunday (Date)
 */
export function getCurrentWeek() {
    const today = new Date();
    return getWeekRange(today);
}

/**
 * Получение диапазона недели для указанной даты
 * 
 * @param {Date|string} date Дата
 * @returns {Object} Объект с полями monday и sunday (Date)
 */
export function getWeekRange(date) {
    const checkDate = date instanceof Date ? date : new Date(date);
    const dayOfWeek = checkDate.getDay();
    
    // Вычисление понедельника (1 = понедельник, 0 = воскресенье)
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(checkDate);
    monday.setDate(checkDate.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    
    // Вычисление воскресенья
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    
    return { monday, sunday };
}

/**
 * Проверка, входит ли дата в неделю
 * 
 * @param {Date|string} date Дата для проверки
 * @param {Date} weekStart Начало недели (понедельник)
 * @param {Date} weekEnd Конец недели (воскресенье)
 * @returns {boolean} true если дата входит в неделю
 */
export function isDateInWeek(date, weekStart, weekEnd) {
    const checkDate = date instanceof Date ? date : new Date(date);
    return checkDate >= weekStart && checkDate <= weekEnd;
}

/**
 * Форматирование даты для отображения (DD.MM.YYYY)
 * 
 * @param {Date|string} date Дата
 * @returns {string} Отформатированная дата
 */
export function formatDate(date) {
    const d = date instanceof Date ? date : new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    return `${day}.${month}.${year}`;
}

/**
 * Форматирование даты для API (YYYY-MM-DD)
 * 
 * @param {Date|string} date Дата
 * @returns {string} Дата в формате YYYY-MM-DD
 */
export function formatDateForAPI(date) {
    const d = date instanceof Date ? date : new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

/**
 * Парсинг строки даты
 * 
 * @param {string} dateString Строка даты (YYYY-MM-DD или DD.MM.YYYY)
 * @returns {Date} Объект Date
 */
export function parseDate(dateString) {
    // Поддержка форматов YYYY-MM-DD и DD.MM.YYYY
    if (dateString.includes('-')) {
        return new Date(dateString);
    } else if (dateString.includes('.')) {
        const [day, month, year] = dateString.split('.');
        return new Date(year, month - 1, day);
    }
    
    return new Date(dateString);
}
```

### Использование
```javascript
import {
    getCurrentDate,
    isToday,
    isWeekend,
    getDaysInMonth,
    getCurrentWeek,
    formatDate
} from './utils/dateHelpers.js';

// Получение текущей даты
const today = getCurrentDate();

// Проверка, сегодня ли дата
const isTodayDate = isToday(new Date('2025-12-12'));

// Проверка выходного
const isWeekendDay = isWeekend(new Date('2025-12-14')); // воскресенье

// Количество дней в месяце
const days = getDaysInMonth(2025, 12); // 31

// Текущая неделя
const week = getCurrentWeek();
console.log('Week:', week.monday, '-', week.sunday);

// Форматирование даты
const formatted = formatDate(new Date()); // "12.12.2025"
```

---

## Тестирование

### Тестирование функций
```javascript
import * as dateHelpers from './utils/dateHelpers.js';

// Тест isToday
console.log(dateHelpers.isToday(new Date())); // true
console.log(dateHelpers.isToday(new Date('2020-01-01'))); // false

// Тест isWeekend
console.log(dateHelpers.isWeekend(new Date('2025-12-14'))); // true (воскресенье)
console.log(dateHelpers.isWeekend(new Date('2025-12-15'))); // false (понедельник)

// Тест getDaysInMonth
console.log(dateHelpers.getDaysInMonth(2025, 2)); // 28
console.log(dateHelpers.getDaysInMonth(2025, 12)); // 31

// Тест getCurrentWeek
const week = dateHelpers.getCurrentWeek();
console.log('Week range:', week.monday, '-', week.sunday);
```

---

## История правок

- **2025-12-12 11:41 (UTC+3, Брест):** Создана задача TASK-003-04

---

## Примечания

### Важные замечания
- Все функции должны быть чистыми (без побочных эффектов)
- Функции должны работать с разными форматами дат (Date, string)
- Учитывать часовой пояс UTC+3 (Брест, РБ)

### Следующие шаги
После завершения этого подэтапа можно переходить к:
- TASK-003-05: Создание утилит валидации
- TASK-004: Базовые компоненты Vue.js — будет использовать эти утилиты

---

## Связь с документацией

- **Родительская задача:** [TASK-003](TASK-003-services-utilities.md)
- **Техническое задание:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - разделы 10.1, 5.3

