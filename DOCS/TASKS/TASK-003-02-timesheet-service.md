# TASK-003-02: Создание сервиса для работы с табелем

**Дата создания:** 2025-12-12 11:41 (UTC+3, Брест)  
**Статус:** Новая  
**Приоритет:** Высокий  
**Исполнитель:** Bitrix24 Программист (Vue.js)  
**Родительская задача:** [TASK-003](TASK-003-services-utilities.md)  
**Подэтап:** 3.2 из 6  
**Длительность:** 1 день

---

## Описание

Создание сервиса `TimesheetApiService.js` для работы с табелем присутствия через собственные API endpoints. Реализация методов получения и сохранения данных табеля.

**Связь с ТЗ:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - разделы 10.1, 5.2  
**Связь с этапами:** [DOCS/TZ/implementation-stages.md](../TZ/implementation-stages.md) - Этап 3, Подэтап 3.2

---

## Контекст

Это второй подэтап создания сервисов. Сервис для работы с табелем необходим для получения и сохранения данных табеля из Vue.js компонентов.

**Зависит от:**
- TASK-002-01: Создание API endpoint для получения данных табеля
- TASK-002-02: Создание API endpoint для сохранения данных табеля
- TASK-001-05: Настройка базовой структуры компонентов (файл уже создан)

---

## Модули и компоненты

### Frontend (JavaScript)
- `js/vue-apps/timesheet/services/TimesheetApiService.js` — сервис для работы с табелем

### Используемые API
- `GET /api/timesheet.php?year={year}&month={month}` — получение данных
- `POST /api/timesheet.php?year={year}&month={month}` — сохранение данных

---

## Зависимости

- **От каких задач зависит:**
  - TASK-002-01: Создание API endpoint для получения данных табеля
  - TASK-002-02: Создание API endpoint для сохранения данных табеля
  - TASK-001-05: Настройка базовой структуры компонентов
- **Какие задачи зависят от этой:**
  - TASK-004: Базовые компоненты Vue.js — будет использовать этот сервис

---

## Ступенчатые подзадачи

### Шаг 1: Открытие файла
1. Открыть файл `js/vue-apps/timesheet/services/TimesheetApiService.js`
2. Проверить, что файл существует

### Шаг 2: Создание класса TimesheetApiService
1. Создать класс `TimesheetApiService`
2. Добавить JSDoc комментарии

### Шаг 3: Реализация метода getTimesheet
1. Создать статический метод `getTimesheet(year, month)`
2. Реализовать GET запрос к `/api/timesheet.php`
3. Передать параметры `year` и `month` в URL
4. Обработать ответ:
   - Проверить `success`
   - Извлечь данные из `data`
   - Обработать случай `null` (файл не существует)
5. Вернуть Promise с данными табеля или `null`

### Шаг 4: Реализация метода saveTimesheet
1. Создать статический метод `saveTimesheet(year, month, days)`
2. Реализовать POST запрос к `/api/timesheet.php`
3. Передать параметры `year` и `month` в URL
4. Сформировать тело запроса:
   ```json
   {
     "days": {
       "1": {"hours": 8.0, "status": null},
       "2": {"hours": 7.5, "status": null}
     }
   }
   ```
5. Установить заголовок `Content-Type: application/json`
6. Обработать ответ:
   - Проверить `success`
   - Извлечь данные из `data`
7. Вернуть Promise с результатом сохранения

### Шаг 5: Обработка ошибок API
1. Обработать ошибки HTTP (статус коды 400, 403, 500)
2. Обработать ошибки валидации (массив `errors` в ответе)
3. Логировать ошибки в консоль
4. Пробрасывать понятные сообщения об ошибках

### Шаг 6: Экспорт класса
1. Экспортировать класс
2. Проверить синтаксис

---

## Технические требования

### JavaScript
- **Версия:** ES6+ (ES Modules)
- **Формат:** ES Modules (import/export)
- **HTTP клиент:** fetch() API

### Формат запросов
- GET: параметры в URL query string
- POST: данные в теле запроса (JSON)

### Формат ответов
- Успех: `{success: true, data: {...}}`
- Ошибка: `{success: false, error: "...", errors: {...}}`

---

## Критерии приёмки

- [ ] Создан класс `TimesheetApiService`
- [ ] Реализован метод `getTimesheet(year, month)`
- [ ] Реализован метод `saveTimesheet(year, month, days)`
- [ ] Методы возвращают Promise
- [ ] Обработка ошибок API реализована
- [ ] Обработка ошибок валидации реализована
- [ ] Класс экспортирован
- [ ] Код соответствует стандартам ESLint

