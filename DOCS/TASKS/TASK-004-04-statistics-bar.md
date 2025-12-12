# TASK-004-04: Компонент статистики

**Дата создания:** 2025-12-12 11:53 (UTC+3, Брест)  
**Статус:** Новая  
**Приоритет:** Высокий  
**Исполнитель:** Bitrix24 Программист (Vue.js)  
**Родительская задача:** [TASK-004](TASK-004-basic-vue-components.md)  
**Подэтап:** 4.4 из 6  
**Длительность:** 1 день

---

## Описание

Создание компонента `StatisticsBar.vue` для отображения статистики табеля присутствия: сумма часов, количество рабочих дней, неполных дней и дней со статусами.

**Связь с ТЗ:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - раздел 1.4  
**Связь с этапами:** [DOCS/TZ/implementation-stages.md](../TZ/implementation-stages.md) - Этап 4, Подэтап 4.4

---

## Контекст

Это четвёртый подэтап создания базовых компонентов Vue.js. Компонент статистики необходим для отображения сводной информации о табеле присутствия.

**Зависит от:**
- TASK-003-06: Создание констант (CONFIG.STANDARD_HOURS)
- TASK-001-05: Настройка базовой структуры компонентов (файл уже создан)

---

## Модули и компоненты

### Frontend (Vue.js)
- `js/vue-apps/timesheet/components/StatisticsBar.vue` — компонент статистики

### Используемые утилиты
- `constants` — для стандартного количества часов (CONFIG.STANDARD_HOURS)

---

## Зависимости

- **От каких задач зависит:**
  - TASK-003-06: Создание констант
  - TASK-001-05: Настройка базовой структуры компонентов
- **Какие задачи зависят от этой:**
  - TASK-004-06: Компонент календарной сетки — будет использовать этот компонент

---

## Ступенчатые подзадачи

### Шаг 1: Открытие файла
1. Открыть файл `js/vue-apps/timesheet/components/StatisticsBar.vue`
2. Проверить, что файл существует

### Шаг 2: Создание структуры компонента
1. Создать секцию `<template>` с разметкой
2. Создать секцию `<script setup>` для логики
3. Создать секцию `<style scoped>` для стилей

### Шаг 3: Добавление пропсов
1. Добавить проп `days` (объект с данными дней)
2. Тип: Object
3. Значение по умолчанию: `{}`

### Шаг 4: Реализация расчёта статистики
1. Создать computed свойства для расчёта:
   - `totalHours` — сумма часов всего
   - `workingDays` — количество рабочих дней (дни с часами > 0)
   - `incompleteDays` — количество неполных дней (дни с часами < 8)
   - `statusDays` — количество дней со статусами
2. Использовать `computed` из Vue

### Шаг 5: Реализация логики расчёта
1. `totalHours`: суммировать все часы из дней
2. `workingDays`: подсчитать дни с `hours > 0`
3. `incompleteDays`: подсчитать дни с `hours > 0 && hours < 8`
4. `statusDays`: подсчитать дни с `status !== null`

### Шаг 6: Отображение статистики
1. Отобразить все показатели в виде карточек или списка
2. Добавить иконки или метки для каждого показателя
3. Форматировать числа (округление для часов)

### Шаг 7: Добавление стилей
1. Добавить стили для контейнера
2. Добавить стили для карточек показателей
3. Добавить стили для чисел и меток

---

## Технические требования

### Vue.js
- **Версия:** Vue.js 3.x (Composition API)
- **Подход:** `<script setup>` синтаксис
- **Стили:** Scoped styles

### Формат данных
- `days`: объект с ключами-номерами дней
- Каждый день: `{hours: number, status: string|null}`

### Показатели статистики
- Сумма часов всего
- Количество рабочих дней (дни с часами > 0)
- Количество неполных дней (дни с часами < 8)
- Количество дней со статусами

---

## Критерии приёмки

