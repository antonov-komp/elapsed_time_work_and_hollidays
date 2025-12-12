# TASK-002-02: Создание API endpoint для сохранения данных табеля

**Дата создания:** 2025-12-12 11:20 (UTC+3, Брест)  
**Статус:** Новая  
**Приоритет:** Критический  
**Исполнитель:** Bitrix24 Программист (Vanilla JS)  
**Родительская задача:** [TASK-002](TASK-002-backend-api.md)  
**Подэтап:** 2.2 из 6  
**Длительность:** 1.5 дня

---

## Описание

Расширение API endpoint `api/timesheet.php` для обработки POST запросов. Реализация сохранения данных табеля присутствия в JSON файл с созданием структуры папок при необходимости.

**Связь с ТЗ:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - разделы 4.1, 4.2, 5.2.1  
**Связь с этапами:** [DOCS/TZ/implementation-stages.md](../TZ/implementation-stages.md) - Этап 2, Подэтап 2.2

---

## Контекст

Это второй подэтап создания Backend API. Endpoint для сохранения данных необходим для записи изменений табеля из фронтенда Vue.js приложения. Без этого endpoint невозможно сохранять данные табеля.

**Зависит от:**
- TASK-002-01: Создание API endpoint для получения данных табеля (файл `api/timesheet.php` уже создан)

---

## Модули и компоненты

### Backend (PHP)
- `api/timesheet.php` — endpoint для сохранения данных табеля (POST запрос, расширение существующего файла)

### Используемые файлы
- `data/{user_id}/{year}/{month}/data.json` — файл с данными табеля (создаётся или обновляется)
- `crest.php` — библиотека для работы с Bitrix24 REST API

---

## Зависимости

- **От каких задач зависит:**
  - TASK-002-01: Создание API endpoint для получения данных табеля
  - TASK-001-03: Создание структуры папок для данных
- **Какие задачи зависят от этой:**
  - TASK-002-04: Реализация валидации данных (будет использоваться в этом endpoint)
  - TASK-003: Сервисы и утилиты (JavaScript) — будет использовать этот endpoint

---

## Ступенчатые подзадачи

### Шаг 1: Расширение файла timesheet.php
1. Открыть файл `api/timesheet.php`
2. Добавить обработку POST запроса после обработки GET запроса
3. Проверить метод запроса: `$_SERVER['REQUEST_METHOD'] === 'POST'`

### Шаг 2: Получение данных из тела запроса
1. Прочитать тело запроса: `file_get_contents('php://input')`
2. Декодировать JSON: `json_decode($input, true)`
3. Проверить на ошибки JSON: `json_last_error()`
4. Проверить структуру данных (наличие поля `days`)

### Шаг 3: Валидация входящих данных
1. Проверить структуру JSON (базовая проверка)
2. Проверить наличие поля `days` (объект)
3. Проверить структуру каждого дня:
   - Наличие полей `hours` и `status`
   - Типы данных (hours — число, status — строка или null)
4. Проверить бизнес-правила:
   - Часы и статус не могут быть указаны одновременно
   - Часы: 0-24, шаг 0.5
   - Статус: один из допустимых значений или null

### Шаг 4: Получение ID пользователя
1. Использовать код из GET запроса для получения ID пользователя
2. Проверить права доступа (пользователь может редактировать только свой табель)

### Шаг 5: Создание структуры папок
1. Сформировать путь к папке: `data/{user_id}/{year}/{month}/`
2. Проверить существование папок
3. Создать папки, если не существуют:
   ```php
   $dirPath = __DIR__ . "/../data/{$userId}/{$year}/" . str_pad($month, 2, '0', STR_PAD_LEFT);
   if (!is_dir($dirPath)) {
       mkdir($dirPath, 0775, true);
   }
   ```
4. Проверить права на запись

### Шаг 6: Чтение существующего файла (если есть)
1. Проверить существование файла `data.json`
2. Если файл существует:
   - Прочитать содержимое
   - Декодировать JSON
   - Извлечь существующие данные
3. Если файла нет:
   - Создать новую структуру данных

### Шаг 7: Обновление данных
1. Объединить существующие данные с новыми (merge)
2. Обновить поле `days` с новыми данными
3. Обновить поле `updated_at` (текущая дата/время в формате ISO 8601)
4. Установить `created_at` (если файл новый) или оставить существующее значение

### Шаг 8: Запись JSON файла
1. Сформировать полный путь к файлу
2. Кодировать данные в JSON: `json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)`
3. Записать в файл: `file_put_contents($filePath, $json)`
4. Проверить успешность записи
5. Установить права на файл: `chmod($filePath, 0664)`

### Шаг 9: Формирование ответа
1. Сформировать JSON ответ:
   ```php
   echo json_encode([
       'success' => true,
       'message' => 'Данные сохранены',
       'data' => [
           'created_at' => $data['created_at'],
           'updated_at' => $data['updated_at']
       ]
   ]);
   ```
