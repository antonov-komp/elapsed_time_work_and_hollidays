# TASK-004-06: Компонент календарной сетки

**Дата создания:** 2025-12-12 11:53 (UTC+3, Брест)  
**Статус:** Новая  
**Приоритет:** Критический  
**Исполнитель:** Bitrix24 Программист (Vue.js)  
**Родительская задача:** [TASK-004](TASK-004-basic-vue-components.md)  
**Подэтап:** 4.6 из 6  
**Длительность:** 1.5 дня

---

## Описание

Создание компонента `CalendarGrid.vue` для отображения всех дней месяца в виде сетки. Компонент интегрирует `CalendarCell.vue` для каждого дня и загружает данные табеля и праздников.

**Связь с ТЗ:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - раздел 2  
**Связь с этапами:** [DOCS/TZ/implementation-stages.md](../TZ/implementation-stages.md) - Этап 4, Подэтап 4.6

---

## Контекст

Это шестой (последний) подэтап создания базовых компонентов Vue.js. Компонент календарной сетки является центральным элементом интерфейса и объединяет все предыдущие компоненты.

**Зависит от:**
- TASK-004-05: Компонент ячейки дня
- TASK-003-02: Создание сервиса для работы с табелем
- TASK-003-03: Создание сервиса для работы с праздниками
- TASK-003-04: Создание утилит для работы с датами
- TASK-001-05: Настройка базовой структуры компонентов (файл уже создан)

---

## Модули и компоненты

### Frontend (Vue.js)
- `js/vue-apps/timesheet/components/CalendarGrid.vue` — компонент календарной сетки

### Используемые компоненты
- `CalendarCell.vue` — для отображения каждого дня

### Используемые сервисы
- `TimesheetApiService` — для загрузки данных табеля
- `HolidaysService` — для загрузки праздников

### Используемые утилиты
- `dateHelpers` — для работы с датами
- `constants` — для констант

---

## Зависимости

- **От каких задач зависит:**
  - TASK-004-05: Компонент ячейки дня
  - TASK-003-02: Создание сервиса для работы с табелем
  - TASK-003-03: Создание сервиса для работы с праздниками
  - TASK-003-04: Создание утилит для работы с датами
  - TASK-001-05: Настройка базовой структуры компонентов
- **Какие задачи зависят от этой:**
  - TASK-005: Функциональные компоненты и логика — будет расширять этот компонент

---

## Ступенчатые подзадачи

### Шаг 1: Открытие файла
1. Открыть файл `js/vue-apps/timesheet/components/CalendarGrid.vue`
2. Проверить, что файл существует

### Шаг 2: Создание структуры компонента
1. Создать секцию `<template>` с разметкой
2. Создать секцию `<script setup>` для логики
3. Создать секцию `<style scoped>` для стилей

### Шаг 3: Добавление пропсов
1. Добавить проп `year` (год)
2. Добавить проп `month` (месяц)

### Шаг 4: Реализация генерации массива дней
1. Создать computed свойство `daysArray`
2. Использовать `getDaysInMonth` для получения количества дней
3. Создать массив объектов с данными каждого дня:
   - Номер дня
   - Объект Date
   - Данные дня из табеля (если есть)

### Шаг 5: Интеграция CalendarCell
1. Использовать `v-for` для отображения дней
2. Передать все необходимые пропсы в `CalendarCell`
3. Обработать событие `click` от `CalendarCell`

### Шаг 6: Реализация загрузки данных табеля
1. Использовать `TimesheetApiService.getTimesheet()`
2. Загружать данные при изменении года/месяца
3. Обработать состояние загрузки
4. Обработать ошибки

### Шаг 7: Реализация загрузки праздников
1. Использовать `HolidaysService.getHolidays()`
2. Загружать праздники при изменении года
3. Кэшировать праздники

### Шаг 8: Реализация определения типа дня
1. Использовать `dateHelpers` для проверки типа дня
2. Определять `isToday`, `isWeekend`, `isHoliday` для каждого дня
3. Передавать эти данные в `CalendarCell`

### Шаг 9: Добавление стилей
1. Добавить стили для сетки (grid layout)
2. Настроить количество колонок (7 дней в неделе)
3. Добавить стили для заголовков дней недели (опционально)

### Шаг 10: Обработка событий
1. Обработать событие `click` от `CalendarCell`
2. Emit событие для родительского компонента

---

## Технические требования

### Vue.js
- **Версия:** Vue.js 3.x (Composition API)
- **Подход:** `<script setup>` синтаксис
- **Стили:** Scoped styles

### Grid Layout
- 7 колонок (дни недели)
- Адаптивная сетка

### Загрузка данных
- Загрузка при изменении года/месяца
- Обработка состояний загрузки и ошибок

---

## Критерии приёмки

