# TASK-001-05: Настройка базовой структуры компонентов

**Дата создания:** 2025-12-12 11:08 (UTC+3, Брест)  
**Статус:** Новая  
**Приоритет:** Критический  
**Исполнитель:** Bitrix24 Программист (Vue.js)  
**Родительская задача:** [TASK-001](TASK-001-preparation-infrastructure.md)  
**Подэтап:** 1.5 из 5  
**Длительность:** 0.5 дня

---

## Описание

Создание базовой структуры всех компонентов, сервисов, утилит и Store для Vue.js приложения табеля присутствия. Все файлы создаются с пустой структурой, логика будет добавлена в следующих этапах.

**Связь с ТЗ:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - раздел 10.1  
**Связь с этапами:** [DOCS/TZ/implementation-stages.md](../TZ/implementation-stages.md) - Этап 1, Подэтап 1.5

---

## Контекст

Это пятый (последний) подэтап подготовки инфраструктуры. Создание структуры всех файлов необходимо для дальнейшей разработки. Все файлы создаются с базовой структурой, логика будет реализована в следующих этапах.

**Зависит от:**
- TASK-001-01: Настройка структуры проекта для Vue.js
- TASK-001-02: Настройка сборщика Vite

---

## Модули и компоненты

### Компоненты Vue.js
- `js/vue-apps/timesheet/components/UserInfo.vue`
- `js/vue-apps/timesheet/components/PeriodSelector.vue`
- `js/vue-apps/timesheet/components/StatisticsBar.vue`
- `js/vue-apps/timesheet/components/CalendarGrid.vue`
- `js/vue-apps/timesheet/components/CalendarCell.vue`
- `js/vue-apps/timesheet/components/EditDayModal.vue`
- `js/vue-apps/timesheet/components/FillWeekButton.vue`
- `js/vue-apps/timesheet/components/Preloader.vue`

### Сервисы
- `js/vue-apps/timesheet/services/Bitrix24ApiService.js`
- `js/vue-apps/timesheet/services/TimesheetApiService.js`
- `js/vue-apps/timesheet/services/HolidaysService.js`

### Утилиты
- `js/vue-apps/timesheet/utils/dateHelpers.js`
- `js/vue-apps/timesheet/utils/validation.js`
- `js/vue-apps/timesheet/utils/constants.js`

### Store
- `js/vue-apps/timesheet/stores/timesheetStore.js`

### Корневой компонент
- `js/vue-apps/timesheet/TimesheetCalendar.vue`

### Обновляемые файлы
- `js/vue-apps/timesheet/main.js` — подключение корневого компонента

---

## Зависимости

- **От каких задач зависит:**
  - TASK-001-01: Настройка структуры проекта для Vue.js
  - TASK-001-02: Настройка сборщика Vite
- **Какие задачи зависят от этой:**
  - TASK-004: Базовые компоненты Vue.js — будет заполнять эти файлы логикой

---

## Ступенчатые подзадачи

### Шаг 1: Создание компонентов Vue.js
1. Создать все компоненты в `js/vue-apps/timesheet/components/`:
   - `UserInfo.vue`
   - `PeriodSelector.vue`
   - `StatisticsBar.vue`
   - `CalendarGrid.vue`
   - `CalendarCell.vue`
   - `EditDayModal.vue`
   - `FillWeekButton.vue`
   - `Preloader.vue`
2. Для каждого компонента создать базовую структуру:
   - `<template>` с комментарием
   - `<script setup>` (Composition API)
   - `<style scoped>` (пустые стили)

### Шаг 2: Создание сервисов
1. Создать все сервисы в `js/vue-apps/timesheet/services/`:
   - `Bitrix24ApiService.js`
   - `TimesheetApiService.js`
   - `HolidaysService.js`
2. Для каждого сервиса создать базовую структуру класса или модуля

### Шаг 3: Создание утилит
1. Создать все утилиты в `js/vue-apps/timesheet/utils/`:
   - `dateHelpers.js`
   - `validation.js`
   - `constants.js`
2. Для каждого файла создать базовую структуру с экспортами

