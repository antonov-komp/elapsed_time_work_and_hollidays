# TASK-002-01: Создание API endpoint для получения данных табеля

**Дата создания:** 2025-12-12 11:20 (UTC+3, Брест)  
**Статус:** Новая  
**Приоритет:** Критический  
**Исполнитель:** Bitrix24 Программист (Vanilla JS)  
**Родительская задача:** [TASK-002](TASK-002-backend-api.md)  
**Подэтап:** 2.1 из 6  
**Длительность:** 1 день

---

## Описание

Создание API endpoint `GET /api/timesheet.php` для получения данных табеля присутствия за указанный месяц. Endpoint читает JSON файл из файловой системы и возвращает данные в формате JSON.

**Связь с ТЗ:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - разделы 4.1, 4.2, 5.2.1  
**Связь с этапами:** [DOCS/TZ/implementation-stages.md](../TZ/implementation-stages.md) - Этап 2, Подэтап 2.1

---

## Контекст

Это первый подэтап создания Backend API. Endpoint для получения данных необходим для загрузки табеля во фронтенд Vue.js приложение. Без этого endpoint невозможно отобразить существующие данные табеля.

**Зависит от:**
- TASK-001-03: Создание структуры папок для данных (папка `data/`)

---

## Модули и компоненты

### Backend (PHP)
- `api/timesheet.php` — endpoint для получения данных табеля (GET запрос)

### Используемые файлы
- `data/{user_id}/{year}/{month}/data.json` — файл с данными табеля
- `crest.php` — библиотека для работы с Bitrix24 REST API

### Структура папок
- `api/` — папка для API endpoints

---

## Зависимости

- **От каких задач зависит:**
  - TASK-001-03: Создание структуры папок для данных
- **Какие задачи зависят от этой:**
  - TASK-002-02: Создание API endpoint для сохранения данных табеля (расширит этот файл)
  - TASK-003: Сервисы и утилиты (JavaScript) — будет использовать этот endpoint

---

## Ступенчатые подзадачи

### Шаг 1: Создание папки api
1. Перейти в корень проекта:
   ```bash
   cd /var/www/back1
   ```
2. Создать папку `api/`:
   ```bash
   mkdir -p api
   ```
3. Проверить создание:
   ```bash
   ls -ld api/
   ```

### Шаг 2: Создание файла timesheet.php
1. Создать файл `api/timesheet.php`
2. Добавить базовую структуру PHP файла:
   - Подключение `crest.php`
   - Установка заголовков (Content-Type: application/json)
   - Обработка ошибок

### Шаг 3: Реализация обработки GET запроса
1. Проверить метод запроса: `$_SERVER['REQUEST_METHOD'] === 'GET'`
2. Получить параметры из GET запроса:
   - `year` — год (2025-2035)
   - `month` — месяц (1-12)
3. Проверить наличие параметров

### Шаг 4: Получение ID пользователя из Bitrix24
1. Вызвать `CRest::call('user.current')`
2. Проверить результат на наличие ошибок
3. Извлечь ID пользователя: `$userId = $user['result']['ID']`
4. Обработать случай отсутствия данных пользователя

### Шаг 5: Валидация параметров
1. Проверить год: должен быть в диапазоне 2025-2035
2. Проверить месяц: должен быть в диапазоне 1-12
3. Привести к целым числам: `(int)$_GET['year']`, `(int)$_GET['month']`
4. Вернуть ошибку при неверных параметрах

### Шаг 6: Чтение JSON файла
1. Сформировать путь к файлу:
   ```php
   $filePath = __DIR__ . "/../data/{$userId}/{$year}/{$month}/data.json";
   ```
2. Проверить существование файла: `file_exists($filePath)`
3. Если файл существует:
   - Прочитать содержимое: `file_get_contents($filePath)`
   - Декодировать JSON: `json_decode($content, true)`
   - Проверить на ошибки JSON
4. Если файл не существует:
   - Вернуть `null` или пустой объект

### Шаг 7: Формирование ответа
1. Сформировать JSON ответ:
   ```php
   echo json_encode([
       'success' => true,
       'data' => $data // или null, если файл не существует
   ]);
   ```
2. Установить HTTP статус 200

### Шаг 8: Обработка ошибок
1. Обернуть код в try-catch
2. При ошибке вернуть:
   ```php
   http_response_code(500);
   echo json_encode([
       'success' => false,
       'error' => $e->getMessage()
   ]);
   ```

---

## Технические требования

### PHP
- **Версия:** PHP 8.3+
- **Расширения:** json
- **Стандарты:** PSR-12

### Формат запроса
- **Метод:** GET
- **URL:** `/api/timesheet.php?year=2025&month=12`
- **Параметры:**
  - `year` — год (2025-2035), обязательный
  - `month` — месяц (1-12), обязательный

### Формат ответа
- **Успех (200):**
```json
{
  "success": true,
  "data": {
    "created_at": "2025-12-12T10:51:00+03:00",
    "updated_at": "2025-12-12T15:30:00+03:00",
    "year": 2025,
    "month": 12,
    "user_id": 12345,
    "days": {
      "1": {"hours": 8.0, "status": null},
      "2": {"hours": 7.5, "status": null}
    }
  }
}
```