2. Установить HTTP статус 200

### Шаг 10: Обработка ошибок
1. Обернуть код в try-catch
2. При ошибке валидации вернуть статус 400
3. При ошибке доступа вернуть статус 403
4. При ошибке файловой системы вернуть статус 500
5. Логировать все ошибки

---

## Технические требования

### PHP
- **Версия:** PHP 8.3+
- **Расширения:** json, fileinfo
- **Стандарты:** PSR-12

### Формат запроса
- **Метод:** POST
- **URL:** `/api/timesheet.php?year=2025&month=12`
- **Заголовки:** `Content-Type: application/json`
- **Тело запроса (JSON):**
```json
{
  "days": {
    "1": {
      "hours": 8.0,
      "status": null
    },
    "2": {
      "hours": 7.5,
      "status": null
    },
    "3": {
      "hours": 0,
      "status": "Больничный"
    }
  }
}
```

### Формат ответа
- **Успех (200):**
```json
{
  "success": true,
  "message": "Данные сохранены",
  "data": {
    "created_at": "2025-12-12T10:51:00+03:00",
    "updated_at": "2025-12-12T16:00:00+03:00"
  }
}
```

- **Ошибка валидации (400):**
```json
{
  "success": false,
  "error": "Ошибка валидации",
  "message": "Неверный формат данных",
  "errors": {
    "days.1.hours": "Часы должны быть от 0 до 24"
  }
}
```

- **Ошибка доступа (403):**
```json
{
  "success": false,
  "error": "Доступ запрещён"
}
```

- **Ошибка сервера (500):**
```json
{
  "success": false,
  "error": "Ошибка сохранения данных"
}
```

---

## Критерии приёмки

- [ ] Endpoint обрабатывает POST запрос
- [ ] Endpoint получает данные из тела запроса (JSON)
- [ ] Endpoint валидирует входящие данные:
  - [ ] Структура JSON корректна
  - [ ] Поле `days` присутствует
  - [ ] Структура каждого дня корректна
  - [ ] Бизнес-правила соблюдены
- [ ] Endpoint создаёт структуру папок при необходимости
- [ ] Endpoint читает существующий файл (если есть)
- [ ] Endpoint объединяет существующие данные с новыми (merge)
- [ ] Endpoint обновляет поля `updated_at` и `created_at`
- [ ] Endpoint записывает данные в JSON файл
- [ ] Права на файл установлены корректно (664)
- [ ] Endpoint возвращает результат в формате JSON
- [ ] Обработка ошибок реализована:
  - [ ] Ошибки валидации (400)
  - [ ] Ошибки доступа (403)
  - [ ] Ошибки файловой системы (500)
- [ ] Все ошибки логируются

---

## Примеры кода

