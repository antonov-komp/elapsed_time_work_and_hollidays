# TASK-002-05: Реализация безопасности

**Дата создания:** 2025-12-12 11:20 (UTC+3, Брест)  
**Статус:** Новая  
**Приоритет:** Критический  
**Исполнитель:** Bitrix24 Программист (Vanilla JS)  
**Родительская задача:** [TASK-002](TASK-002-backend-api.md)  
**Подэтап:** 2.5 из 6  
**Длительность:** 1 день

---

## Описание

Создание класса `SecurityHelper.php` для обеспечения безопасности API endpoints. Реализация проверки прав доступа, санитизации путей файлов и защиты от атак (path traversal, unauthorized access).

**Связь с ТЗ:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - разделы 10.5, 5.2.1  
**Связь с этапами:** [DOCS/TZ/implementation-stages.md](../TZ/implementation-stages.md) - Этап 2, Подэтап 2.5

---

## Контекст

Это пятый подэтап создания Backend API. Класс безопасности необходим для защиты от несанкционированного доступа и атак. Без проверки безопасности пользователи могут получить доступ к чужим данным или выполнить атаки на файловую систему.

**Зависит от:**
- TASK-002-01: Создание API endpoint для получения данных табеля
- TASK-002-02: Создание API endpoint для сохранения данных табеля

---

## Модули и компоненты

### Backend (PHP)
- `api/helpers/SecurityHelper.php` — класс для обеспечения безопасности

### Используемые файлы
- `crest.php` — библиотека для работы с Bitrix24 REST API (для проверки пользователя)

---

## Зависимости

- **От каких задач зависит:**
  - TASK-002-01: Создание API endpoint для получения данных табеля
  - TASK-002-02: Создание API endpoint для сохранения данных табеля
- **Какие задачи зависят от этой:**
  - Все endpoints должны использовать методы безопасности

---

## Ступенчатые подзадачи

### Шаг 1: Создание класса SecurityHelper
1. Создать файл `api/helpers/SecurityHelper.php`
2. Создать класс `SecurityHelper`
3. Добавить namespace (опционально)

### Шаг 2: Реализация метода checkUserAccess
1. Создать метод `checkUserAccess($userId, $targetUserId)`
2. Проверить, что `$userId === $targetUserId` (пользователь может редактировать только свой табель)
3. Вернуть `true` или `false`
4. Логировать попытки несанкционированного доступа

### Шаг 3: Реализация метода sanitizePath
1. Создать метод `sanitizePath($path)`
2. Удалить все `..` из пути (защита от path traversal)
3. Удалить все символы, кроме букв, цифр, `/`, `-`, `_`
4. Проверить, что путь начинается с разрешённой директории
5. Вернуть очищенный путь

### Шаг 4: Реализация метода validateUserId
1. Создать метод `validateUserId($userId)`
2. Проверить, что ID — целое положительное число
3. Проверить разумные пределы (например, 1-999999999)
4. Вернуть `true` или `false`

### Шаг 5: Реализация метода getCurrentUserId
1. Создать метод `getCurrentUserId()`
2. Вызвать `CRest::call('user.current')`
3. Извлечь ID пользователя
4. Обработать ошибки
5. Вернуть ID или `null`

### Шаг 6: Реализация логирования операций
1. Создать метод `logOperation($operation, $details)`
2. Использовать `CRest::setLog()` для логирования
3. Логировать:
   - Попытки доступа
   - Успешные операции
   - Ошибки безопасности

### Шаг 7: Интеграция в endpoints
1. Подключить класс в `api/timesheet.php`
2. Использовать проверки безопасности перед операциями
3. Возвращать ошибку 403 при нарушении прав доступа

---

## Технические требования

### PHP
- **Версия:** PHP 8.3+
- **Стандарты:** PSR-12

### Безопасность
- Проверка прав доступа на каждом запросе
- Санитизация всех путей к файлам
- Защита от path traversal
- Логирование всех операций безопасности

---

## Критерии приёмки

- [ ] Создан класс `SecurityHelper.php`
- [ ] Реализован метод `checkUserAccess($userId, $targetUserId)`:
  - [ ] Проверяет совпадение ID пользователей
  - [ ] Логирует попытки несанкционированного доступа
  - [ ] Возвращает true/false
- [ ] Реализован метод `sanitizePath($path)`:
  - [ ] Удаляет `..` из пути
  - [ ] Проверяет, что путь в разрешённой директории
  - [ ] Возвращает очищенный путь
- [ ] Реализован метод `validateUserId($userId)`:
  - [ ] Проверяет формат ID
  - [ ] Возвращает true/false
- [ ] Реализован метод `getCurrentUserId()`:
  - [ ] Получает ID через Bitrix24 API
  - [ ] Обрабатывает ошибки
  - [ ] Возвращает ID или null
- [ ] Реализовано логирование операций
- [ ] Безопасность интегрирована в endpoints:
  - [ ] Проверка прав доступа работает
  - [ ] Санитизация путей работает
  - [ ] Ошибки безопасности возвращают статус 403

---

## Примеры кода

