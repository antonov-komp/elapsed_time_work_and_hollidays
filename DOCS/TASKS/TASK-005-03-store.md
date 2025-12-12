# TASK-005-03: Реализация состояния приложения (Store)

**Дата создания:** 2025-12-12 12:04 (UTC+3, Брест)  
**Статус:** Новая  
**Приоритет:** Критический  
**Исполнитель:** Bitrix24 Программист (Vue.js)  
**Родительская задача:** [TASK-005](TASK-005-functional-components.md)  
**Подэтап:** 5.3 из 6  
**Длительность:** 2 дня

---

## Описание

Создание Store (Pinia) для управления состоянием всего приложения табеля присутствия. Реализация состояния пользователя, табеля, праздников и UI, а также actions и getters для работы с данными.

**Связь с ТЗ:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - разделы 10.1, 10.2  
**Связь с этапами:** [DOCS/TZ/implementation-stages.md](../TZ/implementation-stages.md) - Этап 5, Подэтап 5.3

---

## Контекст

Это третий подэтап создания функциональных компонентов. Store необходим для централизованного управления состоянием приложения и связи между компонентами.

**Зависит от:**
- TASK-003-01: Создание сервиса для работы с Bitrix24 API
- TASK-003-02: Создание сервиса для работы с табелем
- TASK-003-03: Создание сервиса для работы с праздниками
- TASK-001-05: Настройка базовой структуры компонентов (файл уже создан)

---

## Модули и компоненты

### Frontend (Vue.js)
- `js/vue-apps/timesheet/stores/timesheetStore.js` — Store для управления состоянием

### Используемые сервисы
- `Bitrix24ApiService` — для загрузки данных пользователя
- `TimesheetApiService` — для загрузки и сохранения данных табеля
- `HolidaysService` — для загрузки праздников

---

## Зависимости

- **От каких задач зависит:**
  - TASK-003-01: Создание сервиса для работы с Bitrix24 API
  - TASK-003-02: Создание сервиса для работы с табелем
  - TASK-003-03: Создание сервиса для работы с праздниками
  - TASK-001-05: Настройка базовой структуры компонентов
- **Какие задачи зависят от этой:**
  - TASK-005-04: Реализация автосохранения — будет использовать Store
  - TASK-005-05: Реализация расчёта статистики — будет использовать Store
  - TASK-005-06: Интеграция всех компонентов — будет использовать Store

---

## Ступенчатые подзадачи

### Шаг 1: Установка Pinia
1. Установить Pinia: `npm install pinia`
2. Проверить установку

### Шаг 2: Открытие файла
1. Открыть файл `js/vue-apps/timesheet/stores/timesheetStore.js`
2. Проверить, что файл существует

### Шаг 3: Создание структуры Store
1. Импортировать `defineStore` из Pinia
2. Создать Store с помощью `defineStore`
3. Определить начальное состояние (state)

### Шаг 4: Реализация состояния пользователя
1. Создать состояние:
   - `id: null`
   - `name: null`
   - `position: null`
   - `loading: false`
   - `error: null`
2. Реализовать action `loadUser()` для загрузки данных пользователя

### Шаг 5: Реализация состояния табеля
1. Создать состояние:
   - `year: 2025`
   - `month: 12`
   - `days: {}`
   - `loading: false`
   - `error: null`
   - `saving: false`
2. Реализовать actions:
   - `loadTimesheet(year, month)` — загрузка данных табеля
   - `saveTimesheet(year, month, days)` — сохранение данных табеля
   - `updateDay(day, dayData)` — обновление одного дня

### Шаг 6: Реализация состояния праздников
1. Создать состояние:
   - `year: 2025`
   - `dates: []`
   - `loading: false`
   - `error: null`
2. Реализовать action `loadHolidays(year)` для загрузки праздников

### Шаг 7: Реализация состояния UI
1. Создать состояние:
   - `preloader: true`
   - `editModal: {open: false, day: null, year: null, month: null}`