### api/timesheet.php (POST запрос, расширение)
```php
<?php
/**
 * API endpoint для работы с табелем присутствия
 * 
 * GET /api/timesheet.php?year=2025&month=12 - получение данных
 * POST /api/timesheet.php?year=2025&month=12 - сохранение данных
 */

require_once(__DIR__ . '/../crest.php');

header('Content-Type: application/json; charset=utf-8');

try {
    // Получение данных пользователя из Bitrix24
    $user = CRest::call('user.current');
    
    if (empty($user['result']) || !empty($user['error'])) {
        throw new Exception('Не удалось получить данные пользователя из Bitrix24');
    }
    
    $userId = (int)$user['result']['ID'];
    
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
    
    // Обработка GET запроса (из TASK-002-01)
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // ... код из TASK-002-01 ...
    }
    
    // Обработка POST запроса
    elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Чтение тела запроса
        $input = file_get_contents('php://input');
        
        if ($input === false) {
            throw new Exception('Ошибка чтения тела запроса');
        }
        
        $data = json_decode($input, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Ошибка декодирования JSON: ' . json_last_error_msg());
        }
        
        // Валидация структуры данных
        if (!isset($data['days']) || !is_array($data['days'])) {
            throw new Exception('Неверный формат данных. Ожидается поле "days" (объект)');
        }
        
        // Базовая валидация дней (детальная валидация будет в TASK-002-04)
        foreach ($data['days'] as $day => $dayData) {
            if (!is_numeric($day) || $day < 1 || $day > 31) {
                throw new Exception("Неверный номер дня: {$day}");
            }
            
            if (!is_array($dayData)) {
                throw new Exception("Неверный формат данных для дня {$day}");
            }
            
            // Проверка правил: часы и статус не одновременно
            $hasHours = isset($dayData['hours']) && $dayData['hours'] > 0;
            $hasStatus = isset($dayData['status']) && $dayData['status'] !== null;
            
            if ($hasHours && $hasStatus) {
                throw new Exception("День {$day}: нельзя указать одновременно часы и статус");
            }
        }
        
        // Формирование пути к папке
        $monthPadded = str_pad($month, 2, '0', STR_PAD_LEFT);
        $dirPath = __DIR__ . "/../data/{$userId}/{$year}/{$monthPadded}";
        
        // Создание структуры папок
        if (!is_dir($dirPath)) {
            if (!mkdir($dirPath, 0775, true)) {
                throw new Exception('Ошибка создания папки для данных');
            }
        }
        
        // Формирование пути к файлу
        $filePath = $dirPath . '/data.json';
        
        // Чтение существующего файла (если есть)
        $existingData = null;
        if (file_exists($filePath)) {
            $content = file_get_contents($filePath);
            if ($content !== false) {
                $existingData = json_decode($content, true);
            }
        }
        
        // Формирование структуры данных
        $now = date('c'); // ISO 8601 format
        
        $timesheetData = [
            'created_at' => $existingData['created_at'] ?? $now,
            'updated_at' => $now,
            'year' => $year,
            'month' => $month,
            'user_id' => $userId,
            'days' => array_merge($existingData['days'] ?? [], $data['days'])
        ];
        
        // Кодирование в JSON
        $json = json_encode($timesheetData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        
        if ($json === false) {
            throw new Exception('Ошибка кодирования JSON: ' . json_last_error_msg());
        }
        
        // Запись в файл
        if (file_put_contents($filePath, $json) === false) {
            throw new Exception('Ошибка записи файла');
        }
        
        // Установка прав на файл
        chmod($filePath, 0664);
        
        // Возврат результата
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Данные сохранены',
            'data' => [
                'created_at' => $timesheetData['created_at'],
                'updated_at' => $timesheetData['updated_at']
            ]
        ]);
    }
    
    else {
        throw new Exception('Метод не поддерживается. Используйте GET или POST.');
    }
    
} catch (Exception $e) {
    $statusCode = 500;
    
    // Определение статус кода по типу ошибки
    if (strpos($e->getMessage(), 'Неверный') !== false || 
        strpos($e->getMessage(), 'Ошибка декодирования') !== false ||
        strpos($e->getMessage(), 'Ошибка кодирования') !== false) {
        $statusCode = 400;
    }
    
    http_response_code($statusCode);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
    
    // Логирование ошибки
    CRest::setLog([
        'endpoint' => $_SERVER['REQUEST_METHOD'] . ' /api/timesheet.php',
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
# Сохранение данных табеля
curl -X POST "http://localhost/api/timesheet.php?year=2025&month=12" \
  -H "Content-Type: application/json" \
  -d '{
    "days": {
      "1": {"hours": 8.0, "status": null},
      "2": {"hours": 7.5, "status": null},
      "3": {"hours": 0, "status": "Больничный"}
    }
  }'

# Ожидаемый ответ:
# {"success":true,"message":"Данные сохранены","data":{"created_at":"...","updated_at":"..."}}
```

### Тестирование с неверными данными
```bash
# Неверный формат JSON
curl -X POST "http://localhost/api/timesheet.php?year=2025&month=12" \
  -H "Content-Type: application/json" \
  -d 'invalid json'

# Ожидаемый ответ: {"success":false,"error":"Ошибка декодирования JSON..."}

# Часы и статус одновременно
curl -X POST "http://localhost/api/timesheet.php?year=2025&month=12" \
  -H "Content-Type: application/json" \
  -d '{"days":{"1":{"hours":8.0,"status":"Больничный"}}}'

# Ожидаемый ответ: {"success":false,"error":"День 1: нельзя указать одновременно часы и статус"}
```

### Проверка создания файла
```bash
# После сохранения проверить создание файла
ls -la data/{user_id}/2025/12/data.json

# Проверить содержимое файла
cat data/{user_id}/2025/12/data.json
```

---

## История правок

- **2025-12-12 11:20 (UTC+3, Брест):** Создана задача TASK-002-02

---

## Примечания

### Важные замечания
- Endpoint должен проверять права доступа (пользователь может редактировать только свой табель)
- Путь к файлу должен быть санитизирован (защита от path traversal)
- При merge данных новые данные перезаписывают существующие для тех же дней
- Все ошибки должны логироваться

### Следующие шаги
После завершения этого подэтапа можно переходить к:
- TASK-002-03: Создание API endpoint для получения праздников
- TASK-002-04: Реализация валидации данных (улучшит валидацию в этом endpoint)

---

## Связь с документацией

- **Родительская задача:** [TASK-002](TASK-002-backend-api.md)
- **Предыдущий подэтап:** [TASK-002-01](TASK-002-01-get-timesheet-endpoint.md)
- **Техническое задание:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - разделы 4.1, 4.2, 5.2.1