### api/helpers/SecurityHelper.php
```php
<?php
/**
 * Класс для обеспечения безопасности API
 */
class SecurityHelper
{
    /**
     * Проверка прав доступа пользователя
     * 
     * @param int $userId ID текущего пользователя
     * @param int $targetUserId ID пользователя, к данным которого обращаются
     * @return bool true если доступ разрешён, false если нет
     */
    public function checkUserAccess(int $userId, int $targetUserId): bool
    {
        if ($userId !== $targetUserId) {
            // Логирование попытки несанкционированного доступа
            $this->logSecurityEvent('unauthorized_access', [
                'user_id' => $userId,
                'target_user_id' => $targetUserId,
                'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
            ]);
            
            return false;
        }
        
        return true;
    }
    
    /**
     * Санитизация пути к файлу (защита от path traversal)
     * 
     * @param string $path Путь к файлу
     * @param string $baseDir Базовая директория (например, __DIR__ . '/../data')
     * @return string Очищенный путь или null при ошибке
     */
    public function sanitizePath(string $path, string $baseDir): ?string
    {
        // Удаление всех '..' из пути
        $path = str_replace('..', '', $path);
        
        // Удаление опасных символов (оставляем только буквы, цифры, /, -, _)
        $path = preg_replace('/[^a-zA-Z0-9\/\-_]/', '', $path);
        
        // Формирование полного пути
        $fullPath = $baseDir . '/' . $path;
        
        // Реальная очистка пути (удаление символических ссылок)
        $realPath = realpath(dirname($fullPath));
        $baseRealPath = realpath($baseDir);
        
        // Проверка, что путь находится в базовой директории
        if ($realPath === false || $baseRealPath === false) {
            return null;
        }
        
        if (strpos($realPath, $baseRealPath) !== 0) {
            // Попытка выхода за пределы базовой директории
            $this->logSecurityEvent('path_traversal_attempt', [
                'path' => $path,
                'real_path' => $realPath,
                'base_path' => $baseRealPath,
                'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
            ]);
            
            return null;
        }
        
        return $fullPath;
    }
    
    /**
     * Валидация ID пользователя
     * 
     * @param mixed $userId ID пользователя
     * @return bool true если валиден, false если нет
     */
    public function validateUserId($userId): bool
    {
        if (!is_numeric($userId)) {
            return false;
        }
        
        $userId = (int)$userId;
        
        // Проверка разумных пределов
        if ($userId < 1 || $userId > 999999999) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Получение ID текущего пользователя из Bitrix24
     * 
     * @return int|null ID пользователя или null при ошибке
     */
    public function getCurrentUserId(): ?int
    {
        require_once(__DIR__ . '/../../crest.php');
        
        $user = CRest::call('user.current');
        
        if (empty($user['result']) || !empty($user['error'])) {
            $this->logSecurityEvent('user_auth_failed', [
                'error' => $user['error'] ?? 'Unknown error',
                'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
            ]);
            
            return null;
        }
        
        $userId = (int)($user['result']['ID'] ?? 0);
        
        if (!$this->validateUserId($userId)) {
            return null;
        }
        
        return $userId;
    }
    
    /**
     * Логирование событий безопасности
     * 
     * @param string $event Тип события
     * @param array $details Детали события
     */
    protected function logSecurityEvent(string $event, array $details): void
    {
        require_once(__DIR__ . '/../../crest.php');
        
        CRest::setLog([
            'security_event' => $event,
            'timestamp' => date('c'),
            'details' => $details
        ], 'security');
    }
}
```

### Использование в api/timesheet.php
```php
<?php
require_once(__DIR__ . '/helpers/SecurityHelper.php');

$security = new SecurityHelper();

// Получение ID текущего пользователя
$currentUserId = $security->getCurrentUserId();

if (!$currentUserId) {
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'error' => 'Не удалось определить пользователя'
    ]);
    exit;
}

// Проверка прав доступа (если обращаемся к данным другого пользователя)
$targetUserId = $userId; // из параметров запроса
if (!$security->checkUserAccess($currentUserId, $targetUserId)) {
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'error' => 'Доступ запрещён'
    ]);
    exit;
}

// Санитизация пути к файлу
$baseDir = __DIR__ . '/../data';
$filePath = $security->sanitizePath("{$userId}/{$year}/{$month}/data.json", $baseDir);

if ($filePath === null) {
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'error' => 'Неверный путь к файлу'
    ]);
    exit;
}
```

---

## Тестирование

### Тестирование checkUserAccess
```php
$security = new SecurityHelper();

// Тест: доступ к своим данным
var_dump($security->checkUserAccess(12345, 12345)); // true

// Тест: доступ к чужим данным
var_dump($security->checkUserAccess(12345, 67890)); // false (должно залогироваться)
```

### Тестирование sanitizePath
```php
$security = new SecurityHelper();
$baseDir = __DIR__ . '/../data';

// Тест: нормальный путь
$path = $security->sanitizePath('12345/2025/12/data.json', $baseDir);
var_dump($path); // должен вернуть полный путь

// Тест: path traversal
$path = $security->sanitizePath('../../../etc/passwd', $baseDir);
var_dump($path); // должен вернуть null

// Тест: опасные символы
$path = $security->sanitizePath('12345/2025/12/../../data.json', $baseDir);
var_dump($path); // должен вернуть null или безопасный путь
```

---

## История правок

- **2025-12-12 11:20 (UTC+3, Брест):** Создана задача TASK-002-05

---

## Примечания

### Важные замечания
- Все проверки безопасности должны логироваться
- Path traversal — критическая уязвимость, должна быть полностью исключена
- Проверка прав доступа должна выполняться на каждом запросе

### Следующие шаги
После завершения этого подэтапа можно переходить к:
- TASK-002-06: Обработка ошибок
- Интеграция безопасности во все endpoints

---

## Связь с документацией

- **Родительская задача:** [TASK-002](TASK-002-backend-api.md)
- **Техническое задание:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - разделы 10.5, 5.2.1


