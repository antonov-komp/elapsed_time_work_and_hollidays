# TASK-001-02: Настройка сборщика Vite

**Дата создания:** 2025-12-12 11:08 (UTC+3, Брест)  
**Статус:** Новая  
**Приоритет:** Критический  
**Исполнитель:** Bitrix24 Программист (Vue.js)  
**Родительская задача:** [TASK-001](TASK-001-preparation-infrastructure.md)  
**Подэтап:** 1.2 из 5  
**Длительность:** 1 день

---

## Описание

Настройка сборщика Vite для разработки и production-сборки Vue.js приложения. Создание конфигурационного файла, настройка dev-сервера и production-сборки.

**Связь с ТЗ:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md)  
**Связь с этапами:** [DOCS/TZ/implementation-stages.md](../TZ/implementation-stages.md) - Этап 1, Подэтап 1.2

---

## Контекст

Это второй подэтап подготовки инфраструктуры. Без настроенного сборщика невозможно разрабатывать и собирать Vue.js приложение. Этот подэтап зависит от TASK-001-01 (структура проекта).

---

## Модули и компоненты

### Конфигурационные файлы
- `vite.config.js` — конфигурация сборщика Vite (в корне проекта)
- `js/vue-apps/timesheet/main.js` — точка входа Vue.js приложения

### Обновляемые файлы
- `package.json` — добавление скриптов и dev-зависимостей

---

## Зависимости

- **От каких задач зависит:**
  - TASK-001-01: Настройка структуры проекта для Vue.js
- **Какие задачи зависят от этой:**
  - TASK-001-05: Настройка базовой структуры компонентов
  - TASK-004: Базовые компоненты Vue.js

---

## Ступенчатые подзадачи

### Шаг 1: Установка Vite и плагина Vue
1. Перейти в папку проекта:
   ```bash
   cd /var/www/back1/js/vue-apps/timesheet/
   ```
2. Установить Vite и плагин Vue как dev-зависимости:
   ```bash
   npm install -D vite @vitejs/plugin-vue
   ```
3. Проверить установку:
   ```bash
   npm list vite @vitejs/plugin-vue
   ```

### Шаг 2: Создание конфигурационного файла Vite
1. Вернуться в корень проекта:
   ```bash
   cd /var/www/back1
   ```
2. Создать файл `vite.config.js` в корне проекта
3. Настроить базовую конфигурацию (см. примеры кода)

### Шаг 3: Настройка конфигурации Vite
1. Подключить плагин Vue:
   ```javascript
   import vue from '@vitejs/plugin-vue';
   ```
2. Настроить точку входа: `js/vue-apps/timesheet/main.js`
3. Настроить выход: `dist/`
4. Настроить алиасы путей (опционально):
   ```javascript
   alias: {
     '@': resolve(__dirname, 'js/vue-apps/timesheet')
   }
   ```

### Шаг 4: Создание точки входа
1. Создать файл `js/vue-apps/timesheet/main.js`
2. Добавить базовый код (см. примеры кода)
3. Проверить создание файла

### Шаг 5: Настройка dev-сервера
1. В `vite.config.js` добавить настройки сервера:
   ```javascript
   server: {
     port: 5173,
     open: false,
     host: true
   }
   ```

### Шаг 6: Настройка production-сборки
1. В `vite.config.js` добавить настройки сборки:
   ```javascript
   build: {
     outDir: 'dist',
     assetsDir: 'assets',
     minify: 'terser',
     sourcemap: false
   }
   ```

### Шаг 7: Добавление скриптов в package.json
1. Открыть `js/vue-apps/timesheet/package.json`
2. Добавить скрипты:
   ```json
   "scripts": {
     "dev": "vite",
     "build": "vite build",
     "preview": "vite preview"
   }
   ```

### Шаг 8: Тестирование сборки
1. Запустить dev-сервер:
   ```bash
   cd /var/www/back1/js/vue-apps/timesheet/
   npm run dev
   ```
2. Проверить, что сервер запустился на порту 5173
3. Остановить сервер (Ctrl+C)
4. Протестировать production-сборку:
   ```bash
   npm run build
   ```