### Шаг 4: Создание Store
1. Создать файл `js/vue-apps/timesheet/stores/timesheetStore.js`
2. Создать базовую структуру Store (Vuex или Pinia)

### Шаг 5: Создание корневого компонента
1. Создать файл `js/vue-apps/timesheet/TimesheetCalendar.vue`
2. Создать базовую структуру компонента

### Шаг 6: Обновление main.js
1. Открыть файл `js/vue-apps/timesheet/main.js`
2. Импортировать корневой компонент `TimesheetCalendar.vue`
3. Подключить компонент к приложению Vue

### Шаг 7: Проверка структуры
1. Проверить, что все файлы созданы
2. Проверить структуру каждого файла
3. Проверить, что нет синтаксических ошибок

---

## Технические требования

### Vue.js компоненты
- **Формат:** Single File Components (.vue)
- **API:** Composition API с `<script setup>`
- **Стили:** Scoped styles

### JavaScript модули
- **Формат:** ES Modules (import/export)
- **Тип:** указан в `package.json` как `"type": "module"`

### Структура компонента
- `<template>` — разметка
- `<script setup>` — логика (Composition API)
- `<style scoped>` — стили (scoped)

---

## Критерии приёмки

### Компоненты
- [ ] Созданы все 8 компонентов в `components/`
- [ ] Каждый компонент имеет структуру:
  - [ ] `<template>` с комментарием
  - [ ] `<script setup>`
  - [ ] `<style scoped>`
- [ ] Компоненты не содержат синтаксических ошибок

### Сервисы
- [ ] Созданы все 3 сервиса в `services/`
- [ ] Каждый сервис имеет базовую структуру класса/модуля
- [ ] Сервисы экспортируют классы или функции

### Утилиты
- [ ] Созданы все 3 утилиты в `utils/`
- [ ] Каждая утилита имеет базовую структуру
- [ ] Утилиты экспортируют функции или константы

### Store
- [ ] Создан файл `timesheetStore.js` в `stores/`
- [ ] Store имеет базовую структуру (Vuex или Pinia)

### Корневой компонент
- [ ] Создан файл `TimesheetCalendar.vue`
- [ ] Компонент имеет базовую структуру
- [ ] Компонент подключён в `main.js`

### Общие
- [ ] Все файлы созданы и структура корректна
- [ ] Нет синтаксических ошибок
- [ ] Проект компилируется без ошибок (`npm run build`)

---

## Примеры кода

### UserInfo.vue (базовый)
```vue
<template>
  <div class="user-info">
    <!-- Блок авторизации: ФИО и Должность -->
    <p>UserInfo component</p>
  </div>
</template>

<script setup>
// Логика будет добавлена в TASK-004
</script>

<style scoped>
.user-info {
  /* Стили будут добавлены в TASK-006 */
}
</style>
```

### PeriodSelector.vue (базовый)
```vue
<template>
  <div class="period-selector">
    <!-- Блок выбора месяца и года -->
    <p>PeriodSelector component</p>
  </div>
</template>

<script setup>
// Логика будет добавлена в TASK-004
</script>

<style scoped>
.period-selector {
  /* Стили будут добавлены в TASK-006 */
}
</style>
```

### Bitrix24ApiService.js (базовый)
```javascript
/**
 * Сервис для работы с Bitrix24 REST API
 * 
 * Логика будет добавлена в TASK-003
 */
export class Bitrix24ApiService {
  // Методы будут добавлены в TASK-003
}
```

### dateHelpers.js (базовый)
```javascript
/**
 * Утилиты для работы с датами
 * 
 * Функции будут добавлены в TASK-003
 */

export function getCurrentDate() {
  // Реализация будет добавлена в TASK-003
}

export function isWeekend(date) {
  // Реализация будет добавлена в TASK-003
}

export function isHoliday(date) {
  // Реализация будет добавлена в TASK-003
}
```

