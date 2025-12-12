# TASK-003-03: Создание сервиса для работы с праздниками

**Дата создания:** 2025-12-12 11:41 (UTC+3, Брест)  
**Статус:** Новая  
**Приоритет:** Высокий  
**Исполнитель:** Bitrix24 Программист (Vue.js)  
**Родительская задача:** [TASK-003](TASK-003-services-utilities.md)  
**Подэтап:** 3.3 из 6  
**Длительность:** 0.5 дня

---

## Описание

Создание сервиса `HolidaysService.js` для работы с праздниками Республики Беларусь. Реализация методов получения праздников за год и проверки, является ли дата праздником.

**Связь с ТЗ:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - разделы 10.1, 5.3.1  
**Связь с этапами:** [DOCS/TZ/implementation-stages.md](../TZ/implementation-stages.md) - Этап 3, Подэтап 3.3

---

## Контекст

Это третий подэтап создания сервисов. Сервис для работы с праздниками необходим для правильного отображения праздничных дней в календаре и исключения их из автоматического заполнения недели.

**Зависит от:**
- TASK-002-03: Создание API endpoint для получения праздников
- TASK-001-05: Настройка базовой структуры компонентов (файл уже создан)

---

## Модули и компоненты

### Frontend (JavaScript)
- `js/vue-apps/timesheet/services/HolidaysService.js` — сервис для работы с праздниками

### Используемые API
- `GET /api/holidays.php?year={year}` — получение праздников за год

---

## Зависимости

- **От каких задач зависит:**
  - TASK-002-03: Создание API endpoint для получения праздников
  - TASK-001-05: Настройка базовой структуры компонентов
- **Какие задачи зависят от этой:**
  - TASK-003-04: Создание утилит для работы с датами (будет использовать этот сервис)
  - TASK-004: Базовые компоненты Vue.js — будет использовать этот сервис

---

## Ступенчатые подзадачи

### Шаг 1: Открытие файла
1. Открыть файл `js/vue-apps/timesheet/services/HolidaysService.js`
2. Проверить, что файл существует

### Шаг 2: Создание класса HolidaysService
1. Создать класс `HolidaysService`
2. Добавить приватное свойство для кэша: `#cache = new Map()`
3. Добавить JSDoc комментарии

### Шаг 3: Реализация метода getHolidays
1. Создать статический метод `getHolidays(year)`
2. Проверить кэш: если данные для года уже есть, вернуть из кэша
3. Реализовать GET запрос к `/api/holidays.php`
4. Передать параметр `year` в URL
5. Обработать ответ:
   - Проверить `success`
   - Извлечь массив праздников из `data`
6. Сохранить в кэш: `this.#cache.set(year, holidays)`
7. Вернуть Promise с массивом праздников

### Шаг 4: Реализация метода isHoliday
1. Создать статический метод `isHoliday(date, holidays)`
2. Привести дату к формату "YYYY-MM-DD"
3. Проверить наличие даты в массиве праздников
4. Вернуть `true` или `false`

### Шаг 5: Реализация кэширования
1. Использовать Map для хранения кэша
2. Ключ: год (number)
3. Значение: массив дат (string[])
4. Очистка кэша не требуется (данные статичны)

### Шаг 6: Обработка ошибок
1. Обработать ошибки HTTP
2. Обработать ошибки API
3. Логировать ошибки
4. Пробрасывать понятные сообщения

### Шаг 7: Экспорт класса
1. Экспортировать класс
2. Проверить синтаксис

---

## Технические требования

### JavaScript
- **Версия:** ES6+ (ES Modules)
- **Формат:** ES Modules (import/export)
- **Кэширование:** Map для хранения данных в памяти

### Формат данных
- Праздники: массив строк в формате "YYYY-MM-DD"
- Пример: `["2025-01-01", "2025-01-07", "2025-03-08"]`

---

## Критерии приёмки

- [ ] Создан класс `HolidaysService`
- [ ] Реализован метод `getHolidays(year)`
- [ ] Реализован метод `isHoliday(date, holidays)`
- [ ] Кэширование данных реализовано
- [ ] Методы возвращают Promise или boolean
- [ ] Обработка ошибок реализована
- [ ] Класс экспортирован
- [ ] Код соответствует стандартам ESLint

