# TASK-005-02: Компонент кнопки "Заполнить неделю"

**Дата создания:** 2025-12-12 12:04 (UTC+3, Брест)  
**Статус:** Новая  
**Приоритет:** Критический  
**Исполнитель:** Bitrix24 Программист (Vue.js)  
**Родительская задача:** [TASK-005](TASK-005-functional-components.md)  
**Подэтап:** 5.2 из 6  
**Длительность:** 1.5 дня

---

## Описание

Создание компонента `FillWeekButton.vue` для заполнения текущей недели рабочими часами (8 часов в день). Компонент должен исключать выходные и праздники, а также запрашивать подтверждение действия.

**Связь с ТЗ:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - раздел 2.5  
**Связь с этапами:** [DOCS/TZ/implementation-stages.md](../TZ/implementation-stages.md) - Этап 5, Подэтап 5.2

---

## Контекст

Это второй подэтап создания функциональных компонентов. Компонент кнопки "Заполнить неделю" необходим для быстрого заполнения рабочей недели стандартным количеством часов.

**Зависит от:**
- TASK-003-04: Создание утилит для работы с датами
- TASK-003-06: Создание констант (CONFIG.STANDARD_HOURS)
- TASK-001-05: Настройка базовой структуры компонентов (файл уже создан)

---

## Модули и компоненты

### Frontend (Vue.js)
- `js/vue-apps/timesheet/components/FillWeekButton.vue` — компонент кнопки "Заполнить неделю"

### Используемые утилиты
- `dateHelpers` — для работы с датами и неделями
- `constants` — для стандартного количества часов (CONFIG.STANDARD_HOURS)

---

## Зависимости

- **От каких задач зависит:**
  - TASK-003-04: Создание утилит для работы с датами
  - TASK-003-06: Создание констант
  - TASK-001-05: Настройка базовой структуры компонентов
- **Какие задачи зависят от этой:**
  - TASK-005-06: Интеграция всех компонентов — будет использовать этот компонент

---

## Ступенчатые подзадачи

### Шаг 1: Открытие файла
1. Открыть файл `js/vue-apps/timesheet/components/FillWeekButton.vue`
2. Проверить, что файл существует

### Шаг 2: Создание структуры компонента
1. Создать секцию `<template>` с кнопкой
2. Создать секцию `<script setup>` для логики
3. Создать секцию `<style scoped>` для стилей

### Шаг 3: Добавление пропсов
1. Добавить проп `year` (год)
2. Добавить проп `month` (месяц)
3. Добавить проп `holidays` (массив праздников)
4. Добавить проп `currentDays` (текущие данные дней, опционально)

### Шаг 4: Реализация определения текущей недели
1. Использовать `getCurrentWeek()` из `dateHelpers`
2. Определить диапазон недели (понедельник-воскресенье)
3. Фильтровать дни, которые попадают в текущий месяц

### Шаг 5: Реализация заполнения рабочих дней
1. Пройтись по всем дням недели
2. Проверить, является ли день выходным (isWeekend)
3. Проверить, является ли день праздником (isHoliday)
4. Если день рабочий, установить 8 часов
5. Исключить выходные и праздники

### Шаг 6: Реализация подтверждения действия
1. Показать диалог подтверждения перед заполнением
2. Использовать `confirm()` или кастомный диалог
3. Отобразить информацию о том, какие дни будут заполнены

### Шаг 7: Реализация обработки сохранения
1. Emit событие `fill-week` с данными дней
2. Передать объект с данными для каждого дня недели
3. Обработать состояние загрузки

### Шаг 8: Добавление стилей
1. Добавить стили для кнопки
2. Добавить стили для состояния загрузки
3. Добавить hover эффекты

---

## Технические требования

### Vue.js
- **Версия:** Vue.js 3.x (Composition API)
- **Подход:** `<script setup>` синтаксис
- **Стили:** Scoped styles

### Логика заполнения
- Заполнять только рабочие дни (не выходные, не праздники)
- Устанавливать 8 часов для каждого рабочего дня
- Не перезаписывать дни со статусами (опционально)

### События
- `fill-week(days)` — при заполнении недели (объект с данными дней)

---

## Критерии приёмки

- [ ] Создан компонент `FillWeekButton.vue`
- [ ] Реализовано определение текущей недели
- [ ] Реализовано заполнение рабочих дней (8 часов)
- [ ] Реализовано исключение выходных дней
- [ ] Реализовано исключение праздничных дней
- [ ] Реализовано подтверждение действия
- [ ] Реализована обработка сохранения (emit события)
- [ ] Стили применены корректно
- [ ] Компонент работает корректно

---

