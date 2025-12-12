# TASK-002-04: Реализация валидации данных

**Дата создания:** 2025-12-12 11:20 (UTC+3, Брест)  
**Статус:** Новая  
**Приоритет:** Высокий  
**Исполнитель:** Bitrix24 Программист (Vanilla JS)  
**Родительская задача:** [TASK-002](TASK-002-backend-api.md)  
**Подэтап:** 2.4 из 6  
**Длительность:** 1 день

---

## Описание

Создание класса `ValidationHelper.php` для валидации всех типов данных табеля присутствия. Реализация методов проверки года, месяца, часов, статусов и бизнес-правил.

**Связь с ТЗ:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - разделы 7.2, 5.2.1  
**Связь с этапами:** [DOCS/TZ/implementation-stages.md](../TZ/implementation-stages.md) - Этап 2, Подэтап 2.4

---

## Контекст

Это четвёртый подэтап создания Backend API. Класс валидации необходим для обеспечения корректности данных перед сохранением в файл. Валидация должна проверять не только типы данных, но и бизнес-правила.

**Зависит от:**
- TASK-002-02: Создание API endpoint для сохранения данных табеля (будет использовать валидацию)

---

## Модули и компоненты

### Backend (PHP)
- `api/helpers/ValidationHelper.php` — класс для валидации данных

### Структура папок
- `api/helpers/` — папка для вспомогательных классов

---

## Зависимости

- **От каких задач зависит:** Нет (можно выполнять параллельно с другими подэтапами)
- **Какие задачи зависят от этой:**
  - TASK-002-02: Создание API endpoint для сохранения данных табеля (будет использовать валидацию)

---

## Ступенчатые подзадачи

### Шаг 1: Создание папки helpers
1. Создать папку `api/helpers/`:
   ```bash
   mkdir -p api/helpers
   ```
2. Проверить создание:
   ```bash
   ls -ld api/helpers/
   ```

### Шаг 2: Создание класса ValidationHelper
1. Создать файл `api/helpers/ValidationHelper.php`
2. Создать класс `ValidationHelper`
3. Добавить namespace (опционально): `namespace Api\Helpers;`

### Шаг 3: Реализация метода validateYear
1. Создать метод `validateYear($year)`
2. Проверить, что год — целое число
3. Проверить диапазон: 2025-2035
4. Вернуть `true` или `false`

### Шаг 4: Реализация метода validateMonth
1. Создать метод `validateMonth($month)`
2. Проверить, что месяц — целое число
3. Проверить диапазон: 1-12
4. Вернуть `true` или `false`

### Шаг 5: Реализация метода validateHours
1. Создать метод `validateHours($hours)`
2. Проверить, что часы — число (int или float)
3. Проверить диапазон: 0-24
4. Проверить шаг: должен быть кратен 0.5
5. Вернуть `true` или `false`

### Шаг 6: Реализация метода validateStatus
1. Создать метод `validateStatus($status)`
2. Проверить, что статус — строка или null
3. Если строка, проверить допустимые значения:
   - "Больничный"
   - "Командировка"
   - "Отпуск календарный"
   - "Отпуск за свой счёт"
4. Вернуть `true` или `false`

### Шаг 7: Реализация метода validateDayEntry
1. Создать метод `validateDayEntry($dayEntry)`
2. Проверить структуру (массив с полями `hours` и `status`)
3. Проверить бизнес-правило: часы и статус не могут быть указаны одновременно
4. Если указаны часы, проверить их через `validateHours()`
5. Если указан статус, проверить его через `validateStatus()`
6. Вернуть `true` или `false`

### Шаг 8: Реализация метода validateDaysData
1. Создать метод `validateDaysData($days)`
2. Проверить, что `$days` — массив
3. Для каждого дня:
   - Проверить ключ (номер дня: 1-31)
   - Вызвать `validateDayEntry()` для значения
4. Вернуть `true` или `false`

### Шаг 9: Реализация метода getValidationErrors
1. Создать метод `getValidationErrors()` для получения массива ошибок
2. Создать свойство класса `$errors = []`
3. При ошибке валидации добавлять описание в `$errors`
4. Вернуть массив ошибок

### Шаг 10: Интеграция в endpoints
1. Подключить класс в `api/timesheet.php`
2. Использовать методы валидации перед сохранением данных
3. Возвращать ошибки валидации в ответе API

---

## Технические требования

### PHP
- **Версия:** PHP 8.3+
- **Стандарты:** PSR-12
- **Типы:** Использовать type hints (int, float, string, array, ?string для nullable)

### Структура класса
- Статические методы или методы экземпляра класса
- Возврат `true/false` или массива ошибок
- Понятные сообщения об ошибках

---

