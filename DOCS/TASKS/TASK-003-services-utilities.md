# TASK-003: Сервисы и утилиты (JavaScript)

**Дата создания:** 2025-12-12 11:37 (UTC+3, Брест)  
**Статус:** Завершена  
**Приоритет:** Высокий  
**Исполнитель:** Bitrix24 Программист (Vue.js)  
**Этап:** Этап 3 из 7  
**Длительность:** 3-4 дня

---

## Описание

Создание сервисов и утилит на JavaScript для работы с API, датами, валидацией и константами. Реализация интеграции с Bitrix24 API и собственными API endpoints.

**Связь с ТЗ:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - разделы 10.1, 5.2  
**Связь с этапами:** [DOCS/TZ/implementation-stages.md](../TZ/implementation-stages.md) - Этап 3

---

## Контекст

Это третий этап разработки интерфейса табеля присутствия. Сервисы и утилиты необходимы для работы Vue.js компонентов. Без них невозможно получать данные из API, работать с датами и валидировать данные на фронтенде.

**Зависит от:**
- TASK-002: Backend API (PHP endpoints) — API endpoints должны быть готовы
- TASK-001-05: Настройка базовой структуры компонентов — файлы сервисов и утилит уже созданы

**Цель:** Создать все сервисы и утилиты для работы Vue.js приложения с API и данными.

---

## Модули и компоненты

### Frontend (JavaScript)
- `js/vue-apps/timesheet/services/Bitrix24ApiService.js` — сервис для работы с Bitrix24 API
- `js/vue-apps/timesheet/services/TimesheetApiService.js` — сервис для работы с табелем
- `js/vue-apps/timesheet/services/HolidaysService.js` — сервис для работы с праздниками
- `js/vue-apps/timesheet/utils/dateHelpers.js` — утилиты для работы с датами
- `js/vue-apps/timesheet/utils/validation.js` — утилиты валидации
- `js/vue-apps/timesheet/utils/constants.js` — константы приложения

### Структура папок
- `js/vue-apps/timesheet/services/` — папка для сервисов
- `js/vue-apps/timesheet/utils/` — папка для утилит

---

## Зависимости

- **От каких задач зависит:**
  - TASK-002: Backend API (PHP endpoints)
    - TASK-002-01: Создание API endpoint для получения данных табеля
    - TASK-002-02: Создание API endpoint для сохранения данных табеля
    - TASK-002-03: Создание API endpoint для получения праздников
  - TASK-001-05: Настройка базовой структуры компонентов (файлы уже созданы)
- **Какие задачи зависят от этой:**
  - TASK-004: Базовые компоненты Vue.js — будет использовать эти сервисы и утилиты

---

## Ступенчатые подзадачи (6 подэтапов)

### Подэтап 3.1: Создание сервиса для работы с Bitrix24 API
**Длительность:** 0.5 дня

1. Открыть файл `js/vue-apps/timesheet/services/Bitrix24ApiService.js`
2. Создать класс `Bitrix24ApiService`
3. Реализовать метод получения данных пользователя:
   - `getCurrentUser()` — получение данных через `user.current`
   - Использование BX.ajax() или fetch()
   - Обработка ошибок
4. Реализовать интеграцию с BX.* API (если требуется)
5. Экспортировать класс

**Результат:** Рабочий сервис для получения данных пользователя из Bitrix24

---

### Подэтап 3.2: Создание сервиса для работы с табелем
**Длительность:** 1 день

1. Открыть файл `js/vue-apps/timesheet/services/TimesheetApiService.js`
2. Создать класс `TimesheetApiService`
3. Реализовать метод получения данных табеля:
   - `getTimesheet(year, month)` — GET запрос к `/api/timesheet.php`
   - Обработка ответа
   - Обработка ошибок
4. Реализовать метод сохранения данных табеля:
   - `saveTimesheet(year, month, days)` — POST запрос к `/api/timesheet.php`
   - Формирование тела запроса
   - Обработка ответа
   - Обработка ошибок