- [ ] Создан компонент `StatisticsBar.vue`
- [ ] Реализован расчёт суммы часов всего
- [ ] Реализован расчёт количества рабочих дней
- [ ] Реализован расчёт количества неполных дней
- [ ] Реализован расчёт количества дней со статусами
- [ ] Реализовано реактивное обновление при изменении данных
- [ ] Все показатели отображаются корректно
- [ ] Стили применены корректно
- [ ] Компонент работает корректно

---

## Примеры кода

### StatisticsBar.vue
```vue
<template>
  <div class="statistics-bar">
    <div class="stat-item">
      <span class="stat-label">Часов всего:</span>
      <span class="stat-value">{{ totalHours.toFixed(1) }}</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">Рабочих дней:</span>
      <span class="stat-value">{{ workingDays }}</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">Неполных дней:</span>
      <span class="stat-value">{{ incompleteDays }}</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">Дней со статусами:</span>
      <span class="stat-value">{{ statusDays }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { CONFIG } from '../utils/constants.js';

/**
 * Компонент статистики табеля присутствия
 * 
 * Props:
 * - days: Object - данные дней табеля
 */

const props = defineProps({
  days: {
    type: Object,
    default: () => ({})
  }
});

/**
 * Сумма часов всего
 */
const totalHours = computed(() => {
  let total = 0;
  for (const day in props.days) {
    const dayData = props.days[day];
    if (dayData && typeof dayData.hours === 'number') {
      total += dayData.hours;
    }
  }
  return total;
});

/**
 * Количество рабочих дней (дни с часами > 0)
 */
const workingDays = computed(() => {
  let count = 0;
  for (const day in props.days) {
    const dayData = props.days[day];
    if (dayData && typeof dayData.hours === 'number' && dayData.hours > 0) {
      count++;
    }
  }
  return count;
});

/**
 * Количество неполных дней (дни с часами < 8)
 */
const incompleteDays = computed(() => {
  let count = 0;
  for (const day in props.days) {
    const dayData = props.days[day];
    if (dayData && 
        typeof dayData.hours === 'number' && 
        dayData.hours > 0 && 
        dayData.hours < CONFIG.STANDARD_HOURS) {
      count++;
    }
  }
  return count;
});

/**
 * Количество дней со статусами
 */
const statusDays = computed(() => {
  let count = 0;
  for (const day in props.days) {
    const dayData = props.days[day];
    if (dayData && dayData.status !== null && dayData.status !== undefined && dayData.status !== '') {
      count++;
    }
  }
  return count;
});
</script>

<style scoped>
.statistics-bar {
  display: flex;
  gap: 20px;
  padding: 15px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #ddd;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px 15px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 120px;
}

.stat-label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}
</style>
```

### Использование в компоненте
```vue
<template>
  <div class="timesheet-calendar">
    <StatisticsBar :days="timesheetData.days" />
    <!-- Остальной контент -->
  </div>
</template>

<script setup>
import { ref } from 'vue';
import StatisticsBar from './components/StatisticsBar.vue';

const timesheetData = ref({
  days: {
    1: { hours: 8.0, status: null },
    2: { hours: 7.5, status: null },
    3: { hours: 0, status: 'Больничный' }
  }
});
</script>
```

---

## Тестирование

### Тестирование компонента
1. Импортировать компонент в тестовый файл
2. Передать данные дней
3. Проверить расчёт всех показателей
4. Проверить реактивное обновление при изменении данных
5. Проверить форматирование чисел

---

## История правок

- **2025-12-12 11:53 (UTC+3, Брест):** Создана задача TASK-004-04

---

## Примечания

### Важные замечания
- Все расчёты должны быть реактивными (computed)
- Статистика должна обновляться автоматически при изменении данных
- Форматирование чисел должно быть понятным (округление до 1 знака для часов)

### Следующие шаги
После завершения этого подэтапа можно переходить к:
- TASK-004-05: Компонент ячейки дня
- TASK-004-06: Компонент календарной сетки — будет использовать этот компонент

---

## Связь с документацией

- **Родительская задача:** [TASK-004](TASK-004-basic-vue-components.md)
- **Техническое задание:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - раздел 1.4