### constants.js (базовый)
```javascript
/**
 * Константы приложения
 */

// Статусы
export const STATUSES = {
  SICK: 'Больничный',
  BUSINESS_TRIP: 'Командировка',
  VACATION: 'Отпуск календарный',
  UNPAID_VACATION: 'Отпуск за свой счёт'
};

// Цвета для разных типов дней
export const COLORS = {
  WORKDAY: '#ffffff',
  WEEKEND: '#f0f0f0',
  HOLIDAY: '#ffebee',
  TODAY: '#e3f2fd',
  FILLED: '#e8f5e9',
  INCOMPLETE: '#fff9c4'
};

// Конфигурация
export const CONFIG = {
  MIN_YEAR: 2025,
  MAX_YEAR: 2035,
  HOUR_STEP: 0.5,
  MIN_HOURS: 0,
  MAX_HOURS: 24,
  STANDARD_HOURS: 8
};
```

### timesheetStore.js (базовый, Pinia)
```javascript
import { defineStore } from 'pinia';

/**
 * Store для состояния табеля присутствия
 * 
 * Логика будет добавлена в TASK-004
 */
export const useTimesheetStore = defineStore('timesheet', {
  state: () => ({
    user: {
      id: null,
      name: null,
      position: null,
      loading: false,
      error: null
    },
    timesheet: {
      year: 2025,
      month: 12,
      days: {},
      loading: false,
      error: null,
      saving: false
    },
    holidays: {
      year: 2025,
      dates: [],
      loading: false,
      error: null
    },
    ui: {
      preloader: true,
      editModal: {
        open: false,
        day: null,
        year: null,
        month: null
      }
    }
  }),
  getters: {
    // Геттеры будут добавлены в TASK-004
  },
  actions: {
    // Действия будут добавлены в TASK-004
  }
});
```

### TimesheetCalendar.vue (базовый)
```vue
<template>
  <div class="timesheet-calendar">
    <h1>Табель присутствия</h1>
    <!-- Компоненты будут добавлены в TASK-004 -->
  </div>
</template>

<script setup>
// Импорты будут добавлены в TASK-004
</script>

<style scoped>
.timesheet-calendar {
  padding: 20px;
}
</style>
```

### main.js (обновлённый)
```javascript
import { createApp } from 'vue';
import TimesheetCalendar from './TimesheetCalendar.vue';

const app = createApp(TimesheetCalendar);
app.mount('#vue-timesheet-app');
```

---

## Тестирование

### Проверка создания файлов
```bash
# Проверка компонентов
ls -la js/vue-apps/timesheet/components/

# Проверка сервисов
ls -la js/vue-apps/timesheet/services/

# Проверка утилит
ls -la js/vue-apps/timesheet/utils/

# Проверка Store
ls -la js/vue-apps/timesheet/stores/
```

### Проверка синтаксиса
```bash
# Проверка компиляции
cd js/vue-apps/timesheet/
npm run build

# Должно скомпилироваться без ошибок
```

### Проверка структуры файлов
```bash
# Проверка структуры компонента (пример)
head -20 js/vue-apps/timesheet/components/UserInfo.vue
```

---

## История правок

- **2025-12-12 11:08 (UTC+3, Брест):** Создана задача TASK-001-05

---

## Примечания

### Важные замечания
- Все файлы создаются с пустой структурой — логика будет добавлена в следующих этапах
- Компоненты используют Composition API с `<script setup>`
- Стили используют `scoped` для изоляции
- Store можно использовать Vuex или Pinia (рекомендуется Pinia)

### Порядок создания
Можно создавать файлы в любом порядке, но рекомендуется:
1. Сначала создать все компоненты
2. Затем сервисы
3. Затем утилиты
4. Затем Store
5. В конце корневой компонент и обновление main.js

### Следующие шаги
После завершения этого подэтапа можно переходить к:
- TASK-002: Backend API (PHP endpoints)
- TASK-003: Сервисы и утилиты (JavaScript) — заполнение логики сервисов и утилит
- TASK-004: Базовые компоненты Vue.js — заполнение логики компонентов

---

## Связь с документацией

- **Родительская задача:** [TASK-001](TASK-001-preparation-infrastructure.md)
- **Техническое задание:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - раздел 10.1
- **Этапы реализации:** [DOCS/TZ/implementation-stages.md](../TZ/implementation-stages.md)
- **Архитектура:** [DOCS/ARCHITECTURE/tech-stack.md](../ARCHITECTURE/tech-stack.md)