5. Реализовать обработку ошибок API (retry, сообщения пользователю)
6. Экспортировать класс

**Результат:** Рабочий сервис для получения и сохранения данных табеля

---

### Подэтап 3.3: Создание сервиса для работы с праздниками
**Длительность:** 0.5 дня

1. Открыть файл `js/vue-apps/timesheet/services/HolidaysService.js`
2. Создать класс `HolidaysService`
3. Реализовать метод получения праздников:
   - `getHolidays(year)` — GET запрос к `/api/holidays.php`
   - Кэширование данных в памяти
   - Обработка ошибок
4. Реализовать метод проверки праздника:
   - `isHoliday(date)` — проверка, является ли дата праздником
5. Экспортировать класс

**Результат:** Рабочий сервис для получения и проверки праздников

---

### Подэтап 3.4: Создание утилит для работы с датами
**Длительность:** 1 день

1. Открыть файл `js/vue-apps/timesheet/utils/dateHelpers.js`
2. Реализовать функции:
   - `getCurrentDate()` — получение текущей даты
   - `getCurrentYear()` — получение текущего года
   - `getCurrentMonth()` — получение текущего месяца
   - `isToday(date)` — проверка, является ли дата сегодняшним днём
   - `isWeekend(date)` — проверка, является ли дата выходным (суббота, воскресенье)
   - `isHoliday(date, holidays)` — проверка, является ли дата праздником
   - `getDaysInMonth(year, month)` — получение количества дней в месяце
   - `getCurrentWeek()` — получение текущей недели (понедельник-воскресенье)
   - `formatDate(date)` — форматирование даты для отображения
3. Экспортировать все функции

**Результат:** Набор утилит для работы с датами

---

### Подэтап 3.5: Создание утилит валидации
**Длительность:** 0.5 дня

1. Открыть файл `js/vue-apps/timesheet/utils/validation.js`
2. Реализовать функции валидации:
   - `validateHours(hours)` — проверка часов (0-24, шаг 0.5)
   - `validateStatus(status)` — проверка статуса (допустимые значения)
   - `validateDayEntry(dayEntry)` — проверка записи дня (часы и статус не одновременно)
   - `validateYear(year)` — проверка года (2025-2035)
   - `validateMonth(month)` — проверка месяца (1-12)
3. Реализовать возврат ошибок валидации (массив строк)
4. Экспортировать все функции

**Результат:** Набор утилит для валидации данных на фронтенде

---

### Подэтап 3.6: Создание констант
**Длительность:** 0.5 дня

1. Открыть файл `js/vue-apps/timesheet/utils/constants.js`
2. Реализовать константы:
   - `STATUSES` — объект со статусами (Больничный, Командировка, и т.д.)
   - `COLORS` — объект с цветами для разных типов дней
   - `CONFIG` — объект с конфигурацией (диапазон лет, шаг часов, и т.д.)
3. Экспортировать все константы

**Результат:** Файл с константами для использования в компонентах

---

## API-методы Bitrix24

### Используемые методы
- `user.current` — получение данных текущего пользователя
  - Документация: https://context7.com/bitrix24/rest/user.current
  - Используется в `Bitrix24ApiService.getCurrentUser()`

---

## Технические требования

### JavaScript
- **Версия:** ES6+ (ES Modules)
- **Формат:** ES Modules (import/export)
- **Стандарты:** ESLint (если настроен)

### Интеграция с Bitrix24
- Использование BX.ajax() или fetch() для запросов
- Использование BX.* API для уведомлений (опционально)

### Структура сервисов
- Классы с методами
- Статические методы или методы экземпляра
- Обработка ошибок через try-catch
- Возврат Promise для асинхронных операций

---

## Критерии приёмки

### Подэтап 3.1
- [ ] Создан класс `Bitrix24ApiService`
- [ ] Реализован метод `getCurrentUser()`
- [ ] Метод возвращает Promise с данными пользователя
- [ ] Обработка ошибок реализована

