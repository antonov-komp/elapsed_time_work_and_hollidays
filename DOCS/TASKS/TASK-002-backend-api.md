# TASK-002: Backend API (PHP endpoints)

**Дата создания:** 2025-12-12 11:15 (UTC+3, Брест)  
**Статус:** Завершена  
**Приоритет:** Критический  
**Исполнитель:** Bitrix24 Программист (Vue.js)  
**Этап:** Этап 2 из 7  
**Длительность:** 5-7 дней

---

## Описание

Создание Backend API endpoints на PHP для работы с данными табеля присутствия. Реализация получения и сохранения данных табеля, получения праздников, валидации данных, безопасности и обработки ошибок.

**Связь с ТЗ:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - разделы 4.1, 4.2, 5.2  
**Связь с этапами:** [DOCS/TZ/implementation-stages.md](../TZ/implementation-stages.md) - Этап 2

---

## Контекст

Это второй этап разработки интерфейса табеля присутствия. Backend API необходим для работы фронтенда Vue.js приложения. Без API endpoints невозможно получать и сохранять данные табеля.

**Зависит от:**
- TASK-001: Подготовка инфраструктуры и окружения (папка `data/`, файл `config/holidays-rb.json`)

**Цель:** Создать рабочие API endpoints для работы с данными табеля присутствия.

---

## Модули и компоненты

### Backend (PHP)
- `api/timesheet.php` — endpoint для получения и сохранения данных табеля
- `api/holidays.php` — endpoint для получения праздников
- `api/helpers/ValidationHelper.php` — класс для валидации данных
- `api/helpers/SecurityHelper.php` — класс для проверки безопасности
- `api/helpers/FileHelper.php` — класс для работы с файловой системой

### Структура папок
- `api/` — папка для API endpoints
- `api/helpers/` — папка для вспомогательных классов

### Используемые файлы
- `data/{user_id}/{year}/{month}/data.json` — файлы с данными табеля
- `config/holidays-rb.json` — файл с праздниками

---

## Зависимости

- **От каких задач зависит:**
  - TASK-001: Подготовка инфраструктуры и окружения
    - TASK-001-03: Создание структуры папок для данных
    - TASK-001-04: Создание конфигурационного файла праздников
- **Какие задачи зависят от этой:**
  - TASK-003: Сервисы и утилиты (JavaScript) — будет использовать эти API endpoints
  - TASK-004: Базовые компоненты Vue.js — будет использовать эти API endpoints

---

## Ступенчатые подзадачи (6 подэтапов)

### Подэтап 2.1: Создание API endpoint для получения данных табеля
**Длительность:** 1 день

1. Создать папку `api/` в корне проекта
2. Создать файл `api/timesheet.php`
3. Реализовать обработку GET запроса с параметрами `year` и `month`
4. Реализовать получение ID пользователя из Bitrix24 (через `CRest::call('user.current')`)
5. Реализовать чтение JSON файла из `data/{user_id}/{year}/{month}/data.json`
6. Реализовать обработку случая отсутствия файла (возврат пустого объекта)
7. Реализовать валидацию параметров (year: 2025-2035, month: 1-12)
8. Вернуть данные в формате JSON

**Результат:** Рабочий endpoint `GET /api/timesheet.php?year=2025&month=12`

---

### Подэтап 2.2: Создание API endpoint для сохранения данных табеля
**Длительность:** 1.5 дня

1. Расширить файл `api/timesheet.php` для обработки POST запроса
2. Реализовать получение данных из тела запроса (JSON)
3. Реализовать валидацию входящих данных (структура, типы, правила)
4. Реализовать создание структуры папок (если не существует):
   - `data/{user_id}/{year}/{month}/`
5. Реализовать чтение существующего файла (если есть)
6. Реализовать обновление данных (merge с существующими)
7. Реализовать обновление `updated_at` и `created_at`
8. Реализовать запись JSON файла
9. Вернуть результат в формате JSON

