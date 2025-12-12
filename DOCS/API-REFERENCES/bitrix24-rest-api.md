# Справочник Bitrix24 REST API

**Дата создания:** 2025-12-12 10:46 (UTC+3, Брест)  
**Версия:** 1.0  
**Описание:** Справочник используемых методов Bitrix24 REST API в приложении "Мой Ежемесячный табель присутствия"

---

## Общая информация

**Библиотека:** CRest (версия 1.36)  
**Документация Bitrix24:**
- https://context7.com/bitrix24/rest/
- https://apidocs.bitrix24.ru/

**Использование в коде:**
```php
require_once (__DIR__.'/crest.php');
$result = CRest::call('method.name', ['param' => 'value']);
```

---

## Методы пользователей

### user.current

**Описание:** Получение данных текущего пользователя

**Использование:**
```php
$user = CRest::call('user.current');
```

**Ответ:**
```json
{
  "result": {
    "ID": "1",
    "NAME": "Иван",
    "LAST_NAME": "Иванов",
    "EMAIL": "ivan@example.com",
    ...
  }
}
```

**Документация:** https://context7.com/bitrix24/rest/user.current

**Используется в:** `placement.php`

---

### user.get

**Описание:** Получение данных пользователя по ID

**Использование:**
```php
$user = CRest::call('user.get', ['ID' => 123]);
```

**Параметры:**
- `ID` — ID пользователя

**Документация:** https://context7.com/bitrix24/rest/user.get

---

## Методы placements

### placement.bind

**Описание:** Регистрация placement в Bitrix24

**Использование:**
```php
$result = CRest::call(
    'placement.bind',
    [
        'PLACEMENT' => 'USER_PROFILE_TOOLBAR',
        'HANDLER' => 'https://ваш-домен.ru/placement.php',
        'TITLE' => 'Мой Ежемесячный табель присутствия'
    ]
);
```

**Параметры:**
- `PLACEMENT` — тип placement (USER_PROFILE_TOOLBAR)
- `HANDLER` — URL обработчика placement
- `TITLE` — название placement

**Документация:** https://context7.com/bitrix24/rest/placement.bind

**Используется в:** `install.php`

---

### placement.unbind

**Описание:** Удаление placement из Bitrix24

**Использование:**
```php
$result = CRest::call(
    'placement.unbind',
    [
        'PLACEMENT' => 'USER_PROFILE_TOOLBAR',
        'HANDLER' => 'https://ваш-домен.ru/placement.php'
    ]
);
```

**Параметры:**
- `PLACEMENT` — тип placement
- `HANDLER` — URL обработчика placement

**Документация:** https://context7.com/bitrix24/rest/placement.unbind

**Используется в:** `install.php` (перед регистрацией нового placement)

---

## Планируемые методы

### Методы для работы с табелем присутствия

Методы будут определены в задачах разработки.

**Возможные методы:**
- Методы для работы с календарём
- Методы для работы с задачами
- Методы для работы с пользователями

---

## Обработка ошибок

### Типичные ошибки

**expired_token**
- **Описание:** Токен доступа истёк
- **Решение:** Автоматическое обновление через refresh_token

**invalid_token**
- **Описание:** Неверный токен
- **Решение:** Переустановка приложения

**QUERY_LIMIT_EXCEEDED**
- **Описание:** Превышен лимит запросов (максимум 2 запроса в секунду)
- **Решение:** Добавить задержку между запросами

**ERROR_METHOD_NOT_FOUND**
- **Описание:** Метод не найден или нет прав доступа
- **Решение:** Проверить права приложения в Bitrix24

---

## Примеры использования

### Получение данных пользователя

```php
require_once (__DIR__.'/crest.php');

$user = CRest::call('user.current');

if (empty($user['error']) && !empty($user['result'])) {
    echo "Пользователь: " . $user['result']['NAME'];
} else {
    echo "Ошибка: " . $user['error'];
}
```

### Регистрация placement

```php
require_once (__DIR__.'/crest.php');

$handlerUrl = 'https://ваш-домен.ru/placement.php';

$result = CRest::call(
    'placement.bind',
    [
        'PLACEMENT' => 'USER_PROFILE_TOOLBAR',
        'HANDLER' => $handlerUrl,
        'TITLE' => 'Мой Ежемесячный табель присутствия'
    ]
);

if (empty($result['error'])) {
    echo "Placement зарегистрирован";
} else {
    echo "Ошибка: " . $result['error'];
}
```

---

## Логирование

Все вызовы API логируются в папку `logs/`:
- Тип лога: `callCurl`
- Формат: JSON или var_export
- Путь: `logs/YYYY-MM-DD/HH/timestamp_callCurl_log.json`

---

## История изменений

- **2025-12-12 10:46 (UTC+3, Брест):** Создан справочник с описанием используемых методов