---

## Примеры кода

### HolidaysService.js
```javascript
/**
 * Сервис для работы с праздниками Республики Беларусь
 * 
 * Использует API endpoint: GET /api/holidays.php
 * Кэширует данные в памяти для оптимизации
 */
export class HolidaysService {
    // Приватное свойство для кэша
    static #cache = new Map();
    
    /**
     * Получение праздников за указанный год
     * 
     * @param {number} year Год (2025-2035)
     * @returns {Promise<string[]>} Массив дат праздников в формате "YYYY-MM-DD"
     * @throws {Error} При ошибке запроса или API
     */
    static async getHolidays(year) {
        try {
            // Проверка кэша
            if (this.#cache.has(year)) {
                return this.#cache.get(year);
            }
            
            const url = `/api/holidays.php?year=${year}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Ошибка получения праздников');
            }
            
            const holidays = data.data || [];
            
            // Сохранение в кэш
            this.#cache.set(year, holidays);
            
            return holidays;
            
        } catch (error) {
            console.error('HolidaysService.getHolidays error:', error);
            throw error;
        }
    }
    
    /**
     * Проверка, является ли дата праздником
     * 
     * @param {Date|string} date Дата для проверки
     * @param {string[]} holidays Массив праздников (формат "YYYY-MM-DD")
     * @returns {boolean} true если дата является праздником
     */
    static isHoliday(date, holidays) {
        if (!holidays || !Array.isArray(holidays) || holidays.length === 0) {
            return false;
        }
        
        // Приведение даты к формату "YYYY-MM-DD"
        const dateObj = date instanceof Date ? date : new Date(date);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        
        return holidays.includes(dateStr);
    }
    
    /**
     * Очистка кэша (опционально, для тестирования)
     */
    static clearCache() {
        this.#cache.clear();
    }
}
```

### Использование в компоненте
```javascript
import { HolidaysService } from './services/HolidaysService.js';

// Получение праздников за год
async function loadHolidays() {
    try {
        const holidays = await HolidaysService.getHolidays(2025);
        console.log('Holidays 2025:', holidays);
        // ["2025-01-01", "2025-01-07", "2025-03-08", ...]
    } catch (error) {
        console.error('Ошибка загрузки праздников:', error);
    }
}

// Проверка, является ли дата праздником
const date = new Date('2025-01-01');
const holidays = await HolidaysService.getHolidays(2025);
const isHoliday = HolidaysService.isHoliday(date, holidays);
console.log('Is holiday:', isHoliday); // true
```

---

## Тестирование

### Тестирование в консоли браузера
```javascript
import { HolidaysService } from './services/HolidaysService.js';

// Тест получения праздников
HolidaysService.getHolidays(2025)
    .then(holidays => {
        console.log('Holidays:', holidays);
        console.log('Count:', holidays.length); // должно быть 8
    })
    .catch(error => {
        console.error('Error:', error);
    });

// Тест кэширования
HolidaysService.getHolidays(2025)
    .then(() => {
        // Второй запрос должен использовать кэш
        return HolidaysService.getHolidays(2025);
    })
    .then(holidays => {
        console.log('From cache:', holidays);
    });

// Тест проверки праздника
const date = new Date('2025-01-01');
HolidaysService.getHolidays(2025)
    .then(holidays => {
        const isHoliday = HolidaysService.isHoliday(date, holidays);
        console.log('Is holiday:', isHoliday); // true
    });
```

---

## История правок

- **2025-12-12 11:41 (UTC+3, Брест):** Создана задача TASK-003-03

---

## Примечания

### Важные замечания
- Кэширование важно для производительности (данные статичны)
- Метод `isHoliday` должен работать с разными форматами дат
- Кэш можно очистить через `clearCache()` для тестирования

### Следующие шаги
После завершения этого подэтапа можно переходить к:
- TASK-003-04: Создание утилит для работы с датами
- TASK-004: Базовые компоненты Vue.js — будет использовать этот сервис

---

## Связь с документацией

- **Родительская задача:** [TASK-003](TASK-003-services-utilities.md)
- **Техническое задание:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - разделы 10.1, 5.3.1