**Результат:** Рабочий endpoint `POST /api/timesheet.php?year=2025&month=12`

---

### Подэтап 2.3: Создание API endpoint для получения праздников
**Длительность:** 0.5 дня

1. Создать файл `api/holidays.php`
2. Реализовать обработку GET запроса с параметром `year`
3. Реализовать чтение из `config/holidays-rb.json`
4. Реализовать валидацию параметра `year` (2025-2035)
5. Реализовать возврат массива праздников для указанного года
6. Реализовать обработку случая отсутствия года в файле

**Результат:** Рабочий endpoint `GET /api/holidays.php?year=2025`

---

### Подэтап 2.4: Реализация валидации данных
**Длительность:** 1 день

1. Создать папку `api/helpers/`
2. Создать класс `ValidationHelper.php`
3. Реализовать методы валидации:
   - `validateYear($year)` — проверка года (2025-2035)
   - `validateMonth($month)` — проверка месяца (1-12)
   - `validateDaysData($days)` — проверка структуры данных дней
   - `validateHours($hours)` — проверка часов (0-24, шаг 0.5)
   - `validateStatus($status)` — проверка статуса
   - `validateDayEntry($dayEntry)` — проверка записи дня (часы и статус не одновременно)
4. Реализовать возврат массива ошибок валидации
5. Интегрировать валидацию в endpoints

**Результат:** Класс валидации с методами для всех типов данных

---

### Подэтап 2.5: Реализация безопасности
**Длительность:** 1 день

1. Создать класс `SecurityHelper.php`
2. Реализовать методы безопасности:
   - `checkUserAccess($userId)` — проверка прав доступа (пользователь может редактировать только свой табель)
   - `sanitizePath($path)` — санитизация путей файлов (защита от path traversal)
   - `validateUserId($userId)` — проверка валидности ID пользователя
3. Реализовать проверку сессии Bitrix24 (если требуется)
4. Реализовать логирование всех операций в `logs/`
5. Интегрировать проверки безопасности в endpoints

**Результат:** Класс безопасности с методами защиты от атак

---

### Подэтап 2.6: Обработка ошибок
**Длительность:** 1 день

1. Создать класс `ErrorHandler.php` или добавить методы в существующие классы
2. Реализовать обработку типов ошибок:
   - Ошибки валидации (400 Bad Request)
   - Ошибки доступа (403 Forbidden)
   - Ошибки файловой системы (500 Internal Server Error)
   - Ошибки JSON (400 Bad Request)
3. Реализовать возврат понятных сообщений об ошибках в формате JSON
4. Реализовать логирование всех ошибок в `logs/`
5. Реализовать обработку исключений (try-catch)
6. Интегрировать обработку ошибок во все endpoints

**Результат:** Единая система обработки ошибок для всех endpoints

---

## API-методы Bitrix24

### Используемые методы
- `user.current` — получение данных текущего пользователя (ID, ФИО, Должность)
  - Документация: https://context7.com/bitrix24/rest/user.current
  - Используется для определения ID пользователя и проверки прав доступа

---

## Технические требования

### PHP
- **Версия:** PHP 8.3+
- **Расширения:** json, fileinfo
- **Стандарты:** PSR-12

### Структура API
- Все endpoints возвращают JSON
- Формат ответа: `{"success": true/false, "data": {...}, "error": "..."}`
- HTTP статус коды: 200 (успех), 400 (ошибка валидации), 403 (нет доступа), 500 (ошибка сервера)

### Безопасность
- Проверка прав доступа на каждом запросе
- Санитизация всех входящих данных
- Защита от path traversal
- Логирование всех операций

### Валидация
- Валидация всех параметров запроса
- Валидация структуры JSON
- Валидация типов данных
- Валидация бизнес-правил

---

## Критерии приёмки