## Критерии приёмки

- [ ] Создана папка `api/helpers/`
- [ ] Создан класс `ValidationHelper.php`
- [ ] Реализован метод `validateYear($year)`:
  - [ ] Проверяет диапазон 2025-2035
  - [ ] Возвращает true/false
- [ ] Реализован метод `validateMonth($month)`:
  - [ ] Проверяет диапазон 1-12
  - [ ] Возвращает true/false
- [ ] Реализован метод `validateHours($hours)`:
  - [ ] Проверяет диапазон 0-24
  - [ ] Проверяет шаг 0.5
  - [ ] Возвращает true/false
- [ ] Реализован метод `validateStatus($status)`:
  - [ ] Проверяет допустимые значения
  - [ ] Принимает null
  - [ ] Возвращает true/false
- [ ] Реализован метод `validateDayEntry($dayEntry)`:
  - [ ] Проверяет структуру
  - [ ] Проверяет бизнес-правило (часы и статус не одновременно)
  - [ ] Возвращает true/false
- [ ] Реализован метод `validateDaysData($days)`:
  - [ ] Проверяет структуру массива
  - [ ] Валидирует каждый день
  - [ ] Возвращает true/false
- [ ] Реализован метод получения ошибок валидации
- [ ] Валидация интегрирована в endpoint `api/timesheet.php`
- [ ] Ошибки валидации возвращаются в ответе API

---

## Примеры кода

### api/helpers/ValidationHelper.php
```php
<?php
/**
 * Класс для валидации данных табеля присутствия
 */
class ValidationHelper
{
    protected array $errors = [];
    
    /**
     * Валидация года
     * 
     * @param mixed $year Год для проверки
     * @return bool true если валиден, false если нет
     */
    public function validateYear($year): bool
    {
        $this->errors = [];
        
        if (!is_numeric($year)) {
            $this->errors[] = 'Год должен быть числом';
            return false;
        }
        
        $year = (int)$year;
        
        if ($year < 2025 || $year > 2035) {
            $this->errors[] = "Год должен быть в диапазоне 2025-2035. Получено: {$year}";
            return false;
        }
        
        return true;
    }
    
    /**
     * Валидация месяца
     * 
     * @param mixed $month Месяц для проверки
     * @return bool true если валиден, false если нет
     */
    public function validateMonth($month): bool
    {
        $this->errors = [];
        
        if (!is_numeric($month)) {
            $this->errors[] = 'Месяц должен быть числом';
            return false;
        }
        
        $month = (int)$month;
        
        if ($month < 1 || $month > 12) {
            $this->errors[] = "Месяц должен быть в диапазоне 1-12. Получено: {$month}";
            return false;
        }
        
        return true;
    }
    
    /**
     * Валидация часов
     * 
     * @param mixed $hours Часы для проверки
     * @return bool true если валидны, false если нет
     */
    public function validateHours($hours): bool
    {
        $this->errors = [];
        
        if (!is_numeric($hours)) {
            $this->errors[] = 'Часы должны быть числом';
            return false;
        }
        
        $hours = (float)$hours;
        
        if ($hours < 0 || $hours > 24) {
            $this->errors[] = "Часы должны быть в диапазоне 0-24. Получено: {$hours}";
            return false;
        }
        
        // Проверка шага 0.5
        $step = 0.5;
        $remainder = fmod($hours, $step);
        
        if ($remainder > 0.001 && $remainder < ($step - 0.001)) {
            $this->errors[] = "Часы должны быть кратны 0.5. Получено: {$hours}";
            return false;
        }
        
        return true;
    }
    
    /**
     * Валидация статуса
     * 
     * @param mixed $status Статус для проверки
     * @return bool true если валиден, false если нет
     */
    public function validateStatus($status): bool
    {
        $this->errors = [];
        
        // null допустим
        if ($status === null) {
            return true;
        }
        
        if (!is_string($status)) {
            $this->errors[] = 'Статус должен быть строкой или null';
            return false;
        }
        
        $allowedStatuses = [
            'Больничный',
            'Командировка',
            'Отпуск календарный',
            'Отпуск за свой счёт'
        ];
        
        if (!in_array($status, $allowedStatuses, true)) {
            $this->errors[] = "Неверный статус. Допустимые значения: " . implode(', ', $allowedStatuses);
            return false;
        }
        
        return true;
    }
    
    /**
     * Валидация записи дня
     * 
     * @param array $dayEntry Запись дня (hours, status)
     * @return bool true если валидна, false если нет
     */
    public function validateDayEntry(array $dayEntry): bool
    {
        $this->errors = [];
        
        // Проверка структуры
        if (!isset($dayEntry['hours']) || !isset($dayEntry['status'])) {
            $this->errors[] = 'Запись дня должна содержать поля "hours" и "status"';
            return false;
        }
        
        $hours = $dayEntry['hours'];
        $status = $dayEntry['status'];
        
        // Проверка бизнес-правила: часы и статус не одновременно
        $hasHours = is_numeric($hours) && $hours > 0;
        $hasStatus = $status !== null && $status !== '';
        
        if ($hasHours && $hasStatus) {
            $this->errors[] = 'Нельзя указать одновременно часы и статус';
            return false;
        }
        
        // Валидация часов (если указаны)
        if ($hasHours) {
            if (!$this->validateHours($hours)) {
                return false;
            }
        } elseif ($hours !== 0 && $hours !== null) {
            $this->errors[] = 'Если указан статус, часы должны быть 0 или null';
            return false;
        }
        
        // Валидация статуса (если указан)
        if ($hasStatus) {
            if (!$this->validateStatus($status)) {
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * Валидация данных дней
     * 
     * @param array $days Массив дней
     * @return bool true если валидны, false если нет
     */
    public function validateDaysData(array $days): bool
    {
        $this->errors = [];
        
        if (empty($days)) {
            // Пустой массив допустим
            return true;
        }
        
        foreach ($days as $day => $dayEntry) {
            // Проверка номера дня
            if (!is_numeric($day) || $day < 1 || $day > 31) {
                $this->errors["days.{$day}"] = "Неверный номер дня: {$day}. Должен быть 1-31";
                continue;
            }
            
            // Проверка структуры записи
            if (!is_array($dayEntry)) {
                $this->errors["days.{$day}"] = "Запись дня должна быть массивом";
                continue;
            }
            
            // Валидация записи дня
            if (!$this->validateDayEntry($dayEntry)) {
                $dayErrors = $this->getErrors();
                foreach ($dayErrors as $error) {
                    $this->errors["days.{$day}"] = $error;
                }
            }
        }
        
        return empty($this->errors);
    }
    
    /**
     * Получение массива ошибок валидации
     * 
     * @return array Массив ошибок
     */
    public function getErrors(): array
    {
        return $this->errors;
    }
    
    /**
     * Очистка ошибок
     */
    public function clearErrors(): void
    {
        $this->errors = [];
    }
}
```