2. Реализовать actions:
   - `openEditModal(day, year, month)` — открытие модального окна
   - `closeEditModal()` — закрытие модального окна
   - `setPreloader(visible)` — управление прелоадером

### Шаг 8: Реализация getters
1. Создать getters для получения данных:
   - `getUser` — данные пользователя
   - `getTimesheet` — данные табеля
   - `getHolidays` — праздники
   - `getEditModal` — состояние модального окна

---

## Технические требования

### Vue.js
- **Версия:** Vue.js 3.x (Composition API)
- **State Management:** Pinia (рекомендуется) или Vuex

### Pinia
- **Версия:** Pinia 2.x
- **Структура:** Один Store для всего приложения

### Структура Store
- State — реактивное состояние
- Getters — вычисляемые свойства
- Actions — методы для изменения состояния

---

## Критерии приёмки

- [ ] Установлен Pinia
- [ ] Создан Store `timesheetStore.js`
- [ ] Реализовано состояние пользователя:
  - [ ] Все поля определены
  - [ ] Action `loadUser()` реализован
- [ ] Реализовано состояние табеля:
  - [ ] Все поля определены
  - [ ] Actions реализованы (loadTimesheet, saveTimesheet, updateDay)
- [ ] Реализовано состояние праздников:
  - [ ] Все поля определены
  - [ ] Action `loadHolidays()` реализован
- [ ] Реализовано состояние UI:
  - [ ] Все поля определены
  - [ ] Actions реализованы (openEditModal, closeEditModal, setPreloader)
- [ ] Реализованы все getters
- [ ] Store работает корректно

---

## Примеры кода

