# Руководство по разработке на Vue.js

**Дата создания:** 2025-12-12 10:46 (UTC+3, Брест)  
**Версия:** 1.0  
**Описание:** Руководство по разработке интерфейса приложения "Мой Ежемесячный табель присутствия" с использованием Vue.js

---

## Общая информация

**Фреймворк:** Vue.js 3.x  
**Подход:** Composition API  
**Интеграция:** Bitrix24 BX.* API  
**Сборка:** Webpack или Vite (для production)

---

## Структура проекта для Vue.js

### Планируемая структура

```
back1/
├── placement.php            # Точка входа для placement (PHP)
├── js/
│   └── vue-apps/
│       └── timesheet/       # Vue.js приложение для табеля
│           ├── main.js      # Точка входа Vue.js
│           ├── App.vue      # Корневой компонент
│           ├── components/  # Компоненты
│           │   ├── TimesheetTable.vue
│           │   ├── TimesheetForm.vue
│           │   └── TimesheetCard.vue
│           ├── services/   # Сервисы для работы с API
│           │   └── Bitrix24ApiService.js
│           ├── utils/       # Утилиты
│           │   └── helpers.js
│           └── stores/       # Состояние (если используется Vuex/Pinia)
│               └── timesheetStore.js
├── css/
│   └── app.css             # Глобальные стили
└── package.json            # Зависимости npm
```

---

## Установка и настройка

### 1. Инициализация npm

```bash
cd /var/www/back1
npm init -y
```

### 2. Установка Vue.js

```bash
npm install vue@3
```

### 3. Установка сборщика (Vite)

```bash
npm install -D vite @vitejs/plugin-vue
```

### 4. Создание конфигурации Vite

Создайте файл `vite.config.js`:

```javascript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: './js/vue-apps/timesheet/main.js'
      }
    }
  }
});
```

---

## Интеграция с Bitrix24

### 1. Подключение Vue.js в placement.php

```php
<?php
// placement.php

// Подключение Vue.js через CDN или собранный файл
$APPLICATION->AddHeadScript('https://unpkg.com/vue@3/dist/vue.global.js');
// Или собранный файл:
// $APPLICATION->AddHeadScript('/dist/assets/main.js');
?>

<div id="vue-timesheet-app"></div>

<script>
// Инициализация Vue.js приложения
const { createApp } = Vue;

createApp({
  // ...
}).mount('#vue-timesheet-app');
</script>
```

### 2. Сервис для работы с Bitrix24 API

Создайте файл `js/vue-apps/timesheet/services/Bitrix24ApiService.js`:

```javascript
/**
 * Сервис для работы с Bitrix24 REST API
 * 
 * Используется Vue.js компонентами для получения данных
 */
export class Bitrix24ApiService {
    /**
     * Базовый URL для API запросов
     */
    static getApiUrl() {
        return '/api/'; // PHP endpoint для работы с Bitrix24
    }
    
    /**
     * Выполнение запроса к Bitrix24 API
     * 
     * @param {string} method Метод API (например, 'user.current')
     * @param {object} params Параметры запроса
     * @returns {Promise<object>} Результат запроса
     */
    static async call(method, params = {}) {
        const url = this.getApiUrl() + 'call.php';
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    method: method,
                    params: params
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.error) {
                throw new Error(result.error_description || result.error);
            }
            
            return result;
        } catch (error) {
            console.error('Bitrix24 API error:', error);
            throw error;
        }
    }
    
    /**
     * Получение данных текущего пользователя
     */
    static async getCurrentUser() {
        const result = await this.call('user.current');
        return result.result || null;
    }
}
```

### 3. PHP endpoint для API

Создайте файл `api/call.php`:

```php
<?php
require_once (__DIR__.'/../crest.php');

header('Content-Type: application/json');

// Проверка прав доступа
if (!check_bitrix_sessid()) {
    http_response_code(403);
    echo json_encode(['error' => 'Invalid session']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['method'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Method is required']);
    exit;
}

try {
    $result = CRest::call($data['method'], $data['params'] ?? []);
    echo json_encode($result);
} catch (\Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage()
    ]);
}
```

---

## Создание компонентов Vue.js

### Пример компонента TimesheetTable.vue

```vue
<template>
    <div class="timesheet-table">
        <div v-if="isLoading" class="loading">
            Загрузка...
        </div>
        
        <div v-else-if="error" class="error">
            {{ error }}
        </div>
        
        <table v-else class="table">
            <thead>
                <tr>
                    <th>Дата</th>
                    <th>Статус</th>
                    <th>Часы</th>
                    <th>Комментарий</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="record in records" :key="record.id">
                    <td>{{ record.date }}</td>
                    <td>{{ record.status }}</td>
                    <td>{{ record.hours }}</td>
                    <td>{{ record.comment }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { Bitrix24ApiService } from '../services/Bitrix24ApiService.js';

export default {
    name: 'TimesheetTable',
    data() {
        return {
            records: [],
            isLoading: false,
            error: null
        };
    },
    mounted() {
        this.loadRecords();
    },
    methods: {
        async loadRecords() {
            this.isLoading = true;
            this.error = null;
            
            try {
                // Загрузка данных через API
                // const data = await Bitrix24ApiService.getTimesheetRecords();
                // this.records = data;
            } catch (error) {
                this.error = error.message;
            } finally {
                this.isLoading = false;
            }
        }
    }
};
</script>

<style scoped>
.timesheet-table {
    padding: 20px;
}

.loading,
.error {
    padding: 20px;
    text-align: center;
}

.error {
    color: #dc3545;
}
</style>
```

---

## Интеграция с Bitrix24 UI

### Использование BX.* API

```javascript
// Показ уведомления
if (typeof BX !== 'undefined' && BX.UI && BX.UI.Notification) {
    BX.UI.Notification.Center.notify({
        content: 'Данные загружены',
        autoHideDelay: 5000
    });
}

// Показ попапа
if (typeof BX !== 'undefined' && BX.PopupWindow) {
    const popup = new BX.PopupWindow('timesheet-popup', null, {
        content: 'Содержимое попапа',
        width: 600,
        height: 400
    });
    popup.show();
}
```

---

## Сборка для production

### 1. Сборка через Vite

```bash
npm run build
```

### 2. Подключение собранных файлов

В `placement.php`:

```php
<link rel="stylesheet" href="/dist/assets/main.css">
<script src="/dist/assets/main.js"></script>
```

---

## Стандарты кода

### Компоненты
- Каждый компонент в отдельном файле
- Использование scoped styles
- Именование в PascalCase

### Сервисы
- Классы с статическими методами
- Обработка ошибок через try/catch
- Логирование через console.error

### Утилиты
- Чистые функции
- Без побочных эффектов
- Документирование через JSDoc

---

## Тестирование

### Unit-тесты (Vitest)

```bash
npm install -D vitest @vue/test-utils
```

### Пример теста

```javascript
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TimesheetTable from './TimesheetTable.vue';

describe('TimesheetTable', () => {
    it('renders correctly', () => {
        const wrapper = mount(TimesheetTable);
        expect(wrapper.exists()).toBe(true);
    });
});
```

---

## История изменений

- **2025-12-12 10:46 (UTC+3, Брест):** Создан документ с руководством по разработке на Vue.js


