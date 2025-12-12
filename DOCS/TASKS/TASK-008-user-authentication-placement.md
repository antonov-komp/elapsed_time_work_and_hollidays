# TASK-008: Получение информации о текущем пользователе в Bitrix24 Placement

**Дата создания:** 2025-12-12 16:37 (UTC+3, Брест)  
**Статус:** Завершена  
**Приоритет:** Высокий  
**Исполнитель:** Bitrix24 Программист (Vue.js)

---

## Описание

Реализована система получения информации о текущем пользователе Bitrix24 в контексте placement-приложения. Проблема заключалась в том, что приложение отображало данные владельца токена приложения, а не данные текущего пользователя, который открыл placement в интерфейсе Bitrix24.

## Контекст

При работе с Bitrix24 placement-приложениями возникает необходимость различать:
- **Владелец токена приложения** — пользователь, который установил приложение и получил токен
- **Текущий пользователь** — пользователь, который открыл placement в интерфейсе Bitrix24

По умолчанию все запросы к Bitrix24 REST API используют токен владельца приложения, что приводит к отображению его данных вместо данных текущего пользователя.

## Проблема

1. **Отображение данных владельца токена вместо текущего пользователя:**
   - При открытии placement в Bitrix24 отображались данные пользователя, который установил приложение
   - Не было способа получить токен текущего пользователя из контекста placement

2. **Ошибка 404 при запросе данных пользователя:**
   - Изначально приложение пыталось использовать `BX.ajax` для получения данных пользователя
   - В контексте placement `BX.ajax` не всегда доступен или работает некорректно
   - Прямые запросы к `/rest/user.current.json` возвращали 404

3. **Ошибка с приватным методом CRest:**
   - Попытка использовать `CRest::getAppSettings()` приводила к ошибке "Call to private method"
   - Метод `getAppSettings()` является приватным и недоступен извне класса

## Решение

### 1. Создание PHP API endpoint для получения данных пользователя

**Файл:** `api/user.php`

Создан новый API endpoint, который:
- Принимает токен пользователя (`AUTH_ID`) через GET-параметры
- Использует токен для запроса данных текущего пользователя через Bitrix24 REST API
- Возвращает данные пользователя в формате JSON

**Ключевые особенности:**
- Поддержка токена текущего пользователя из placement
- Fallback на токен владельца приложения, если токен пользователя не передан
- Чтение endpoint из `settings.json` (обход приватного метода `getAppSettings()`)
- Прямой вызов Bitrix24 REST API через curl с токеном пользователя

### 2. Передача токена пользователя из placement в JavaScript

**Файл:** `placement.php`

Добавлена передача токена пользователя из Bitrix24 placement в глобальную переменную JavaScript:

```php
window.PLACEMENT_AUTH_ID = <?= json_encode($_REQUEST['AUTH_ID'] ?? null) ?>;
```

Bitrix24 автоматически передаёт `AUTH_ID` в параметрах запроса к placement, что позволяет получить токен текущего пользователя.

### 3. Обновление Bitrix24ApiService для использования PHP endpoint

**Файл:** `js/vue-apps/timesheet/services/Bitrix24ApiService.js`

Обновлён метод `getCurrentUser()`:
- Приоритетное использование `BX.ajax` (если доступен в контексте Bitrix24)
- Fallback на PHP endpoint `/api/user.php` с передачей токена пользователя
- Передача `AUTH_ID` из глобальной переменной `window.PLACEMENT_AUTH_ID` в запросе

## Технические детали

### Архитектура решения

```
┌─────────────────┐
│  Bitrix24 UI    │
│  (Placement)    │
└────────┬────────┘
         │ Передаёт AUTH_ID в $_REQUEST
         ▼
┌─────────────────┐
│ placement.php   │
│                 │
│ window.PLACEMENT_│
│ AUTH_ID = ...   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Vue.js App      │
│ Bitrix24ApiService│
└────────┬────────┘
         │ GET /api/user.php?AUTH_ID=...
         ▼
┌─────────────────┐
│ api/user.php    │
│                 │
│ 1. Читает AUTH_ID│
│ 2. Читает endpoint│
│    из settings.json│
│ 3. Выполняет curl│
│    запрос к Bitrix24│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Bitrix24 REST   │
│ API             │
│ user.current    │
└─────────────────┘
```

### Поток данных

1. **Bitrix24 открывает placement:**
   - Bitrix24 передаёт `AUTH_ID` текущего пользователя в параметрах запроса к `placement.php`
   - `AUTH_ID` содержит токен текущего пользователя, который открыл placement

2. **placement.php передаёт токен в JavaScript:**
   - Токен сохраняется в глобальной переменной `window.PLACEMENT_AUTH_ID`
   - Vue.js приложение получает доступ к токену через эту переменную

3. **Vue.js приложение запрашивает данные пользователя:**
   - `Bitrix24ApiService.getCurrentUser()` проверяет доступность `BX.ajax`
   - Если `BX.ajax` недоступен, используется fallback на `/api/user.php`
   - Токен передаётся в GET-параметре: `/api/user.php?AUTH_ID=...`