- [ ] Создан компонент `CalendarGrid.vue`
- [ ] Реализована генерация сетки дней месяца
- [ ] Интегрирован `CalendarCell.vue` для каждого дня
- [ ] Реализована загрузка данных табеля через `TimesheetApiService`
- [ ] Реализована загрузка праздников через `HolidaysService`
- [ ] Реализовано определение типа дня (рабочий, выходной, праздник)
- [ ] Реализована обработка событий от `CalendarCell`
- [ ] Стили применены корректно (grid layout)
- [ ] Компонент работает корректно

---

## Примеры кода

### CalendarGrid.vue
```vue
<template>
  <div class="calendar-grid">
    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="grid-container">
      <CalendarCell
        v-for="dayInfo in daysArray"
        :key="dayInfo.day"
        :day="dayInfo.day"
        :date="dayInfo.date"
        :day-data="dayInfo.dayData"
        :is-today="dayInfo.isToday"
        :is-weekend="dayInfo.isWeekend"
        :is-holiday="dayInfo.isHoliday"
        @click="handleCellClick"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import CalendarCell from './CalendarCell.vue';
import { TimesheetApiService } from '../services/TimesheetApiService.js';
import { HolidaysService } from '../services/HolidaysService.js';
import { getDaysInMonth, isToday, isWeekend, getFirstDayOfMonth } from '../utils/dateHelpers.js';

/**
 * Компонент календарной сетки
 * 
 * Props:
 * - year: number - год
 * - month: number - месяц (1-12)
 * 
 * Emits:
 * - cell-click(day, date, dayData) - при клике на ячейку
 */

const props = defineProps({
  year: {
    type: Number,
    required: true
  },
  month: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['cell-click']);

const loading = ref(false);
const error = ref(null);
const timesheetData = ref(null);
const holidays = ref([]);

/**
 * Массив дней месяца
 */
const daysArray = computed(() => {
  const days = [];
  const daysInMonth = getDaysInMonth(props.year, props.month);
  const firstDay = getFirstDayOfMonth(props.year, props.month);
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(props.year, props.month - 1, day);
    const dayData = timesheetData.value?.days?.[day] || null;
    const dateStr = `${props.year}-${String(props.month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    days.push({
      day,
      date,
      dayData,
      isToday: isToday(date),
      isWeekend: isWeekend(date),
      isHoliday: holidays.value.includes(dateStr)
    });
  }
  
  return days;
});

/**
 * Загрузка данных табеля
 */
async function loadTimesheet() {
  try {
    loading.value = true;
    error.value = null;
    
    const data = await TimesheetApiService.getTimesheet(props.year, props.month);
    timesheetData.value = data;
  } catch (e) {
    console.error('CalendarGrid loadTimesheet error:', e);
    error.value = 'Не удалось загрузить данные табеля';
  } finally {
    loading.value = false;
  }
}

/**
 * Загрузка праздников
 */
async function loadHolidays() {
  try {
    const data = await HolidaysService.getHolidays(props.year);
    holidays.value = data;
  } catch (e) {
    console.error('CalendarGrid loadHolidays error:', e);
    // Праздники не критичны, продолжаем работу
  }
}

/**
 * Обработка клика на ячейку
 */
function handleCellClick(day, date, dayData) {
  emit('cell-click', day, date, dayData);
}

// Загрузка данных при изменении года/месяца
watch([() => props.year, () => props.month], () => {
  loadTimesheet();
  loadHolidays();
}, { immediate: true });

// Загрузка при монтировании
onMounted(() => {
  loadTimesheet();
  loadHolidays();
});
</script>

<style scoped>
.calendar-grid {
  padding: 20px;
}

.loading,
.error {
  text-align: center;
  padding: 20px;
}

.error {
  color: #d32f2f;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  background-color: #ddd;
  border: 1px solid #ddd;
}

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: repeat(7, 1fr);
    gap: 1px;
  }
}
</style>
```

### Использование в компоненте
```vue
<template>
  <div class="timesheet-calendar">
    <CalendarGrid
      :year="year"
      :month="month"
      @cell-click="handleCellClick"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import CalendarGrid from './components/CalendarGrid.vue';

const year = ref(2025);
const month = ref(12);

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
2. Передать год и месяц
3. Проверить генерацию сетки дней
4. Проверить загрузку данных табеля
5. Проверить загрузку праздников
6. Проверить определение типа дня
7. Проверить обработку клика

---

## История правок

- **2025-12-12 11:53 (UTC+3, Брест):** Создана задача TASK-004-06

---

## Примечания

### Важные замечания
- Компонент должен загружать данные при изменении года/месяца
- Ошибки загрузки праздников не должны блокировать работу
- Сетка должна быть адаптивной для мобильных устройств

### Следующие шаги
После завершения этого подэтапа можно переходить к:
- TASK-005: Функциональные компоненты и логика — будет расширять этот компонент

---

## Связь с документацией

- **Родительская задача:** [TASK-004](TASK-004-basic-vue-components.md)
- **Предыдущий подэтап:** [TASK-004-05](TASK-004-05-calendar-cell.md)
- **Техническое задание:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - раздел 2