### Подэтап 2.1
- [ ] Создан endpoint `GET /api/timesheet.php`
- [ ] Endpoint принимает параметры `year` и `month`
- [ ] Endpoint возвращает данные табеля в формате JSON
- [ ] Обрабатывается случай отсутствия файла (возврат пустого объекта)
- [ ] Валидация параметров работает корректно

### Подэтап 2.2
- [ ] Endpoint `POST /api/timesheet.php` работает
- [ ] Endpoint создаёт структуру папок при необходимости
- [ ] Endpoint сохраняет данные в JSON файл
- [ ] Обновляются поля `updated_at` и `created_at`
- [ ] Валидация входящих данных работает

### Подэтап 2.3
- [ ] Создан endpoint `GET /api/holidays.php`
- [ ] Endpoint принимает параметр `year`
- [ ] Endpoint возвращает массив праздников в формате JSON
- [ ] Обрабатывается случай отсутствия года в файле

### Подэтап 2.4
- [ ] Создан класс `ValidationHelper.php`
- [ ] Все методы валидации реализованы
- [ ] Валидация интегрирована в endpoints
- [ ] Возвращаются понятные сообщения об ошибках

### Подэтап 2.5
- [ ] Создан класс `SecurityHelper.php`
- [ ] Проверка прав доступа работает
- [ ] Санитизация путей работает
- [ ] Логирование операций работает

### Подэтап 2.6
- [ ] Обработка ошибок реализована
- [ ] Все типы ошибок обрабатываются
- [ ] Ошибки логируются в `logs/`
- [ ] Возвращаются понятные сообщения об ошибках

### Общие критерии
- [ ] Все endpoints работают корректно
- [ ] Валидация и безопасность реализованы
- [ ] Обработка ошибок работает
- [ ] Код соответствует стандартам PSR-12
- [ ] Логирование всех операций

---

## Примеры кода

### api/timesheet.php (базовая структура)
```php
<?php
/**
 * API endpoint для работы с табелем присутствия
 * 
 * GET /api/timesheet.php?year=2025&month=12 - получение данных
 * POST /api/timesheet.php?year=2025&month=12 - сохранение данных
 */

require_once(__DIR__ . '/../crest.php');
require_once(__DIR__ . '/helpers/ValidationHelper.php');
require_once(__DIR__ . '/helpers/SecurityHelper.php');
require_once(__DIR__ . '/helpers/FileHelper.php');

header('Content-Type: application/json; charset=utf-8');

try {
    // Получение данных пользователя
    $user = CRest::call('user.current');
    if (empty($user['result'])) {
        throw new Exception('Не удалось получить данные пользователя');
    }
    $userId = $user['result']['ID'];
    
    // Получение параметров
    $year = isset($_GET['year']) ? (int)$_GET['year'] : null;
    $month = isset($_GET['month']) ? (int)$_GET['month'] : null;
    
    // Валидация параметров
    $validation = new ValidationHelper();
    if (!$validation->validateYear($year)) {
        throw new Exception('Неверный год');
    }
    if (!$validation->validateMonth($month)) {
        throw new Exception('Неверный месяц');
    }
    
    // Обработка запроса
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Получение данных
        $fileHelper = new FileHelper();
        $data = $fileHelper->readTimesheet($userId, $year, $month);
        
        echo json_encode([
            'success' => true,
            'data' => $data
        ]);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Сохранение данных
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$validation->validateDaysData($input['days'] ?? [])) {
            throw new Exception('Неверный формат данных');
        }
        
        $fileHelper = new FileHelper();
        $result = $fileHelper->saveTimesheet($userId, $year, $month, $input['days']);
        
        echo json_encode([
            'success' => true,
            'data' => $result
        ]);
    } else {
        throw new Exception('Метод не поддерживается');
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
    
    // Логирование ошибки
    CRest::setLog([
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ], 'api_error');
}
```

