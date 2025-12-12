# TASK-003-01: Создание сервиса для работы с Bitrix24 API

**Дата создания:** 2025-12-12 11:41 (UTC+3, Брест)  
**Статус:** Новая  
**Приоритет:** Высокий  
**Исполнитель:** Bitrix24 Программист (Vue.js)  
**Родительская задача:** [TASK-003](TASK-003-services-utilities.md)  
**Подэтап:** 3.1 из 6  
**Длительность:** 0.5 дня

---

## Описание

Создание сервиса `Bitrix24ApiService.js` для работы с Bitrix24 REST API. Реализация метода получения данных текущего пользователя через API Bitrix24.

**Связь с ТЗ:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - разделы 10.1, 5.2  
**Связь с этапами:** [DOCS/TZ/implementation-stages.md](../TZ/implementation-stages.md) - Этап 3, Подэтап 3.1

---

## Контекст

Это первый подэтап создания сервисов и утилит. Сервис для работы с Bitrix24 API необходим для получения данных пользователя (ФИО, Должность, ID) во фронтенд приложении.

**Зависит от:**
- TASK-001-05: Настройка базовой структуры компонентов (файл уже создан)

---

## Модули и компоненты

### Frontend (JavaScript)
- `js/vue-apps/timesheet/services/Bitrix24ApiService.js` — сервис для работы с Bitrix24 API

---

## Зависимости

- **От каких задач зависит:**
  - TASK-001-05: Настройка базовой структуры компонентов
- **Какие задачи зависят от этой:**
  - TASK-004: Базовые компоненты Vue.js — будет использовать этот сервис

---

## Ступенчатые подзадачи

### Шаг 1: Открытие файла
1. Открыть файл `js/vue-apps/timesheet/services/Bitrix24ApiService.js`
2. Проверить, что файл существует (создан в TASK-001-05)

### Шаг 2: Создание класса Bitrix24ApiService
1. Создать класс `Bitrix24ApiService`
2. Использовать ES6 класс синтаксис
3. Добавить JSDoc комментарии

### Шаг 3: Реализация метода getCurrentUser
1. Создать статический метод `getCurrentUser()`
2. Реализовать получение данных через Bitrix24 API:
   - Использовать BX.ajax() (если доступен в Bitrix24)
   - Или использовать fetch() как fallback
3. Вызвать метод `user.current`:
   - URL: `/rest/user.current.json`
   - Метод: GET
4. Обработать ответ:
   - Проверить наличие ошибок
   - Извлечь данные пользователя из `result`
5. Вернуть Promise с данными пользователя

### Шаг 4: Обработка ошибок
1. Обернуть код в try-catch
2. Логировать ошибки в консоль
3. Пробрасывать ошибки дальше (throw)

### Шаг 5: Экспорт класса
1. Экспортировать класс: `export class Bitrix24ApiService`
2. Проверить синтаксис

---

## Технические требования

### JavaScript
- **Версия:** ES6+ (ES Modules)
- **Формат:** ES Modules (import/export)
- **Стандарты:** ESLint (если настроен)

### Bitrix24 API
- **Метод:** `user.current`
- **Документация:** https://context7.com/bitrix24/rest/user.current
- **Формат ответа:** JSON

### Интеграция
- Использование BX.ajax() (приоритет) или fetch() (fallback)
- Возврат Promise для асинхронных операций

---

## Критерии приёмки

- [ ] Создан класс `Bitrix24ApiService`
- [ ] Реализован метод `getCurrentUser()`
- [ ] Метод возвращает Promise с данными пользователя
- [ ] Метод использует BX.ajax() или fetch()
- [ ] Обработка ошибок реализована
- [ ] Класс экспортирован
- [ ] Код соответствует стандартам ESLint (если настроен)

---

## Примеры кода