- **Успех, файл не существует (200):**
```json
{
  "success": true,
  "data": null
}
```

- **Ошибка (400/500):**
```json
{
  "success": false,
  "error": "Описание ошибки"
}
```

---

## Критерии приёмки

- [ ] Создана папка `api/` в корне проекта
- [ ] Создан файл `api/timesheet.php`
- [ ] Endpoint обрабатывает GET запрос
- [ ] Endpoint принимает параметры `year` и `month`
- [ ] Endpoint получает ID пользователя через Bitrix24 API (`user.current`)
- [ ] Endpoint читает JSON файл из `data/{user_id}/{year}/{month}/data.json`
- [ ] Endpoint обрабатывает случай отсутствия файла (возврат `null`)
- [ ] Валидация параметров работает:
  - [ ] Год должен быть 2025-2035
  - [ ] Месяц должен быть 1-12
- [ ] Endpoint возвращает данные в формате JSON
- [ ] Обработка ошибок реализована
- [ ] HTTP статус коды корректны (200 для успеха, 400/500 для ошибок)

---

## Примеры кода

### api/timesheet.php (GET запрос)
```php
<?php
/**
 * API endpoint для работы с табелем присутствия
 * 
 * GET /api/timesheet.php?year=2025&month=12 - получение данных
 */

require_once(__DIR__ . '/../crest.php');

header('Content-Type: application/json; charset=utf-8');

try {
    // Проверка метода запроса
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        throw new Exception('Метод не поддерживается. Используйте GET.');
    }
    
    // Получение параметров
    $year = isset($_GET['year']) ? (int)$_GET['year'] : null;
    $month = isset($_GET['month']) ? (int)$_GET['month'] : null;
    
    // Валидация параметров
    if (!$year || $year < 2025 || $year > 2035) {
        throw new Exception('Неверный год. Должен быть 2025-2035.');
    }
    
    if (!$month || $month < 1 || $month > 12) {
        throw new Exception('Неверный месяц. Должен быть 1-12.');
    }
    
    // Получение данных пользователя из Bitrix24
    $user = CRest::call('user.current');
    
    if (empty($user['result']) || !empty($user['error'])) {
        throw new Exception('Не удалось получить данные пользователя из Bitrix24');
    }
    
    $userId = (int)$user['result']['ID'];
    
    if (!$userId) {
        throw new Exception('Неверный ID пользователя');
    }
    
    // Формирование пути к файлу
    $filePath = __DIR__ . "/../data/{$userId}/{$year}/" . str_pad($month, 2, '0', STR_PAD_LEFT) . "/data.json";
    
    // Чтение файла
    $data = null;
    
    if (file_exists($filePath)) {
        $content = file_get_contents($filePath);
        
        if ($content === false) {
            throw new Exception('Ошибка чтения файла');
        }
        
        $data = json_decode($content, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Ошибка декодирования JSON: ' . json_last_error_msg());
        }
    }
    
    // Возврат данных
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $data
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
    
    // Логирование ошибки
    CRest::setLog([
        'endpoint' => 'GET /api/timesheet.php',
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString(),
        'params' => [
            'year' => $_GET['year'] ?? null,
            'month' => $_GET['month'] ?? null
        ]
    ], 'api_error');
}
```

---

## Тестирование

### Тестирование через curl
```bash
# Получение данных табеля
curl "http://localhost/api/timesheet.php?year=2025&month=12"

# Ожидаемый ответ (если файл существует):
# {"success":true,"data":{"created_at":"...","updated_at":"...","days":{...}}}

# Ожидаемый ответ (если файл не существует):
# {"success":true,"data":null}
```

### Тестирование с неверными параметрами
```bash
# Неверный год
curl "http://localhost/api/timesheet.php?year=2020&month=12"
# Ожидаемый ответ: {"success":false,"error":"Неверный год..."}

# Неверный месяц
curl "http://localhost/api/timesheet.php?year=2025&month=13"
# Ожидаемый ответ: {"success":false,"error":"Неверный месяц..."}

# Отсутствие параметров
curl "http://localhost/api/timesheet.php"
# Ожидаемый ответ: ошибка валидации
```

### Тестирование через браузер
1. Открыть в браузере: `http://localhost/api/timesheet.php?year=2025&month=12`
2. Проверить, что возвращается JSON
3. Проверить формат данных

---

## История правок

- **2025-12-12 11:20 (UTC+3, Брест):** Создана задача TASK-002-01

---

## Примечания

### Важные замечания
- Endpoint должен проверять права доступа (пользователь может получать только свой табель)
- Путь к файлу должен быть санитизирован (защита от path traversal)
- Все ошибки должны логироваться

### Следующие шаги
После завершения этого подэтапа можно переходить к:
- TASK-002-02: Создание API endpoint для сохранения данных табеля (расширит этот файл)

---

## Связь с документацией

- **Родительская задача:** [TASK-002](TASK-002-backend-api.md)
- **Техническое задание:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - разделы 4.1, 4.2, 5.2.1
- **Справочник API:** [DOCS/API-REFERENCES/bitrix24-rest-api.md](../API-REFERENCES/bitrix24-rest-api.md)