### api/holidays.php (базовая структура)
```php
<?php
/**
 * API endpoint для получения праздников
 * 
 * GET /api/holidays.php?year=2025
 */

header('Content-Type: application/json; charset=utf-8');

try {
    $year = isset($_GET['year']) ? (int)$_GET['year'] : null;
    
    // Валидация года
    if (!$year || $year < 2025 || $year > 2035) {
        throw new Exception('Неверный год (должен быть 2025-2035)');
    }
    
    // Чтение файла праздников
    $holidaysFile = __DIR__ . '/../config/holidays-rb.json';
    if (!file_exists($holidaysFile)) {
        throw new Exception('Файл праздников не найден');
    }
    
    $holidaysData = json_decode(file_get_contents($holidaysFile), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Ошибка чтения файла праздников');
    }
    
    // Получение праздников для указанного года
    $holidays = $holidaysData[(string)$year] ?? [];
    
    echo json_encode([
        'success' => true,
        'data' => $holidays
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
```

---

## Тестирование

### Тестирование GET /api/timesheet.php
```bash
# Получение данных табеля
curl "http://localhost/api/timesheet.php?year=2025&month=12"

# Ожидаемый ответ (если файл существует):
# {"success":true,"data":{"created_at":"...","updated_at":"...","days":{...}}}

# Ожидаемый ответ (если файл не существует):
# {"success":true,"data":null}
```

### Тестирование POST /api/timesheet.php
```bash
# Сохранение данных табеля
curl -X POST "http://localhost/api/timesheet.php?year=2025&month=12" \
  -H "Content-Type: application/json" \
  -d '{"days":{"1":{"hours":8.0,"status":null},"2":{"hours":7.5,"status":null}}}'

# Ожидаемый ответ:
# {"success":true,"data":{"created_at":"...","updated_at":"..."}}
```

### Тестирование GET /api/holidays.php
```bash
# Получение праздников
curl "http://localhost/api/holidays.php?year=2025"

# Ожидаемый ответ:
# {"success":true,"data":["2025-01-01","2025-01-07",...]}
```

---

## История правок

- **2025-12-12 11:15 (UTC+3, Брест):** Создана задача TASK-002 на основе Этапа 2, разбита на 6 подэтапов
- **2025-12-12 12:04 (UTC+3, Брест):** Задача выполнена. Созданы все API endpoints и вспомогательные классы:
  - ✅ `api/timesheet.php` - endpoint для получения и сохранения данных табеля (GET/POST)
  - ✅ `api/holidays.php` - endpoint для получения праздников (GET)
  - ✅ `api/helpers/FileHelper.php` - класс для работы с файловой системой
  - ✅ `api/helpers/ValidationHelper.php` - класс для валидации данных
  - ✅ `api/helpers/SecurityHelper.php` - класс для проверки безопасности
  - ✅ Реализована обработка ошибок во всех endpoints
  - ✅ Добавлено логирование всех операций
  - ✅ Все файлы проверены на синтаксические ошибки

---

## Примечания

### Порядок выполнения подэтапов
Подэтапы можно выполнять последовательно. Подэтапы 2.4, 2.5, 2.6 можно выполнять параллельно с 2.1-2.3, так как они создают вспомогательные классы.

### Важные замечания
- Все endpoints должны проверять права доступа пользователя
- Все входящие данные должны валидироваться
- Все ошибки должны логироваться
- Код должен соответствовать стандартам PSR-12

### Следующие шаги
После завершения TASK-002 можно переходить к:
- TASK-003: Сервисы и утилиты (JavaScript) — будет использовать эти API endpoints
- TASK-004: Базовые компоненты Vue.js — будет использовать эти API endpoints

---

## Связь с документацией

- **Техническое задание:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - разделы 4.1, 4.2, 5.2
- **Этапы реализации:** [DOCS/TZ/implementation-stages.md](../TZ/implementation-stages.md) - Этап 2
- **Справочник API:** [DOCS/API-REFERENCES/bitrix24-rest-api.md](../API-REFERENCES/bitrix24-rest-api.md)