### Подэтап 3.2
- [ ] Создан класс `TimesheetApiService`
- [ ] Реализован метод `getTimesheet(year, month)`
- [ ] Реализован метод `saveTimesheet(year, month, days)`
- [ ] Обработка ошибок API реализована
- [ ] Методы возвращают Promise

### Подэтап 3.3
- [ ] Создан класс `HolidaysService`
- [ ] Реализован метод `getHolidays(year)`
- [ ] Реализован метод `isHoliday(date)`
- [ ] Кэширование данных реализовано

### Подэтап 3.4
- [ ] Созданы все функции для работы с датами
- [ ] Функции работают корректно
- [ ] Функции экспортированы

### Подэтап 3.5
- [ ] Созданы все функции валидации
- [ ] Функции возвращают ошибки валидации
- [ ] Функции работают корректно

### Подэтап 3.6
- [ ] Создан файл с константами
- [ ] Все константы определены
- [ ] Константы экспортированы

### Общие критерии
- [ ] Все сервисы и утилиты готовы
- [ ] Интеграция с Bitrix24 API работает
- [ ] Интеграция с собственными API endpoints работает
- [ ] Код соответствует стандартам ESLint (если настроен)

---

## Примеры кода

### Bitrix24ApiService.js (базовый)
```javascript
/**
 * Сервис для работы с Bitrix24 REST API
 */
export class Bitrix24ApiService {
    /**
     * Получение данных текущего пользователя
     * 
     * @returns {Promise<Object>} Данные пользователя
     */
    static async getCurrentUser() {
        try {
            // Использование BX.ajax (если доступен)
            if (typeof BX !== 'undefined' && BX.ajax) {
                return new Promise((resolve, reject) => {
                    BX.ajax({
                        url: '/rest/user.current.json',
                        method: 'GET',
                        onsuccess: (response) => {
                            const data = JSON.parse(response);
                            if (data.error) {
                                reject(new Error(data.error_description || data.error));
                            } else {
                                resolve(data.result);
                            }
                        },
                        onfailure: (error) => {
                            reject(new Error('Ошибка запроса к Bitrix24 API'));
                        }
                    });
                });
            }
            
            // Fallback: использование fetch
            const response = await fetch('/rest/user.current.json');
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error_description || data.error);
            }
            
            return data.result;
        } catch (error) {
            console.error('Bitrix24ApiService.getCurrentUser error:', error);
            throw error;
        }
    }
}
```

### TimesheetApiService.js (базовый)
```javascript
/**
 * Сервис для работы с табелем присутствия через API
 */
export class TimesheetApiService {
    /**
     * Получение данных табеля
     * 
     * @param {number} year Год
     * @param {number} month Месяц
     * @returns {Promise<Object|null>} Данные табеля или null
     */
    static async getTimesheet(year, month) {
        try {
            const response = await fetch(`/api/timesheet.php?year=${year}&month=${month}`);
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Ошибка получения данных табеля');
            }
            
            return data.data;
        } catch (error) {
            console.error('TimesheetApiService.getTimesheet error:', error);
            throw error;
        }
    }
    
    /**
     * Сохранение данных табеля
     * 
     * @param {number} year Год
     * @param {number} month Месяц
     * @param {Object} days Данные дней
     * @returns {Promise<Object>} Результат сохранения
     */
    static async saveTimesheet(year, month, days) {
        try {
            const response = await fetch(`/api/timesheet.php?year=${year}&month=${month}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ days })
            });
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Ошибка сохранения данных табеля');
            }
            
            return data.data;
        } catch (error) {
            console.error('TimesheetApiService.saveTimesheet error:', error);
            throw error;
        }
    }
}
```

### dateHelpers.js (базовый)
```javascript
/**
 * Утилиты для работы с датами
 */

/**
 * Получение текущей даты
 */
export function getCurrentDate() {
    return new Date();
}

/**
 * Получение текущего года
 */
export function getCurrentYear() {
    return new Date().getFullYear();
}

/**
 * Получение текущего месяца (1-12)
 */
