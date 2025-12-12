# TASK-005-05: Реализация расчёта статистики

**Дата создания:** 2025-12-12 12:04 (UTC+3, Брест)  
**Статус:** Новая  
**Приоритет:** Высокий  
**Исполнитель:** Bitrix24 Программист (Vue.js)  
**Родительская задача:** [TASK-005](TASK-005-functional-components.md)  
**Подэтап:** 5.5 из 6  
**Длительность:** 1 день

---

## Описание

Реализация расчёта статистики табеля присутствия в Store (getters). Расчёт суммы часов, количества рабочих дней, неполных дней и дней со статусами с реактивным обновлением.

**Связь с ТЗ:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - раздел 1.4  
**Связь с этапами:** [DOCS/TZ/implementation-stages.md](../TZ/implementation-stages.md) - Этап 5, Подэтап 5.5

---

## Контекст

Это пятый подэтап создания функциональных компонентов. Расчёт статистики в Store необходим для централизованного управления статистикой и реактивного обновления при изменении данных.

**Зависит от:**
- TASK-005-03: Реализация состояния приложения (Store)
- TASK-003-06: Создание констант (CONFIG.STANDARD_HOURS)
- TASK-004-04: Компонент статистики (можно обновить)

---

## Модули и компоненты

### Frontend (Vue.js)
- `js/vue-apps/timesheet/stores/timesheetStore.js` — обновление Store с getters для статистики
- `js/vue-apps/timesheet/components/StatisticsBar.vue` — обновление компонента для использования Store

### Используемые утилиты
- `constants` — для стандартного количества часов (CONFIG.STANDARD_HOURS)

---

## Зависимости

- **От каких задач зависит:**
  - TASK-005-03: Реализация состояния приложения (Store)
  - TASK-003-06: Создание констант
  - TASK-004-04: Компонент статистики
- **Какие задачи зависят от этой:**
  - TASK-005-06: Интеграция всех компонентов — будет использовать статистику

---

## Ступенчатые подзадачи

### Шаг 1: Реализация getter totalHours
1. Создать getter `totalHours` в Store
2. Пройтись по всем дням в `timesheet.days`
3. Суммировать все часы
4. Вернуть сумму

### Шаг 2: Реализация getter workingDays
1. Создать getter `workingDays` в Store
2. Пройтись по всем дням в `timesheet.days`
3. Подсчитать дни с `hours > 0`
4. Вернуть количество

### Шаг 3: Реализация getter incompleteDays
1. Создать getter `incompleteDays` в Store
2. Пройтись по всем дням в `timesheet.days`
3. Подсчитать дни с `hours > 0 && hours < 8`
4. Вернуть количество

### Шаг 4: Реализация getter statusDays
1. Создать getter `statusDays` в Store
2. Пройтись по всем дням в `timesheet.days`
3. Подсчитать дни с `status !== null`
4. Вернуть количество

### Шаг 5: Обновление компонента StatisticsBar
1. Обновить компонент для использования Store
2. Использовать getters из Store вместо локальных вычислений
3. Обеспечить реактивное обновление

---

## Технические требования

### Vue.js
- **Версия:** Vue.js 3.x (Composition API)
- **Getters:** Должны быть реактивными (computed)

### Pinia
- Getters должны использовать `state` для доступа к данным
- Getters должны быть чистыми функциями

---

## Критерии приёмки

- [ ] Реализован getter `totalHours`:
  - [ ] Суммирует все часы
  - [ ] Реактивно обновляется
- [ ] Реализован getter `workingDays`:
  - [ ] Подсчитывает дни с часами > 0
  - [ ] Реактивно обновляется
- [ ] Реализован getter `incompleteDays`:
  - [ ] Подсчитывает дни с часами < 8
  - [ ] Реактивно обновляется
- [ ] Реализован getter `statusDays`:
  - [ ] Подсчитывает дни со статусами
  - [ ] Реактивно обновляется
- [ ] Компонент `StatisticsBar.vue` обновлён для использования Store
- [ ] Статистика реактивно обновляется при изменении данных

---

## Примеры кода

### Обновление Store с getters для статистики
```javascript
export const useTimesheetStore = defineStore('timesheet', {
  // ... state, actions ...
  
  getters: {
    // ... другие getters ...
    
    /**
     * Сумма часов всего
     */
    totalHours: (state) => {
      let total = 0;
      for (const day in state.timesheet.days) {
        const dayData = state.timesheet.days[day];
        if (dayData && typeof dayData.hours === 'number') {
          total += dayData.hours;
        }
      }
      return total;
    },
    
    /**
     * Количество рабочих дней (дни с часами > 0)
     */
    workingDays: (state) => {
      let count = 0;
      for (const day in state.timesheet.days) {
        const dayData = state.timesheet.days[day];
        if (dayData && typeof dayData.hours === 'number' && dayData.hours > 0) {
          count++;
        }
      }
      return count;
    },
    
    /**
     * Количество неполных дней (дни с часами < 8)
     */
    incompleteDays: (state) => {
      let count = 0;
      for (const day in state.timesheet.days) {
        const dayData = state.timesheet.days[day];
        if (dayData && 
            typeof dayData.hours === 'number' && 
            dayData.hours > 0 && 
            dayData.hours < CONFIG.STANDARD_HOURS) {
          count++;
        }
      }
      return count;
    },
    
    /**
     * Количество дней со статусами
     */
    statusDays: (state) => {
      let count = 0;
      for (const day in state.timesheet.days) {
        const dayData = state.timesheet.days[day];
        if (dayData && dayData.status !== null && dayData.status !== undefined && dayData.status !== '') {
          count++;
        }
      }
      return count;
    }
  }
});
```

### Обновление StatisticsBar.vue
```vue
<template>
  <div class="statistics-bar">
    <div class="stat-item">
      <span class="stat-label">Часов всего:</span>
      <span class="stat-value">{{ store.totalHours.toFixed(1) }}</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">Рабочих дней:</span>
      <span class="stat-value">{{ store.workingDays }}</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">Неполных дней:</span>
      <span class="stat-value">{{ store.incompleteDays }}</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">Дней со статусами:</span>
      <span class="stat-value">{{ store.statusDays }}</span>
    </div>
  </div>
</template>

<script setup>
import { useTimesheetStore } from '../stores/timesheetStore.js';

const store = useTimesheetStore();
</script>
```

---

## Тестирование

### Тестирование getters
1. Импортировать Store в тестовый файл
2. Установить данные дней
3. Проверить расчёт всех показателей статистики
4. Проверить реактивное обновление при изменении данных

---

## История правок

- **2025-12-12 12:04 (UTC+3, Брест):** Создана задача TASK-005-05

---

## Примечания

### Важные замечания
- Все getters должны быть реактивными
- Статистика должна обновляться автоматически при изменении данных
- Форматирование чисел должно быть понятным

### Следующие шаги
После завершения этого подэтапа можно переходить к:
- TASK-005-06: Интеграция всех компонентов — будет использовать статистику

---

## Связь с документацией

- **Родительская задача:** [TASK-005](TASK-005-functional-components.md)
- **Техническое задание:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - раздел 1.4

