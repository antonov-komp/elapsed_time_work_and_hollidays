# TASK-005-06: Интеграция всех компонентов

**Дата создания:** 2025-12-12 12:04 (UTC+3, Брест)  
**Статус:** Новая  
**Приоритет:** Критический  
**Исполнитель:** Bitrix24 Программист (Vue.js)  
**Родительская задача:** [TASK-005](TASK-005-functional-components.md)  
**Подэтап:** 5.6 из 6  
**Длительность:** 1.5 дня

---

## Описание

Интеграция всех компонентов в корневой компонент `TimesheetCalendar.vue`. Связывание компонентов через Store, реализация обработки событий между компонентами и обновление данных при изменениях.

**Связь с ТЗ:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - разделы 1, 2, 3  
**Связь с этапами:** [DOCS/TZ/implementation-stages.md](../TZ/implementation-stages.md) - Этап 5, Подэтап 5.6

---

## Контекст

Это шестой (последний) подэтап создания функциональных компонентов. Интеграция всех компонентов необходима для создания полностью функционального интерфейса табеля присутствия.

**Зависит от:**
- Все предыдущие подэтапы TASK-005
- Все компоненты из TASK-004
- Store из TASK-005-03

---

## Модули и компоненты

### Frontend (Vue.js)
- `js/vue-apps/timesheet/TimesheetCalendar.vue` — корневой компонент (обновление)

### Используемые компоненты
- `UserInfo.vue`
- `PeriodSelector.vue`
- `StatisticsBar.vue`
- `CalendarGrid.vue`
- `EditDayModal.vue`
- `FillWeekButton.vue`
- `Preloader.vue`

### Используемый Store
- `useTimesheetStore` — для управления состоянием

---

## Зависимости

- **От каких задач зависит:**
  - TASK-005-01: Компонент модального окна редактирования дня
  - TASK-005-02: Компонент кнопки "Заполнить неделю"
  - TASK-005-03: Реализация состояния приложения (Store)
  - TASK-005-04: Реализация автосохранения
  - TASK-005-05: Реализация расчёта статистики
  - Все компоненты из TASK-004
- **Какие задачи зависят от этой:**
  - TASK-006: Стилизация и адаптивность — будет стилизовать интегрированный интерфейс

---

## Ступенчатые подзадачи

### Шаг 1: Обновление корневого компонента
1. Открыть файл `js/vue-apps/timesheet/TimesheetCalendar.vue`
2. Импортировать все компоненты
3. Импортировать Store
4. Создать структуру компонента

### Шаг 2: Интеграция компонентов
1. Добавить компонент `UserInfo`
2. Добавить компонент `PeriodSelector`
3. Добавить компонент `StatisticsBar`
4. Добавить компонент `CalendarGrid`
5. Добавить компонент `EditDayModal`
6. Добавить компонент `FillWeekButton`
7. Добавить компонент `Preloader`

### Шаг 3: Связывание компонентов через Store
1. Использовать Store для получения данных
2. Использовать Store для обновления данных
3. Подключить все компоненты к Store

### Шаг 4: Реализация обработки событий
1. Обработать событие `change` от `PeriodSelector`
2. Обработать событие `cell-click` от `CalendarGrid`
3. Обработать событие `save` от `EditDayModal`
4. Обработать событие `fill-week` от `FillWeekButton`

### Шаг 5: Реализация обновления данных
1. Обновлять данные табеля при изменении периода
2. Обновлять данные табеля при сохранении дня
3. Обновлять данные табеля при заполнении недели
4. Обновлять статистику при изменении данных

### Шаг 6: Инициализация приложения
1. Загрузить данные пользователя при монтировании
2. Загрузить данные табеля при монтировании
3. Загрузить праздники при монтировании
4. Управлять прелоадером

### Шаг 7: Тестирование интеграции
1. Протестировать все сценарии использования
2. Проверить работу всех компонентов
3. Проверить обработку событий
4. Проверить обновление данных

---

## Технические требования

### Vue.js
- **Версия:** Vue.js 3.x (Composition API)
- **Подход:** `<script setup>` синтаксис
- **Store:** Pinia для управления состоянием

### Интеграция
- Все компоненты должны быть связаны через Store
- События должны обрабатываться корректно
- Данные должны обновляться реактивно

---

## Критерии приёмки

- [ ] Обновлён корневой компонент `TimesheetCalendar.vue`
- [ ] Все компоненты интегрированы:
  - [ ] UserInfo
  - [ ] PeriodSelector
  - [ ] StatisticsBar
  - [ ] CalendarGrid
  - [ ] EditDayModal
  - [ ] FillWeekButton
  - [ ] Preloader
