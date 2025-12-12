# TASK-001-01: Настройка структуры проекта для Vue.js

**Дата создания:** 2025-12-12 11:08 (UTC+3, Брест)  
**Статус:** Новая  
**Приоритет:** Критический  
**Исполнитель:** Bitrix24 Программист (Vue.js)  
**Родительская задача:** [TASK-001](TASK-001-preparation-infrastructure.md)  
**Подэтап:** 1.1 из 5  
**Длительность:** 1 день

---

## Описание

Создание базовой структуры проекта для разработки Vue.js приложения табеля присутствия. Настройка папок, инициализация npm проекта и установка Vue.js 3.x.

**Связь с ТЗ:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md)  
**Связь с этапами:** [DOCS/TZ/implementation-stages.md](../TZ/implementation-stages.md) - Этап 1, Подэтап 1.1

---

## Контекст

Это первый подэтап подготовки инфраструктуры. Без создания структуры проекта невозможно начать разработку компонентов Vue.js. Все последующие подэтапы зависят от выполнения этого подэтапа.

---

## Модули и компоненты

### Структура папок
- `js/vue-apps/timesheet/` — основная папка Vue.js приложения
- `js/vue-apps/timesheet/components/` — папка для компонентов Vue.js
- `js/vue-apps/timesheet/services/` — папка для сервисов API
- `js/vue-apps/timesheet/stores/` — папка для состояния приложения
- `js/vue-apps/timesheet/utils/` — папка для утилит

### Конфигурационные файлы
- `package.json` — файл зависимостей npm

---

## Зависимости

- **От каких задач зависит:** Нет (это первый подэтап)
- **Какие задачи зависят от этой:**
  - TASK-001-02: Настройка сборщика Vite
  - TASK-001-05: Настройка базовой структуры компонентов

---

## Ступенчатые подзадачи

### Шаг 1: Создание основной папки
1. Перейти в корень проекта: `cd /var/www/back1`
2. Создать папку `js/vue-apps/timesheet/`:
   ```bash
   mkdir -p js/vue-apps/timesheet
   ```
3. Проверить создание папки:
   ```bash
   ls -la js/vue-apps/timesheet/
   ```

### Шаг 2: Создание подпапок
1. Создать папку для компонентов:
   ```bash
   mkdir -p js/vue-apps/timesheet/components
   ```
2. Создать папку для сервисов:
   ```bash
   mkdir -p js/vue-apps/timesheet/services
   ```
3. Создать папку для состояния приложения:
   ```bash
   mkdir -p js/vue-apps/timesheet/stores
   ```
4. Создать папку для утилит:
   ```bash
   mkdir -p js/vue-apps/timesheet/utils
   ```
5. Проверить структуру:
   ```bash
   tree js/vue-apps/timesheet/ -d
   # или
   find js/vue-apps/timesheet/ -type d
   ```

### Шаг 3: Инициализация npm проекта
1. Перейти в папку проекта:
   ```bash
   cd js/vue-apps/timesheet/
   ```
2. Инициализировать npm проект:
   ```bash
   npm init -y
   ```
3. Проверить создание `package.json`:
   ```bash
   cat package.json
   ```

### Шаг 4: Редактирование package.json
1. Открыть файл `package.json`
2. Обновить поля:
   - `name`: "timesheet-calendar"
   - `version`: "0.1.0"
   - `description`: "Интерфейс табеля присутствия для Bitrix24"
   - `type`: "module" (для ES modules)
3. Сохранить файл

### Шаг 5: Установка Vue.js
1. Установить Vue.js 3.x:
   ```bash
   npm install vue@3
   ```
2. Проверить установку:
   ```bash
   npm list vue
   ```
3. Проверить версию:
   ```bash
   npm list vue --depth=0
   ```

### Шаг 6: Проверка структуры
1. Вернуться в корень проекта:
   ```bash
   cd /var/www/back1
   ```