---

## Примеры кода

### TimesheetApiService.js
```javascript
/**
 * Сервис для работы с табелем присутствия через API
 * 
 * Использует собственные API endpoints:
 * - GET /api/timesheet.php - получение данных
 * - POST /api/timesheet.php - сохранение данных
 */
export class TimesheetApiService {
    /**
     * Получение данных табеля за указанный месяц
     * 
     * @param {number} year Год (2025-2035)
     * @param {number} month Месяц (1-12)
     * @returns {Promise<Object|null>} Данные табеля или null, если файл не существует
     * @throws {Error} При ошибке запроса или API
     */
    static async getTimesheet(year, month) {
        try {
            const url = `/api/timesheet.php?year=${year}&month=${month}`;
            
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
                throw new Error(data.error || 'Ошибка получения данных табеля');
            }
            
            // Возвращаем данные или null, если файл не существует
            return data.data;
            
        } catch (error) {
            console.error('TimesheetApiService.getTimesheet error:', error);
            throw error;
        }
    }
    
    /**
     * Сохранение данных табеля за указанный месяц
     * 
     * @param {number} year Год (2025-2035)
     * @param {number} month Месяц (1-12)
     * @param {Object} days Данные дней (объект с ключами-номерами дней)
     * @returns {Promise<Object>} Результат сохранения (created_at, updated_at)
     * @throws {Error} При ошибке запроса, валидации или API
     */
    static async saveTimesheet(year, month, days) {
        try {
            const url = `/api/timesheet.php?year=${year}&month=${month}`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ days })
            });
            
            const data = await response.json();
            
            if (!response.ok || !data.success) {
                // Обработка ошибок валидации
                if (data.errors && Object.keys(data.errors).length > 0) {
                    const errorMessages = Object.values(data.errors).join(', ');
                    throw new Error(`Ошибка валидации: ${errorMessages}`);
                }
                
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }
            
            return data.data;
            
        } catch (error) {
            console.error('TimesheetApiService.saveTimesheet error:', error);
            throw error;
        }
    }
}
```

### Использование в компоненте
```javascript
import { TimesheetApiService } from './services/TimesheetApiService.js';

// Получение данных табеля
async function loadTimesheet() {
    try {
        const timesheet = await TimesheetApiService.getTimesheet(2025, 12);
        if (timesheet) {
            console.log('Timesheet data:', timesheet);
            console.log('Days:', timesheet.days);
        } else {
            console.log('Табель не существует, создаём новый');
        }
    } catch (error) {
        console.error('Ошибка загрузки табеля:', error);
    }
}

// Сохранение данных табеля
async function saveTimesheet() {
    try {
        const days = {
            1: { hours: 8.0, status: null },
            2: { hours: 7.5, status: null },
            3: { hours: 0, status: 'Больничный' }
        };
        
        const result = await TimesheetApiService.saveTimesheet(2025, 12, days);
        console.log('Табель сохранён:', result);
    } catch (error) {
        console.error('Ошибка сохранения табеля:', error);
    }
}
```

---

## Тестирование

### Тестирование в консоли браузера
```javascript
import { TimesheetApiService } from './services/TimesheetApiService.js';

// Тест получения табеля
TimesheetApiService.getTimesheet(2025, 12)
    .then(timesheet => {
        console.log('Timesheet:', timesheet);
    })
    .catch(error => {
        console.error('Error:', error);
    });

// Тест сохранения табеля
const days = {
    1: { hours: 8.0, status: null },
    2: { hours: 7.5, status: null }
};

TimesheetApiService.saveTimesheet(2025, 12, days)
    .then(result => {
        console.log('Saved:', result);
    })
    .catch(error => {
        console.error('Error:', error);
    });
```

---

## История правок

- **2025-12-12 11:41 (UTC+3, Брест):** Создана задача TASK-003-02

---

## Примечания

### Важные замечания
- Методы должны обрабатывать все типы ошибок (HTTP, валидация, API)
- При ошибке валидации нужно показывать понятные сообщения
- Метод `getTimesheet` может вернуть `null`, если файл не существует

### Следующие шаги
После завершения этого подэтапа можно переходить к:
- TASK-003-03: Создание сервиса для работы с праздниками
- TASK-004: Базовые компоненты Vue.js — будет использовать этот сервис

---

## Связь с документацией

- **Родительская задача:** [TASK-003](TASK-003-services-utilities.md)
- **Предыдущий подэтап:** [TASK-003-01](TASK-003-01-bitrix24-service.md)
- **Техническое задание:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - разделы 10.1, 5.2