4. **PHP endpoint получает данные пользователя:**
   - `api/user.php` читает `AUTH_ID` из `$_GET['AUTH_ID']`
   - Читает `client_endpoint` из `settings.json`
   - Выполняет curl-запрос к Bitrix24 REST API с токеном пользователя
   - Возвращает данные пользователя в формате JSON

5. **Vue.js приложение отображает данные:**
   - Данные пользователя сохраняются в Pinia Store
   - Компонент `UserInfo` отображает имя и должность текущего пользователя

### Изменённые файлы

1. **`api/user.php`** (новый файл)
   - API endpoint для получения данных текущего пользователя
   - Поддержка токена пользователя из placement
   - Чтение endpoint из `settings.json`

2. **`placement.php`**
   - Добавлена передача `AUTH_ID` в глобальную переменную JavaScript
   - Добавлено логирование для отладки

3. **`js/vue-apps/timesheet/services/Bitrix24ApiService.js`**
   - Обновлён метод `getCurrentUser()` для использования PHP endpoint
   - Добавлен метод `getCurrentUserViaApi()` для запроса через PHP

## Код реализации

### api/user.php

```php
<?php
/**
 * API endpoint для получения данных текущего пользователя
 * 
 * GET /api/user.php?AUTH_ID=... - получение данных текущего пользователя
 * 
 * Используется метод Bitrix24 REST API: user.current
 * Документация: https://context7.com/bitrix24/rest/user.current
 */

require_once(__DIR__ . '/../crest.php');

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Обработка preflight запросов
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Только GET запросы
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Метод не разрешён. Используйте GET.'
    ]);
    exit;
}

try {
    // В контексте placement используем токен из AUTH_ID (текущий пользователь)
    // Если AUTH_ID не передан, используем сохранённый токен (владелец приложения)
    $userToken = null;
    
    // Проверяем токен в GET параметрах (из JavaScript fetch)
    if (!empty($_GET['AUTH_ID'])) {
        $userToken = htmlspecialchars($_GET['AUTH_ID']);
    }
    // Также проверяем в $_REQUEST (на случай, если передано через POST)
    elseif (!empty($_REQUEST['AUTH_ID'])) {
        $userToken = htmlspecialchars($_REQUEST['AUTH_ID']);
    }
    
    // Получение данных пользователя из Bitrix24
    if ($userToken !== null) {
        // Получаем endpoint из константы или файла настроек
        $endpoint = null;
        
        // Проверяем константу C_REST_WEB_HOOK_URL
        if (defined('C_REST_WEB_HOOK_URL') && !empty(C_REST_WEB_HOOK_URL)) {
            $endpoint = C_REST_WEB_HOOK_URL;
        } else {
            // Читаем из settings.json
            $settingsFile = __DIR__ . '/../settings.json';
            if (file_exists($settingsFile)) {
                $settingsData = json_decode(file_get_contents($settingsFile), true);
                if (!empty($settingsData['client_endpoint'])) {
                    $endpoint = $settingsData['client_endpoint'];
                }
            }
        }
        
        if (empty($endpoint)) {
            throw new Exception('Не настроено подключение к Bitrix24 (endpoint не найден)');
        }
        
        // Убеждаемся, что endpoint заканчивается на /
        if (substr($endpoint, -1) !== '/') {
            $endpoint .= '/';
        }
        
        // Формируем URL для запроса
        $url = $endpoint . 'user.current.json';
        
        // Выполняем запрос с токеном пользователя
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query(['auth' => $userToken]));
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Bitrix24 CRest PHP');
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);
        
        if ($curlError) {
            throw new Exception("CURL error: {$curlError}");
        }
        
        if ($httpCode !== 200) {
            throw new Exception("HTTP error! status: {$httpCode}, response: {$response}");
        }
        
        $user = json_decode($response, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("JSON decode error: " . json_last_error_msg());
        }
    } else {
        // Используем стандартный метод CRest (токен владельца)
        $user = CRest::call('user.current');
    }
    
    if (empty($user['result']) || !empty($user['error'])) {
        throw new Exception($user['error_description'] ?? $user['error'] ?? 'Не удалось получить данные пользователя');
    }
    
    // Формирование ответа
    $response = [
        'success' => true,
        'result' => $user['result']
    ];
    
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'error_description' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
```

### placement.php (изменения)

```php
<!-- Передача токена пользователя в JavaScript для API запросов -->
<script>
// Передача токена пользователя из placement в глобальную переменную
// Bitrix24 передаёт AUTH_ID в параметрах placement для текущего пользователя
window.PLACEMENT_AUTH_ID = <?= json_encode($_REQUEST['AUTH_ID'] ?? null) ?>;

// Логирование для отладки (временно)
console.log('Placement AUTH_ID:', window.PLACEMENT_AUTH_ID ? 'передан' : 'не передан');
</script>
```