- [ ] Компоненты связаны через Store
- [ ] Обработка событий работает корректно:
  - [ ] Изменение периода
  - [ ] Клик на ячейку
  - [ ] Сохранение дня
  - [ ] Заполнение недели
- [ ] Обновление данных при изменениях работает
- [ ] Инициализация приложения работает
- [ ] Все компоненты работают вместе корректно

---

## Примеры кода

### TimesheetCalendar.vue (полная интеграция)
```vue
<template>
  <div class="timesheet-calendar">
    <Preloader :visible="store.ui.preloader" />
    
    <UserInfo />
    
    <div class="calendar-controls">
      <PeriodSelector
        :year="store.timesheet.year"
        :month="store.timesheet.month"
        @change="handlePeriodChange"
      />
      <FillWeekButton
        :year="store.timesheet.year"
        :month="store.timesheet.month"
        :holidays="store.getHolidays"
        :current-days="store.timesheet.days"
        @fill-week="handleFillWeek"
      />
    </div>
    
    <StatisticsBar />
    
    <CalendarGrid
      :year="store.timesheet.year"
      :month="store.timesheet.month"
      @cell-click="handleCellClick"
    />
    
    <EditDayModal
      :visible="store.isEditModalOpen"
      :day="store.getEditModal.day"
      :day-data="selectedDayData"
      @save="handleSaveDay"
      @close="handleCloseModal"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
import { useTimesheetStore } from './stores/timesheetStore.js';

// Компоненты
import Preloader from './components/Preloader.vue';
import UserInfo from './components/UserInfo.vue';
import PeriodSelector from './components/PeriodSelector.vue';
import StatisticsBar from './components/StatisticsBar.vue';
import CalendarGrid from './components/CalendarGrid.vue';
import EditDayModal from './components/EditDayModal.vue';
import FillWeekButton from './components/FillWeekButton.vue';

const store = useTimesheetStore();

/**
 * Данные выбранного дня для модального окна
 */
const selectedDayData = computed(() => {
  const modal = store.getEditModal;
  if (modal.open && modal.day) {
    return store.timesheet.days[modal.day] || null;
  }
  return null;
});

/**
 * Обработка изменения периода
 */
function handlePeriodChange(year, month) {
  store.loadTimesheet(year, month);
  store.loadHolidays(year);
}

/**
 * Обработка клика на ячейку
 */
function handleCellClick(day, date, dayData) {
  store.openEditModal(day, store.timesheet.year, store.timesheet.month);
}

/**
 * Обработка сохранения дня
 */
function handleSaveDay(dayData) {
  const modal = store.getEditModal;
  store.updateDay(modal.day, dayData);
  store.closeEditModal();
}

/**
 * Обработка закрытия модального окна
 */
function handleCloseModal() {
  store.closeEditModal();
}

/**
 * Обработка заполнения недели
 */
function handleFillWeek(days) {
  // Обновление дней через Store (автосохранение сработает автоматически)
  for (const day in days) {
    store.updateDay(parseInt(day), days[day]);
  }
}

// Инициализация приложения
onMounted(async () => {
  store.setPreloader(true);
  
  try {
    await Promise.all([
      store.loadUser(),
      store.loadTimesheet(store.timesheet.year, store.timesheet.month),
      store.loadHolidays(store.timesheet.year)
    ]);
  } finally {
    store.setPreloader(false);
  }
});

// Отслеживание изменений периода для загрузки данных
watch(
  [() => store.timesheet.year, () => store.timesheet.month],
  ([year, month]) => {
    store.loadTimesheet(year, month);
    store.loadHolidays(year);
  }
);
</script>

<style scoped>
.timesheet-calendar {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.calendar-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
  gap: 20px;
}
</style>
```

---

## Тестирование

### Тестирование интеграции
1. Запустить приложение
2. Проверить загрузку всех данных
3. Проверить работу всех компонентов
4. Проверить изменение периода
5. Проверить редактирование дня
6. Проверить заполнение недели
7. Проверить обновление статистики
8. Проверить автосохранение

---

## История правок

- **2025-12-12 12:04 (UTC+3, Брест):** Создана задача TASK-005-06

---

## Примечания

### Важные замечания
- Все компоненты должны быть связаны через Store
- События должны обрабатываться корректно
- Данные должны обновляться реактивно
- Инициализация должна загружать все необходимые данные

### Следующие шаги
После завершения этого подэтапа можно переходить к:
- TASK-006: Стилизация и адаптивность — будет стилизовать интегрированный интерфейс

---

## Связь с документацией

- **Родительская задача:** [TASK-005](TASK-005-functional-components.md)
- **Техническое задание:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - разделы 1, 2, 3

