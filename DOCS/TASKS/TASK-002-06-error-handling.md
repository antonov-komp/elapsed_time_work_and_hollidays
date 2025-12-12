# TASK-002-06: Обработка ошибок

**Дата создания:** 2025-12-12 11:20 (UTC+3, Брест)  
**Статус:** Новая  
**Приоритет:** Высокий  
**Исполнитель:** Bitrix24 Программист (Vanilla JS)  
**Родительская задача:** [TASK-002](TASK-002-backend-api.md)  
**Подэтап:** 2.6 из 6  
**Длительность:** 1 день

---

## Описание

Создание единой системы обработки ошибок для всех API endpoints. Реализация обработки различных типов ошибок с возвратом понятных сообщений и логированием.

**Связь с ТЗ:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - раздел 10.3  
**Связь с этапами:** [DOCS/TZ/implementation-stages.md](../TZ/implementation-stages.md) - Этап 2, Подэтап 2.6

---

## Контекст

Это шестой (последний) подэтап создания Backend API. Единая система обработки ошибок необходима для обеспечения стабильности API и удобства отладки.

**Зависит от:**
- Все предыдущие подэтапы TASK-002 (endpoints уже созданы)

---

## Модули и компоненты

### Backend (PHP)
- `api/helpers/ErrorHandler.php` — класс для обработки ошибок (опционально, можно интегрировать в существующие классы)

### Используемые файлы
- Все API endpoints (`api/timesheet.php`, `api/holidays.php`)

---

## Зависимости

- **От каких задач зависит:**
  - TASK-002-01: Создание API endpoint для получения данных табеля
  - TASK-002-02: Создание API endpoint для сохранения данных табеля
  - TASK-002-03: Создание API endpoint для получения праздников
- **Какие задачи зависят от этой:** Нет (это последний подэтап)

---

## Ступенчатые подзадачи

### Шаг 1: Определение типов ошибок
1. Ошибки валидации (400 Bad Request)
2. Ошибки доступа (403 Forbidden)
3. Ошибки файловой системы (500 Internal Server Error)
4. Ошибки JSON (400 Bad Request)
5. Ошибки Bitrix24 API (500 Internal Server Error)

### Шаг 2: Создание класса ErrorHandler (опционально)
1. Создать файл `api/helpers/ErrorHandler.php`
2. Или добавить методы в существующие классы

### Шаг 3: Реализация обработки ошибок
1. Метод `handleError($exception, $context)`
2. Определение типа ошибки
3. Установка HTTP статус кода
4. Формирование JSON ответа
5. Логирование ошибки

### Шаг 4: Интеграция во все endpoints
1. Обернуть код в try-catch
2. Использовать единую обработку ошибок
3. Логировать все ошибки

---

## Технические требования

### HTTP статус коды
- 200 — успех
- 400 — ошибка валидации
- 403 — нет доступа
- 500 — ошибка сервера

### Формат ответа об ошибке
```json
{
  "success": false,
  "error": "Тип ошибки",
  "message": "Понятное описание ошибки"
}
```

---

## Критерии приёмки

- [ ] Обработка ошибок реализована во всех endpoints
- [ ] Все типы ошибок обрабатываются:
  - [ ] Ошибки валидации (400)
  - [ ] Ошибки доступа (403)
  - [ ] Ошибки файловой системы (500)
  - [ ] Ошибки JSON (400)
- [ ] Ошибки логируются в `logs/`
- [ ] Возвращаются понятные сообщения об ошибках
- [ ] HTTP статус коды корректны

---

## Примеры кода

### Обработка ошибок в endpoints
```php
try {
    // Код endpoint
} catch (ValidationException $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Ошибка валидации',
        'message' => $e->getMessage()
    ]);
    CRest::setLog(['error' => $e->getMessage()], 'validation_error');
} catch (SecurityException $e) {
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'error' => 'Доступ запрещён',
        'message' => $e->getMessage()
    ]);
    CRest::setLog(['error' => $e->getMessage()], 'security_error');
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Внутренняя ошибка сервера',
        'message' => $e->getMessage()
    ]);
    CRest::setLog(['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()], 'api_error');
}
```

---

## История правок

- **2025-12-12 11:20 (UTC+3, Брест):** Создана задача TASK-002-06

---

## Связь с документацией

- **Родительская задача:** [TASK-002](TASK-002-backend-api.md)
- **Техническое задание:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - раздел 10.3