### Использование в api/timesheet.php
```php
<?php
require_once(__DIR__ . '/helpers/ValidationHelper.php');

// ...

// Валидация данных перед сохранением
$validation = new ValidationHelper();

if (!$validation->validateDaysData($data['days'])) {
    $errors = $validation->getErrors();
    
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Ошибка валидации',
        'message' => 'Неверный формат данных',
        'errors' => $errors
    ]);
    exit;
}
```

---

## Тестирование

### Тестирование методов валидации
```php
<?php
require_once('api/helpers/ValidationHelper.php');

$validation = new ValidationHelper();

// Тест validateYear
var_dump($validation->validateYear(2025)); // true
var_dump($validation->validateYear(2020)); // false
var_dump($validation->validateYear(2040)); // false

// Тест validateMonth
var_dump($validation->validateMonth(12)); // true
var_dump($validation->validateMonth(13)); // false

// Тест validateHours
var_dump($validation->validateHours(8.0)); // true
var_dump($validation->validateHours(7.5)); // true
var_dump($validation->validateHours(8.3)); // false (не кратно 0.5)
var_dump($validation->validateHours(25)); // false (больше 24)

// Тест validateStatus
var_dump($validation->validateStatus('Больничный')); // true
var_dump($validation->validateStatus(null)); // true
var_dump($validation->validateStatus('Неверный')); // false

// Тест validateDayEntry
var_dump($validation->validateDayEntry(['hours' => 8.0, 'status' => null])); // true
var_dump($validation->validateDayEntry(['hours' => 0, 'status' => 'Больничный'])); // true
var_dump($validation->validateDayEntry(['hours' => 8.0, 'status' => 'Больничный'])); // false
```

---

## История правок

- **2025-12-12 11:20 (UTC+3, Брест):** Создана задача TASK-002-04

---

## Примечания

### Важные замечания
- Все методы должны возвращать понятные сообщения об ошибках
- Бизнес-правила должны проверяться строго (часы и статус не одновременно)
- Валидация должна быть быстрой (не делать лишних проверок)

### Следующие шаги
После завершения этого подэтапа можно переходить к:
- TASK-002-05: Реализация безопасности
- TASK-002-06: Обработка ошибок
- Интеграция валидации в существующие endpoints

---

## Связь с документацией

- **Родительская задача:** [TASK-002](TASK-002-backend-api.md)
- **Техническое задание:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - разделы 7.2, 5.2.1