### timesheetStore.js
```javascript
import { defineStore } from 'pinia';
import { Bitrix24ApiService } from '../services/Bitrix24ApiService.js';
import { TimesheetApiService } from '../services/TimesheetApiService.js';
import { HolidaysService } from '../services/HolidaysService.js';
import { getCurrentYear, getCurrentMonth } from '../utils/dateHelpers.js';

/**
 * Store для управления состоянием табеля присутствия
 */
export const useTimesheetStore = defineStore('timesheet', {
  state: () => ({
    // Состояние пользователя
    user: {
      id: null,
      name: null,
      position: null,
      loading: false,
      error: null
    },
    
    // Состояние табеля
    timesheet: {
      year: getCurrentYear(),
      month: getCurrentMonth(),
      days: {},
      loading: false,
      error: null,
      saving: false
    },
    
    // Состояние праздников
    holidays: {
      year: getCurrentYear(),
      dates: [],
      loading: false,
      error: null
    },
    
    // Состояние UI
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
    /**
     * Получение данных пользователя
     */
    getUser: (state) => state.user,
    
    /**
     * Получение данных табеля
     */
    getTimesheet: (state) => state.timesheet,
    
    /**
     * Получение праздников
     */
    getHolidays: (state) => state.holidays.dates,
    
    /**
     * Получение состояния модального окна
     */
    getEditModal: (state) => state.ui.editModal,
    
    /**
     * Проверка, открыто ли модальное окно
     */
    isEditModalOpen: (state) => state.ui.editModal.open
  },
  
  actions: {
    /**
     * Загрузка данных пользователя
     */
    async loadUser() {
      this.user.loading = true;
      this.user.error = null;
      
      try {
        const user = await Bitrix24ApiService.getCurrentUser();
        
        this.user.id = user.ID;
        
        const nameParts = [
          user.LAST_NAME,
          user.NAME,
          user.SECOND_NAME
        ].filter(Boolean);
        
        this.user.name = nameParts.length > 0 
          ? nameParts.join(' ') 
          : `Пользователь #${user.ID}`;
        
        this.user.position = user.WORK_POSITION || '';
      } catch (error) {
        console.error('Store loadUser error:', error);
        this.user.error = error.message;
      } finally {
        this.user.loading = false;
      }
    },
    
    /**
     * Загрузка данных табеля
     */
    async loadTimesheet(year, month) {
      this.timesheet.loading = true;
      this.timesheet.error = null;
      
      try {
        const data = await TimesheetApiService.getTimesheet(year, month);
        
        this.timesheet.year = year;
        this.timesheet.month = month;
        this.timesheet.days = data?.days || {};
      } catch (error) {
        console.error('Store loadTimesheet error:', error);
        this.timesheet.error = error.message;
      } finally {
        this.timesheet.loading = false;
      }
    },
    
    /**
     * Сохранение данных табеля
     */
    async saveTimesheet(year, month, days) {
      this.timesheet.saving = true;
      this.timesheet.error = null;
      
      try {
        await TimesheetApiService.saveTimesheet(year, month, days);
        
        // Обновление локального состояния
        this.timesheet.days = {
          ...this.timesheet.days,
          ...days
        };
      } catch (error) {
        console.error('Store saveTimesheet error:', error);
        this.timesheet.error = error.message;
        throw error;
      } finally {
        this.timesheet.saving = false;
      }
    },
    
    /**
     * Обновление одного дня
     */
    updateDay(day, dayData) {
      this.timesheet.days = {
        ...this.timesheet.days,
        [day]: dayData
      };
    },
    
    /**
     * Загрузка праздников
     */
    async loadHolidays(year) {
      this.holidays.loading = true;
      this.holidays.error = null;
      
      try {
        const dates = await HolidaysService.getHolidays(year);
        
        this.holidays.year = year;
        this.holidays.dates = dates;
      } catch (error) {
        console.error('Store loadHolidays error:', error);
        this.holidays.error = error.message;
      } finally {
        this.holidays.loading = false;
      }
    },
    
    /**
     * Открытие модального окна редактирования
     */
    openEditModal(day, year, month) {
      this.ui.editModal = {
        open: true,
        day,
        year,
        month
      };
    },
    
    /**
     * Закрытие модального окна редактирования
     */
    closeEditModal() {
      this.ui.editModal = {
        open: false,
        day: null,
        year: null,
        month: null
      };
    },
    
    /**
     * Управление прелоадером
     */
    setPreloader(visible) {
      this.ui.preloader = visible;
    }
  }
});
```

### Использование в main.js
```javascript
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import TimesheetCalendar from './TimesheetCalendar.vue';

const app = createApp(TimesheetCalendar);
const pinia = createPinia();
app.use(pinia);
app.mount('#vue-timesheet-app');
```

### Использование в компоненте
```vue
<script setup>
import { onMounted } from 'vue';
import { useTimesheetStore } from './stores/timesheetStore.js';

const store = useTimesheetStore();

onMounted(async () => {
  await store.loadUser();
  await store.loadTimesheet(2025, 12);
  await store.loadHolidays(2025);
  store.setPreloader(false);
});
</script>
```

---

## Тестирование

### Тестирование Store
1. Импортировать Store в тестовый файл
2. Проверить загрузку данных пользователя
3. Проверить загрузку данных табеля
4. Проверить сохранение данных табеля
5. Проверить обновление дня
6. Проверить загрузку праздников
7. Проверить управление UI состоянием

---

## История правок

- **2025-12-12 12:04 (UTC+3, Брест):** Создана задача TASK-005-03

---

## Примечания

### Важные замечания
- Store должен быть единственным источником данных
- Все изменения состояния должны проходить через actions
- Getters должны быть чистыми функциями

### Следующие шаги
После завершения этого подэтапа можно переходить к:
- TASK-005-04: Реализация автосохранения — будет использовать Store
- TASK-005-05: Реализация расчёта статистики — будет использовать Store
- TASK-005-06: Интеграция всех компонентов — будет использовать Store

---

## Связь с документацией

- **Родительская задача:** [TASK-005](TASK-005-functional-components.md)
- **Техническое задание:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - разделы 10.1, 10.2