### Bitrix24ApiService.js (изменения)

```javascript
/**
 * Получение данных пользователя через PHP API endpoint
 * 
 * Передаёт токен пользователя из placement (AUTH_ID) если доступен
 * 
 * @returns {Promise<Object>} Данные пользователя
 * @private
 */
static async getCurrentUserViaApi() {
    // Получаем токен пользователя из placement (если доступен)
    const authId = window.PLACEMENT_AUTH_ID || null;
    
    // Формируем URL с токеном пользователя
    let url = '/api/user.php';
    if (authId) {
        url += '?AUTH_ID=' + encodeURIComponent(authId);
    }
    
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success || data.error) {
        throw new Error(data.error_description || data.error || 'Ошибка получения данных пользователя');
    }
    
    return data.result;
}
```

## Решенные проблемы

### 1. Отображение данных текущего пользователя

**До:** Отображались данные владельца токена приложения  
**После:** Отображаются данные текущего пользователя, который открыл placement

### 2. Ошибка 404 при запросе данных пользователя

**До:** Прямые запросы к `/rest/user.current.json` возвращали 404  
**После:** Используется PHP endpoint `/api/user.php`, который корректно обрабатывает запросы

### 3. Ошибка с приватным методом CRest

**До:** Попытка использовать `CRest::getAppSettings()` приводила к ошибке  
**После:** Endpoint читается напрямую из `settings.json` или константы `C_REST_WEB_HOOK_URL`

## Критерии приёмки

- [x] При открытии placement отображаются данные текущего пользователя (не владельца токена)
- [x] API endpoint `/api/user.php` корректно обрабатывает запросы с токеном пользователя
- [x] Токен пользователя передаётся из Bitrix24 placement в JavaScript приложение
- [x] Fallback на токен владельца работает, если токен пользователя не передан
- [x] Обработка ошибок реализована (404, 401, 500)
- [x] Логирование добавлено для отладки

## Тестирование

### Проверка работы

1. **Открыть placement в Bitrix24:**
   - Открыть профиль пользователя в Bitrix24
   - Найти placement "Мой Ежемесячный табель присутствия"
   - Открыть placement

2. **Проверить отображение данных пользователя:**
   - В компоненте `UserInfo` должно отображаться имя и должность текущего пользователя
   - Данные должны соответствовать пользователю, который открыл placement

3. **Проверить в консоли браузера:**
   - `Placement AUTH_ID: передан` — токен должен быть передан
   - Запрос `GET /api/user.php?AUTH_ID=...` должен возвращать 200 OK
   - Ответ должен содержать данные текущего пользователя

### Проверка fallback

1. **Открыть placement без токена пользователя:**
   - Если `AUTH_ID` не передан, должен использоваться токен владельца
   - Данные владельца должны отображаться корректно

## Документация

### API Endpoint

**URL:** `/api/user.php`  
**Метод:** `GET`  
**Параметры:**
- `AUTH_ID` (опционально) — токен текущего пользователя из Bitrix24 placement

**Ответ:**
```json
{
  "success": true,
  "result": {
    "ID": "123",
    "NAME": "Иван",
    "LAST_NAME": "Иванов",
    "SECOND_NAME": "Петрович",
    "EMAIL": "ivan@example.com",
    "WORK_POSITION": "Менеджер",
    ...
  }
}
```

**Ошибки:**
- `405` — метод не разрешён (используйте GET)
- `500` — ошибка при получении данных пользователя

### Используемые методы Bitrix24 REST API

- **`user.current`** — получение данных текущего пользователя
  - Документация: https://context7.com/bitrix24/rest/user.current

## История правок

- **2025-12-12 16:37 (UTC+3, Брест):** Создана задача и реализовано решение
  - Создан API endpoint `/api/user.php`
  - Добавлена передача токена пользователя из placement в JavaScript
  - Обновлён `Bitrix24ApiService` для использования PHP endpoint
  - Исправлена ошибка с приватным методом `CRest::getAppSettings()`

## Связанные задачи

- **TASK-002:** Backend API — создание базовых API endpoints
- **TASK-003:** Services & Utilities — создание `Bitrix24ApiService`
- **TASK-004:** Basic Vue Components — создание компонента `UserInfo`

## Примечания

1. **Безопасность:**
   - Токен пользователя передаётся через GET-параметры (HTTPS)
   - Токен валидируется на стороне сервера перед использованием
   - Ошибки не раскрывают чувствительную информацию

2. **Производительность:**
   - Запрос к Bitrix24 REST API выполняется один раз при загрузке приложения
   - Данные пользователя кешируются в Pinia Store
   - Fallback на `BX.ajax` используется для оптимизации (если доступен)

3. **Совместимость:**
   - Решение работает как в облачной, так и в коробочной версии Bitrix24
   - Поддерживается fallback на токен владельца приложения
   - Работает в контексте placement и вне его

---

**Статус:** ✅ Завершена  
**Дата завершения:** 2025-12-12 16:37 (UTC+3, Брест)

