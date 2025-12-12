# TASK-002-03: Создание API endpoint для получения праздников

**Дата создания:** 2025-12-12 11:20 (UTC+3, Брест)  
**Статус:** Новая  
**Приоритет:** Высокий  
**Исполнитель:** Bitrix24 Программист (Vanilla JS)  
**Родительская задача:** [TASK-002](TASK-002-backend-api.md)  
**Подэтап:** 2.3 из 6  
**Длительность:** 0.5 дня

---

## Описание

Создание API endpoint `GET /api/holidays.php` для получения списка белорусских праздников за указанный год. Endpoint читает данные из файла `config/holidays-rb.json` и возвращает массив дат праздников.

**Связь с ТЗ:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - разделы 5.3.1, 5.2.1  
**Связь с этапами:** [DOCS/TZ/implementation-stages.md](../TZ/implementation-stages.md) - Этап 2, Подэтап 2.3

---

## Контекст

Это третий подэтап создания Backend API. Endpoint для получения праздников необходим для правильного отображения праздничных дней в календаре и исключения их из автоматического заполнения недели.

**Зависит от:**
- TASK-001-04: Создание конфигурационного файла праздников (файл `config/holidays-rb.json`)

---

## Модули и компоненты

### Backend (PHP)
- `api/holidays.php` — endpoint для получения праздников

### Используемые файлы
- `config/holidays-rb.json` — файл с праздниками Республики Беларусь

---

## Зависимости

- **От каких задач зависит:**
  - TASK-001-04: Создание конфигурационного файла праздников
- **Какие задачи зависят от этой:**
  - TASK-003: Сервисы и утилиты (JavaScript) — будет использовать этот endpoint
  - TASK-004: Базовые компоненты Vue.js — будет использовать этот endpoint

---

## Ступенчатые подзадачи

### Шаг 1: Создание файла holidays.php
1. Создать файл `api/holidays.php`
2. Добавить базовую структуру PHP файла:
   - Установка заголовков (Content-Type: application/json)
   - Обработка ошибок

### Шаг 2: Реализация обработки GET запроса
1. Проверить метод запроса: `$_SERVER['REQUEST_METHOD'] === 'GET'`
2. Получить параметр `year` из GET запроса
3. Проверить наличие параметра

### Шаг 3: Валидация параметра year
1. Привести к целому числу: `(int)$_GET['year']`
2. Проверить диапазон: 2025-2035
3. Вернуть ошибку при неверном параметре

### Шаг 4: Чтение файла праздников
1. Сформировать путь к файлу: `__DIR__ . '/../config/holidays-rb.json'`
2. Проверить существование файла: `file_exists($filePath)`
3. Прочитать содержимое: `file_get_contents($filePath)`
4. Декодировать JSON: `json_decode($content, true)`
5. Проверить на ошибки JSON

### Шаг 5: Получение праздников для года
1. Проверить наличие года в данных: `isset($holidaysData[(string)$year])`
2. Извлечь массив праздников: `$holidays = $holidaysData[(string)$year] ?? []`
3. Обработать случай отсутствия года (вернуть пустой массив)

### Шаг 6: Формирование ответа
1. Сформировать JSON ответ:
   ```php
   echo json_encode([
       'success' => true,
       'data' => $holidays
   ]);
   ```
2. Установить HTTP статус 200

### Шаг 7: Обработка ошибок
1. Обернуть код в try-catch
2. При ошибке вернуть:
   ```php
   http_response_code(400);
   echo json_encode([
       'success' => false,
       'error' => $e->getMessage()
   ]);
   ```
3. Логировать ошибки

---

## Технические требования

### PHP
- **Версия:** PHP 8.3+
- **Расширения:** json
- **Стандарты:** PSR-12

### Формат запроса
- **Метод:** GET
- **URL:** `/api/holidays.php?year=2025`
- **Параметры:**
  - `year` — год (2025-2035), обязательный

### Формат ответа
- **Успех (200):**
```json
{
  "success": true,
  "data": [
    "2025-01-01",
    "2025-01-07",
    "2025-03-08",
    "2025-05-01",
    "2025-05-09",
    "2025-07-03",
    "2025-11-07",
    "2025-12-25"
  ]
}
```

- **Успех, год не найден (200):**
```json
{
  "success": true,
  "data": []
}
```

- **Ошибка (400):**
```json
{
  "success": false,
  "error": "Неверный год. Должен быть 2025-2035."
}
```

---

## Критерии приёмки

- [ ] Создан файл `api/holidays.php`
- [ ] Endpoint обрабатывает GET запрос
- [ ] Endpoint принимает параметр `year`
- [ ] Валидация параметра работает:
  - [ ] Год должен быть 2025-2035