## Примеры кода

### FillWeekButton.vue
```vue
<template>
  <button
    @click="handleFillWeek"
    :disabled="loading"
    class="fill-week-button"
  >
    <span v-if="loading">Заполнение...</span>
    <span v-else>Заполнить неделю</span>
  </button>
</template>

<script setup>
import { ref } from 'vue';
import { getCurrentWeek, isWeekend, isHoliday, formatDateForAPI } from '../utils/dateHelpers.js';
import { CONFIG } from '../utils/constants.js';

/**
 * Компонент кнопки "Заполнить неделю"
 * 
 * Props:
 * - year: number - год
 * - month: number - месяц
 * - holidays: Array - массив праздников (формат "YYYY-MM-DD")
 * - currentDays: Object - текущие данные дней (опционально)
 * 
 * Emits:
 * - fill-week(days) - при заполнении недели
 */

const props = defineProps({
  year: {
    type: Number,
    required: true
  },
  month: {
    type: Number,
    required: true
  },
  holidays: {
    type: Array,
    default: () => []
  },
  currentDays: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['fill-week']);

const loading = ref(false);

/**
 * Обработка заполнения недели
 */
function handleFillWeek() {
  const week = getCurrentWeek();
  const daysToFill = {};
  
  // Определение дней недели в текущем месяце
  const startDate = new Date(Math.max(week.monday, new Date(props.year, props.month - 1, 1)));
  const endDate = new Date(Math.min(week.sunday, new Date(props.year, props.month, 0)));
  
  // Проход по дням недели
  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    const day = date.getDate();
    const dateStr = formatDateForAPI(date);
    
    // Пропускаем выходные
    if (isWeekend(date)) {
      continue;
    }
    
    // Пропускаем праздники
    if (isHoliday(date, props.holidays)) {
      continue;
    }
    
    // Пропускаем дни, которые уже имеют статус (опционально)
    const existingDay = props.currentDays[day];
    if (existingDay && existingDay.status) {
      continue;
    }
    
    // Заполняем день 8 часами
    daysToFill[day] = {
      hours: CONFIG.STANDARD_HOURS,
      status: null
    };
  }
  
  // Проверка, есть ли дни для заполнения
  const daysCount = Object.keys(daysToFill).length;
  if (daysCount === 0) {
    alert('Нет рабочих дней для заполнения в текущей неделе');
    return;
  }
  
  // Подтверждение действия
  const confirmMessage = `Заполнить ${daysCount} рабочи${daysCount === 1 ? 'й' : daysCount < 5 ? 'х' : 'х'} день${daysCount === 1 ? '' : daysCount < 5 ? 'я' : 'ей'} по 8 часов?`;
  
  if (!confirm(confirmMessage)) {
    return;
  }
  
  // Emit события с данными
  loading.value = true;
  try {
    emit('fill-week', daysToFill);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.fill-week-button {
  padding: 10px 20px;
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.fill-week-button:hover:not(:disabled) {
  background-color: #2980b9;
}

.fill-week-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
```

### Использование в компоненте
```vue
<template>
  <FillWeekButton
    :year="year"
    :month="month"
    :holidays="holidays"
    :current-days="timesheetData.days"
    @fill-week="handleFillWeek"
  />
</template>

<script setup>
import { ref } from 'vue';
import FillWeekButton from './components/FillWeekButton.vue';

const year = ref(2025);
const month = ref(12);
const holidays = ref([]);
const timesheetData = ref({ days: {} });

function handleFillWeek(days) {
  // Обновление данных табеля
  timesheetData.value.days = {
    ...timesheetData.value.days,
    ...days
  };
  
  // Сохранение на сервер
  saveTimesheet();
}
</script>
```

---

## Тестирование

### Тестирование компонента
1. Импортировать компонент в тестовый файл
2. Проверить определение текущей недели
3. Проверить заполнение рабочих дней
4. Проверить исключение выходных
5. Проверить исключение праздников
6. Проверить подтверждение действия
7. Проверить emit события

---

## История правок

- **2025-12-12 12:04 (UTC+3, Брест):** Создана задача TASK-005-02

---

## Примечания

### Важные замечания
- Компонент должен заполнять только рабочие дни
- Выходные и праздники должны быть исключены
- Подтверждение действия обязательно перед заполнением

### Следующие шаги
После завершения этого подэтапа можно переходить к:
- TASK-005-03: Реализация состояния приложения (Store)
- TASK-005-06: Интеграция всех компонентов — будет использовать этот компонент

---

## Связь с документацией

- **Родительская задача:** [TASK-005](TASK-005-functional-components.md)
- **Техническое задание:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - раздел 2.5

