# TASK-004-05: Компонент ячейки дня

**Дата создания:** 2025-12-12 11:53 (UTC+3, Брест)  
**Статус:** Новая  
**Приоритет:** Критический  
**Исполнитель:** Bitrix24 Программист (Vue.js)  
**Родительская задача:** [TASK-004](TASK-004-basic-vue-components.md)  
**Подэтап:** 4.5 из 6  
**Длительность:** 1.5 дня

---

## Описание

Создание компонента `CalendarCell.vue` для отображения одного дня месяца в календарной сетке. Компонент должен визуально выделять разные типы дней и отображать часы или статус.

**Связь с ТЗ:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - разделы 2.1, 2.2, 2.3  
**Связь с этапами:** [DOCS/TZ/implementation-stages.md](../TZ/implementation-stages.md) - Этап 4, Подэтап 4.5

---

## Контекст

Это пятый подэтап создания базовых компонентов Vue.js. Компонент ячейки дня является основным элементом календарной сетки и должен корректно отображать все типы дней.

**Зависит от:**
- TASK-003-04: Создание утилит для работы с датами
- TASK-003-06: Создание констант (COLORS, STATUSES)
- TASK-001-05: Настройка базовой структуры компонентов (файл уже создан)

---

## Модули и компоненты

### Frontend (Vue.js)
- `js/vue-apps/timesheet/components/CalendarCell.vue` — компонент ячейки дня

### Используемые утилиты
- `dateHelpers` — для проверки типа дня (isToday, isWeekend, isHoliday)
- `constants` — для цветов (COLORS) и статусов (STATUSES)

---

## Зависимости

- **От каких задач зависит:**
  - TASK-003-04: Создание утилит для работы с датами
  - TASK-003-06: Создание констант
  - TASK-001-05: Настройка базовой структуры компонентов
- **Какие задачи зависят от этой:**
  - TASK-004-06: Компонент календарной сетки — будет использовать этот компонент

---

## Ступенчатые подзадачи

### Шаг 1: Открытие файла
1. Открыть файл `js/vue-apps/timesheet/components/CalendarCell.vue`
2. Проверить, что файл существует

### Шаг 2: Создание структуры компонента
1. Создать секцию `<template>` с разметкой
2. Создать секцию `<script setup>` для логики
3. Создать секцию `<style scoped>` для стилей

### Шаг 3: Добавление пропсов
1. Добавить проп `day` (номер дня: 1-31)
2. Добавить проп `date` (объект Date)
3. Добавить проп `dayData` (данные дня: {hours, status})
4. Добавить проп `isToday` (boolean, опционально)
5. Добавить проп `isWeekend` (boolean, опционально)
6. Добавить проп `isHoliday` (boolean, опционально)

### Шаг 4: Реализация визуального выделения
1. Определить классы CSS на основе типа дня:
   - `today` — сегодняшний день
   - `weekend` — выходной
   - `holiday` — праздник
   - `filled` — день с заполненными часами
   - `incomplete` — неполный день
   - `status-*` — день со статусом
2. Использовать computed свойства для определения классов

### Шаг 5: Реализация отображения данных
1. Отобразить номер дня
2. Отобразить часы (если есть)
3. Отобразить статус (если есть)
4. Форматировать часы (округление до 1 знака)

### Шаг 6: Реализация обработки клика
1. Добавить обработчик клика `@click`
2. Emit событие `click` с данными дня
3. Добавить визуальную обратную связь (hover)

### Шаг 7: Интеграция утилит
1. Импортировать `dateHelpers` для проверки типа дня
2. Импортировать `constants` для цветов и статусов
3. Использовать утилиты в computed свойствах

### Шаг 8: Добавление стилей
1. Добавить базовые стили для ячейки
2. Добавить стили для разных типов дней (цвета)
3. Добавить стили для hover эффекта
4. Добавить стили для отображения данных

---

## Технические требования

### Vue.js
- **Версия:** Vue.js 3.x (Composition API)
- **Подход:** `<script setup>` синтаксис
- **Стили:** Scoped styles

### Визуальные требования
- Цвета должны соответствовать константам COLORS
- Ячейка должна быть кликабельной
- Должна быть визуальная обратная связь при hover

### События
- `click` — при клике на ячейку

---

## Критерии приёмки

- [ ] Создан компонент `CalendarCell.vue`
- [ ] Реализовано визуальное выделение разных типов дней:
  - [ ] Сегодняшний день
  - [ ] Выходные дни
  - [ ] Праздничные дни
  - [ ] Дни с заполненными часами
  - [ ] Неполные дни
  - [ ] Дни со статусами
- [ ] Реализовано отображение часов или статуса
- [ ] Реализована обработка клика (emit события)
- [ ] Интегрированы утилиты `dateHelpers` и `constants`
- [ ] Стили применены корректно
- [ ] Компонент работает корректно

---

## Примеры кода