5. Проверить, что создалась папка `dist/` с собранными файлами

---

## Технические требования

### Vite
- **Версия:** Vite 5.x (последняя стабильная)
- **Плагин Vue:** @vitejs/plugin-vue 5.x

### Конфигурация
- Точка входа: `js/vue-apps/timesheet/main.js`
- Выходная папка: `dist/` (в корне проекта или в папке timesheet)
- Dev-сервер: порт 5173 (по умолчанию)

### Скрипты npm
- `npm run dev` — запуск dev-сервера
- `npm run build` — production-сборка
- `npm run preview` — предпросмотр production-сборки

---

## Критерии приёмки

- [ ] Vite и плагин Vue установлены как dev-зависимости
- [ ] Создан файл `vite.config.js` в корне проекта
- [ ] Конфигурация Vite содержит:
  - [ ] Подключение плагина Vue
  - [ ] Настройку точки входа
  - [ ] Настройку выходной папки
  - [ ] Настройки dev-сервера
  - [ ] Настройки production-сборки
- [ ] Создан файл `js/vue-apps/timesheet/main.js` с базовым кодом
- [ ] В `package.json` добавлены скрипты:
  - [ ] `dev`
  - [ ] `build`
  - [ ] `preview`
- [ ] Dev-сервер запускается без ошибок (`npm run dev`)
- [ ] Production-сборка работает (`npm run build`)
- [ ] Создаётся папка `dist/` с собранными файлами

---

## Примеры кода

### vite.config.js
```javascript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'js/vue-apps/timesheet')
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'js/vue-apps/timesheet/main.js')
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    },
    minify: 'terser',
    sourcemap: false
  },
  server: {
    port: 5173,
    open: false,
    host: true,
    cors: true
  }
});
```

### main.js (базовый)
```javascript
import { createApp } from 'vue';

// Временный компонент для тестирования
const App = {
  template: `
    <div>
      <h1>Табель присутствия</h1>
      <p>Vite + Vue.js работает!</p>
    </div>
  `
};

const app = createApp(App);
app.mount('#vue-timesheet-app');
```

### package.json (обновлённый)
```json
{
  "name": "timesheet-calendar",
  "version": "0.1.0",
  "description": "Интерфейс табеля присутствия для Bitrix24",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.4.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "vite": "^5.0.0"
  }
}
```

---

## Тестирование

### Проверка установки Vite
```bash
cd /var/www/back1/js/vue-apps/timesheet/
npm list vite @vitejs/plugin-vue
```

### Проверка конфигурации
```bash
# Проверка наличия файла
ls -la /var/www/back1/vite.config.js

# Проверка синтаксиса (если есть node)
node -c vite.config.js
```

### Тестирование dev-сервера
```bash
cd /var/www/back1/js/vue-apps/timesheet/
npm run dev
# Должен запуститься на http://localhost:5173
# Остановить: Ctrl+C
```

### Тестирование production-сборки
```bash
cd /var/www/back1/js/vue-apps/timesheet/
npm run build
# Должна создаться папка dist/
ls -la dist/
```

---

## История правок

- **2025-12-12 11:08 (UTC+3, Брест):** Создана задача TASK-001-02

---

## Примечания

### Важные замечания
- Файл `vite.config.js` должен быть в корне проекта, а не в папке `js/vue-apps/timesheet/`
- Папка `dist/` должна быть добавлена в `.gitignore`
- Dev-сервер должен работать на порту 5173 (можно изменить при конфликте)

### Следующие шаги
После завершения этого подэтапа можно переходить к:
- TASK-001-03: Создание структуры папок для данных
- TASK-001-04: Создание конфигурационного файла праздников
- TASK-001-05: Настройка базовой структуры компонентов

---

## Связь с документацией

- **Родительская задача:** [TASK-001](TASK-001-preparation-infrastructure.md)
- **Предыдущий подэтап:** [TASK-001-01](TASK-001-01-structure-vue.md)
- **Техническое задание:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md)
- **Руководство по Vue.js:** [DOCS/GUIDES/vue-development.md](../GUIDES/vue-development.md)