2. Проверить полную структуру:
   ```bash
   tree js/vue-apps/timesheet/ -L 2
   # или
   find js/vue-apps/timesheet/ -type f -o -type d | sort
   ```
3. Проверить наличие `package.json` и `node_modules/`:
   ```bash
   ls -la js/vue-apps/timesheet/
   ```

---

## Технические требования

### Node.js и npm
- **Версия Node.js:** 18.x или выше
- **Версия npm:** 9.x или выше
- Проверка версий:
  ```bash
  node --version
  npm --version
  ```

### Vue.js
- **Версия:** Vue.js 3.x (последняя стабильная, например 3.4.0)
- **Тип установки:** Production dependency (не dev dependency)

### Структура папок
- Все папки должны быть созданы с правами доступа по умолчанию
- Структура должна соответствовать архитектуре из ТЗ

---

## Критерии приёмки

- [ ] Создана папка `js/vue-apps/timesheet/`
- [ ] Созданы все подпапки:
  - [ ] `components/`
  - [ ] `services/`
  - [ ] `stores/`
  - [ ] `utils/`
- [ ] Инициализирован npm проект (`package.json` создан)
- [ ] `package.json` содержит корректные поля:
  - [ ] `name`: "timesheet-calendar"
  - [ ] `version`: "0.1.0"
  - [ ] `description`: "Интерфейс табеля присутствия для Bitrix24"
  - [ ] `type`: "module"
- [ ] Vue.js 3.x установлен (проверка через `npm list vue`)
- [ ] Папка `node_modules/` создана и содержит Vue.js
- [ ] Структура папок соответствует требованиям

---

## Примеры кода

### package.json (после редактирования)
```json
{
  "name": "timesheet-calendar",
  "version": "0.1.0",
  "description": "Интерфейс табеля присутствия для Bitrix24",
  "type": "module",
  "main": "main.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "bitrix24",
    "timesheet",
    "vue",
    "calendar"
  ],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "vue": "^3.4.0"
  }
}
```

### Структура папок (результат)
```
js/vue-apps/timesheet/
├── components/
├── services/
├── stores/
├── utils/
├── node_modules/
│   └── vue/
├── package.json
└── package-lock.json
```

---

## Тестирование

### Проверка структуры папок
```bash
# Проверка основной папки
ls -la js/vue-apps/timesheet/

# Проверка подпапок
ls -la js/vue-apps/timesheet/components/
ls -la js/vue-apps/timesheet/services/
ls -la js/vue-apps/timesheet/stores/
ls -la js/vue-apps/timesheet/utils/
```

### Проверка npm проекта
```bash
# Проверка package.json
cat js/vue-apps/timesheet/package.json

# Проверка установленных зависимостей
cd js/vue-apps/timesheet/
npm list --depth=0
```

### Проверка Vue.js
```bash
# Проверка версии Vue.js
cd js/vue-apps/timesheet/
npm list vue

# Проверка наличия Vue.js в node_modules
ls -la node_modules/vue/
```

---

## История правок

- **2025-12-12 11:08 (UTC+3, Брест):** Создана задача TASK-001-01

---

## Примечания

### Важные замечания
- Папка `node_modules/` должна быть добавлена в `.gitignore`
- Файл `package-lock.json` должен быть закоммичен в репозиторий
- Структура папок должна точно соответствовать архитектуре из ТЗ

### Следующие шаги
После завершения этого подэтапа можно переходить к:
- TASK-001-02: Настройка сборщика Vite

---

## Связь с документацией

- **Родительская задача:** [TASK-001](TASK-001-preparation-infrastructure.md)
- **Техническое задание:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md)
- **Этапы реализации:** [DOCS/TZ/implementation-stages.md](../TZ/implementation-stages.md)
- **Архитектура:** [DOCS/ARCHITECTURE/tech-stack.md](../ARCHITECTURE/tech-stack.md)