- [ ] Endpoint читает файл `config/holidays-rb.json`
- [ ] Endpoint возвращает массив праздников для указанного года
- [ ] Endpoint обрабатывает случай отсутствия года (возврат пустого массива)
- [ ] Endpoint обрабатывает случай отсутствия файла (ошибка)
- [ ] Endpoint возвращает данные в формате JSON
- [ ] Обработка ошибок реализована
- [ ] HTTP статус коды корректны (200 для успеха, 400 для ошибок)

---

## Примеры кода

### api/holidays.php
```php
<?php
/**
 * API endpoint для получения праздников Республики Беларусь
 * 
 * GET /api/holidays.php?year=2025
 */

header('Content-Type: application/json; charset=utf-8');

try {
    // Проверка метода запроса
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        throw new Exception('Метод не поддерживается. Используйте GET.');
    }
    
    // Получение параметра
    $year = isset($_GET['year']) ? (int)$_GET['year'] : null;
    
    // Валидация года
    if (!$year || $year < 2025 || $year > 2035) {
        throw new Exception('Неверный год. Должен быть 2025-2035.');
    }
    
    // Формирование пути к файлу
    $filePath = __DIR__ . '/../config/holidays-rb.json';
    
    // Проверка существования файла
    if (!file_exists($filePath)) {
        throw new Exception('Файл праздников не найден: config/holidays-rb.json');
    }
    
    // Чтение файла
    $content = file_get_contents($filePath);
    
    if ($content === false) {
        throw new Exception('Ошибка чтения файла праздников');
    }
    
    // Декодирование JSON
    $holidaysData = json_decode($content, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Ошибка декодирования JSON: ' . json_last_error_msg());
    }
    
    // Получение праздников для указанного года
    $holidays = $holidaysData[(string)$year] ?? [];
    
    // Проверка, что это массив
    if (!is_array($holidays)) {
        $holidays = [];
    }
    
    // Возврат данных
    http_response_code(200);
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
    
    // Логирование ошибки
    if (function_exists('CRest::setLog')) {
        require_once(__DIR__ . '/../crest.php');
        CRest::setLog([
            'endpoint' => 'GET /api/holidays.php',
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
            'params' => [
                'year' => $_GET['year'] ?? null
            ]
        ], 'api_error');
    }
}
```

---

## Тестирование

### Тестирование через curl
```bash
# Получение праздников за 2025 год
curl "http://localhost/api/holidays.php?year=2025"

# Ожидаемый ответ:
# {"success":true,"data":["2025-01-01","2025-01-07","2025-03-08",...]}

# Получение праздников за 2030 год
curl "http://localhost/api/holidays.php?year=2030"

# Получение праздников за несуществующий год
curl "http://localhost/api/holidays.php?year=2020"
# Ожидаемый ответ: {"success":false,"error":"Неверный год..."}
```

### Тестирование с неверными параметрами
```bash
# Отсутствие параметра
curl "http://localhost/api/holidays.php"
# Ожидаемый ответ: ошибка валидации

# Неверный год (меньше 2025)
curl "http://localhost/api/holidays.php?year=2020"
# Ожидаемый ответ: {"success":false,"error":"Неверный год..."}

# Неверный год (больше 2035)
curl "http://localhost/api/holidays.php?year=2040"
# Ожидаемый ответ: {"success":false,"error":"Неверный год..."}
```

### Проверка формата данных
```bash
# Проверить, что возвращается массив строк
curl "http://localhost/api/holidays.php?year=2025" | jq '.data'
# Должен вернуть массив дат в формате "YYYY-MM-DD"
```

---

## История правок

- **2025-12-12 11:20 (UTC+3, Брест):** Создана задача TASK-002-03

---

## Примечания

### Важные замечания
- Endpoint не требует авторизации (праздники — публичные данные)
- Файл `config/holidays-rb.json` должен существовать (создан в TASK-001-04)
- Если год не найден в файле, возвращается пустой массив (не ошибка)

### Оптимизация (опционально)
- Можно добавить кэширование в памяти (если файл не изменяется часто)
- Можно добавить проверку формата дат в массиве

### Следующие шаги
После завершения этого подэтапа можно переходить к:
- TASK-002-04: Реализация валидации данных
- TASK-002-05: Реализация безопасности
- TASK-002-06: Обработка ошибок

---

## Связь с документацией

- **Родительская задача:** [TASK-002](TASK-002-backend-api.md)
- **Техническое задание:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - разделы 5.3.1, 5.2.1
- **Связанная задача:** [TASK-001-04](../TASKS/TASK-001-04-holidays-config.md)