export function getCurrentMonth() {
    return new Date().getMonth() + 1;
}

/**
 * Проверка, является ли дата сегодняшним днём
 */
export function isToday(date) {
    const today = new Date();
    const checkDate = new Date(date);
    
    return today.getFullYear() === checkDate.getFullYear() &&
           today.getMonth() === checkDate.getMonth() &&
           today.getDate() === checkDate.getDate();
}

/**
 * Проверка, является ли дата выходным (суббота, воскресенье)
 */
export function isWeekend(date) {
    const checkDate = new Date(date);
    const dayOfWeek = checkDate.getDay();
    
    return dayOfWeek === 0 || dayOfWeek === 6; // 0 = воскресенье, 6 = суббота
}

/**
 * Проверка, является ли дата праздником
 */
export function isHoliday(date, holidays) {
    if (!holidays || !Array.isArray(holidays)) {
        return false;
    }
    
    const dateStr = formatDateForComparison(date);
    return holidays.includes(dateStr);
}

/**
 * Получение количества дней в месяце
 */
export function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}

/**
 * Получение текущей недели (понедельник-воскресенье)
 */
export function getCurrentWeek() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Понедельник
    
    const monday = new Date(today.setDate(diff));
    const sunday = new Date(today.setDate(diff + 6));
    
    return {
        monday: new Date(monday),
        sunday: new Date(sunday)
    };
}

/**
 * Форматирование даты для сравнения (YYYY-MM-DD)
 */
function formatDateForComparison(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}
```

---

## Тестирование

### Тестирование сервисов
```javascript
// Тест Bitrix24ApiService
import { Bitrix24ApiService } from './services/Bitrix24ApiService.js';
const user = await Bitrix24ApiService.getCurrentUser();
console.log('User:', user);

// Тест TimesheetApiService
import { TimesheetApiService } from './services/TimesheetApiService.js';
const timesheet = await TimesheetApiService.getTimesheet(2025, 12);
console.log('Timesheet:', timesheet);

// Тест HolidaysService
import { HolidaysService } from './services/HolidaysService.js';
const holidays = await HolidaysService.getHolidays(2025);
console.log('Holidays:', holidays);
```

---

## История правок

- **2025-12-12 11:37 (UTC+3, Брест):** Создана задача TASK-003 на основе Этапа 3, разбита на 6 подэтапов
- **2025-12-12 12:09 (UTC+3, Брест):** Задача завершена. Реализованы все 6 подэтапов:
  - Подэтап 3.1: Bitrix24ApiService с методом getCurrentUser()
  - Подэтап 3.2: TimesheetApiService с методами getTimesheet() и saveTimesheet()
  - Подэтап 3.3: HolidaysService с методами getHolidays() и isHoliday()
  - Подэтап 3.4: Утилиты для работы с датами (dateHelpers.js)
  - Подэтап 3.5: Утилиты валидации (validation.js)
  - Подэтап 3.6: Константы приложения (constants.js) дополнены

---

## Примечания

### Порядок выполнения подэтапов
Подэтапы можно выполнять последовательно или частично параллельно:
- Подэтапы 3.4, 3.5, 3.6 можно выполнять параллельно (не зависят друг от друга)
- Подэтапы 3.1, 3.2, 3.3 зависят от TASK-002 (API endpoints)

### Важные замечания
- Все сервисы должны обрабатывать ошибки
- Все асинхронные методы должны возвращать Promise
- Утилиты должны быть чистыми функциями (без побочных эффектов)

### Следующие шаги
После завершения TASK-003 можно переходить к:
- TASK-004: Базовые компоненты Vue.js — будет использовать эти сервисы и утилиты

---

## Связь с документацией

- **Техническое задание:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - разделы 10.1, 5.2
- **Этапы реализации:** [DOCS/TZ/implementation-stages.md](../TZ/implementation-stages.md) - Этап 3
- **Руководство по Vue.js:** [DOCS/GUIDES/vue-development.md](../GUIDES/vue-development.md)