### Bitrix24ApiService.js
```javascript
/**
 * Сервис для работы с Bitrix24 REST API
 * 
 * Используется для получения данных пользователя и других операций с Bitrix24
 */
export class Bitrix24ApiService {
    /**
     * Получение данных текущего пользователя
     * 
     * Метод Bitrix24 API: user.current
     * Документация: https://context7.com/bitrix24/rest/user.current
     * 
     * @returns {Promise<Object>} Данные пользователя (ID, NAME, LAST_NAME, SECOND_NAME, EMAIL, WORK_POSITION)
     * @throws {Error} При ошибке запроса или API
     */
    static async getCurrentUser() {
        try {
            // Использование BX.ajax (если доступен в Bitrix24)
            if (typeof BX !== 'undefined' && BX.ajax) {
                return new Promise((resolve, reject) => {
                    BX.ajax({
                        url: '/rest/user.current.json',
                        method: 'GET',
                        dataType: 'json',
                        onsuccess: (response) => {
                            try {
                                const data = typeof response === 'string' ? JSON.parse(response) : response;
                                
                                if (data.error) {
                                    reject(new Error(data.error_description || data.error));
                                    return;
                                }
                                
                                if (!data.result) {
                                    reject(new Error('Не удалось получить данные пользователя'));
                                    return;
                                }
                                
                                resolve(data.result);
                            } catch (parseError) {
                                reject(new Error('Ошибка парсинга ответа от Bitrix24 API'));
                            }
                        },
                        onfailure: (error) => {
                            reject(new Error('Ошибка запроса к Bitrix24 API'));
                        }
                    });
                });
            }
            
            // Fallback: использование fetch
            const response = await fetch('/rest/user.current.json', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error_description || data.error);
            }
            
            if (!data.result) {
                throw new Error('Не удалось получить данные пользователя');
            }
            
            return data.result;
            
        } catch (error) {
            console.error('Bitrix24ApiService.getCurrentUser error:', error);
            throw error;
        }
    }
}
```

### Использование в компоненте
```javascript
import { Bitrix24ApiService } from './services/Bitrix24ApiService.js';

// В компоненте Vue.js
async mounted() {
    try {
        const user = await Bitrix24ApiService.getCurrentUser();
        console.log('User:', user);
        // user.ID, user.NAME, user.LAST_NAME, user.WORK_POSITION
    } catch (error) {
        console.error('Ошибка получения пользователя:', error);
    }
}
```

---

## Тестирование

### Тестирование в консоли браузера
```javascript
// Импорт сервиса
import { Bitrix24ApiService } from './services/Bitrix24ApiService.js';

// Тест получения пользователя
Bitrix24ApiService.getCurrentUser()
    .then(user => {
        console.log('User data:', user);
        console.log('User ID:', user.ID);
        console.log('User name:', user.NAME, user.LAST_NAME);
        console.log('User position:', user.WORK_POSITION);
    })
    .catch(error => {
        console.error('Error:', error);
    });
```

### Тестирование в Vue.js компоненте
```vue
<script setup>
import { ref, onMounted } from 'vue';
import { Bitrix24ApiService } from './services/Bitrix24ApiService.js';

const user = ref(null);
const error = ref(null);

onMounted(async () => {
    try {
        user.value = await Bitrix24ApiService.getCurrentUser();
    } catch (e) {
        error.value = e.message;
    }
});
</script>
```

---

## История правок

- **2025-12-12 11:41 (UTC+3, Брест):** Создана задача TASK-003-01

---

## Примечания

### Важные замечания
- Метод должен работать как в Bitrix24 (с BX.ajax), так и вне его (с fetch)
- Все ошибки должны логироваться в консоль
- Метод должен возвращать Promise для асинхронной работы

### Следующие шаги
После завершения этого подэтапа можно переходить к:
- TASK-003-02: Создание сервиса для работы с табелем
- TASK-004: Базовые компоненты Vue.js — будет использовать этот сервис

---

## Связь с документацией

- **Родительская задача:** [TASK-003](TASK-003-services-utilities.md)
- **Техническое задание:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - разделы 10.1, 5.2
- **Справочник API:** [DOCS/API-REFERENCES/bitrix24-rest-api.md](../API-REFERENCES/bitrix24-rest-api.md)