### CalendarCell.vue
```vue
<template>
  <div
    :class="cellClasses"
    @click="handleClick"
    class="calendar-cell"
  >
    <div class="cell-day">{{ day }}</div>
    <div v-if="dayData" class="cell-content">
      <div v-if="dayData.hours > 0" class="cell-hours">
        {{ dayData.hours.toFixed(1) }}ч
      </div>
      <div v-else-if="dayData.status" class="cell-status">
        {{ getStatusLabel(dayData.status) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { isToday, isWeekend } from '../utils/dateHelpers.js';
import { COLORS, STATUSES } from '../utils/constants.js';

/**
 * Компонент ячейки дня в календарной сетке
 * 
 * Props:
 * - day: number - номер дня (1-31)
 * - date: Date - дата дня
 * - dayData: Object - данные дня {hours, status}
 * - isToday: boolean - является ли сегодняшним днём
 * - isWeekend: boolean - является ли выходным
 * - isHoliday: boolean - является ли праздником
 * 
 * Emits:
 * - click(day, date, dayData) - при клике на ячейку
 */

const props = defineProps({
  day: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  dayData: {
    type: Object,
    default: null
  },
  isToday: {
    type: Boolean,
    default: false
  },
  isWeekend: {
    type: Boolean,
    default: false
  },
  isHoliday: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['click']);

/**
 * Классы CSS для ячейки
 */
const cellClasses = computed(() => {
  const classes = [];
  
  if (props.isToday) {
    classes.push('today');
  }
  
  if (props.isWeekend) {
    classes.push('weekend');
  }
  
  if (props.isHoliday) {
    classes.push('holiday');
  }
  
  if (props.dayData) {
    if (props.dayData.hours > 0) {
      classes.push('filled');
      if (props.dayData.hours < 8) {
        classes.push('incomplete');
      }
    } else if (props.dayData.status) {
      classes.push(`status-${props.dayData.status.toLowerCase().replace(/\s+/g, '-')}`);
    }
  }
  
  return classes;
});

/**
 * Получение метки статуса
 */
function getStatusLabel(status) {
  const statusMap = {
    [STATUSES.SICK]: 'Б',
    [STATUSES.BUSINESS_TRIP]: 'К',
    [STATUSES.VACATION]: 'О',
    [STATUSES.UNPAID_VACATION]: 'ОЗС'
  };
  
  return statusMap[status] || status;
}

/**
 * Обработка клика
 */
function handleClick() {
  emit('click', props.day, props.date, props.dayData);
}
</script>

<style scoped>
.calendar-cell {
  min-height: 60px;
  padding: 5px;
  border: 1px solid #ddd;
  background-color: #fff;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.calendar-cell:hover {
  background-color: #f0f0f0;
  transform: scale(1.02);
}

.cell-day {
  font-size: 12px;
  font-weight: bold;
  color: #666;
}

.cell-content {
  font-size: 11px;
  margin-top: auto;
}

.cell-hours {
  color: #2e7d32;
  font-weight: 500;
}

.cell-status {
  color: #d32f2f;
  font-weight: 500;
}

/* Сегодняшний день */
.calendar-cell.today {
  background-color: #e3f2fd;
  border-color: #2196f3;
}

/* Выходной */
.calendar-cell.weekend {
  background-color: #f0f0f0;
}

/* Праздник */
.calendar-cell.holiday {
  background-color: #ffebee;
}

/* Заполненный день */
.calendar-cell.filled {
  background-color: #e8f5e9;
}

/* Неполный день */
.calendar-cell.incomplete {
  background-color: #fff9c4;
}

/* Статусы */
.calendar-cell.status-больничный {
  background-color: #ffcdd2;
}

.calendar-cell.status-командировка {
  background-color: #c8e6c9;
}

.calendar-cell.status-отпуск-календарный {
  background-color: #b3e5fc;
}

.calendar-cell.status-отпуск-за-свой-счёт {
  background-color: #fff9c4;
}
</style>
```

### Использование в компоненте
```vue
<template>
  <CalendarCell
    :day="1"
    :date="new Date(2025, 11, 1)"
    :day-data="{ hours: 8.0, status: null }"
    :is-today="false"
    :is-weekend="false"
    :is-holiday="false"
    @click="handleCellClick"
  />
</template>

<script setup>
import CalendarCell from './components/CalendarCell.vue';

function handleCellClick(day, date, dayData) {
  console.log('Cell clicked:', day, date, dayData);
  // Открыть модальное окно редактирования
}
</script>
```

---

## Тестирование

### Тестирование компонента
1. Импортировать компонент в тестовый файл
2. Проверить отображение разных типов дней
3. Проверить отображение часов
4. Проверить отображение статусов
5. Проверить обработку клика
6. Проверить визуальное выделение

---

## История правок

- **2025-12-12 11:53 (UTC+3, Брест):** Создана задача TASK-004-05

---

## Примечания

### Важные замечания
- Компонент должен корректно отображать все типы дней
- Цвета должны соответствовать константам COLORS
- Ячейка должна быть кликабельной с визуальной обратной связью

### Следующие шаги
После завершения этого подэтапа можно переходить к:
- TASK-004-06: Компонент календарной сетки — будет использовать этот компонент

---

## Связь с документацией

- **Родительская задача:** [TASK-004](TASK-004-basic-vue-components.md)
- **Техническое задание:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - разделы 2.1, 2.2, 2.3


