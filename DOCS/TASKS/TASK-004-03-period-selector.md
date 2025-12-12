# TASK-004-03: Компонент выбора периода

**Дата создания:** 2025-12-12 11:53 (UTC+3, Брест)  
**Статус:** Новая  
**Приоритет:** Высокий  
**Исполнитель:** Bitrix24 Программист (Vue.js)  
**Родительская задача:** [TASK-004](TASK-004-basic-vue-components.md)  
**Подэтап:** 4.3 из 6  
**Длительность:** 1 день

---

## Описание

Создание компонента `PeriodSelector.vue` для выбора месяца и года табеля присутствия. Компонент содержит два выпадающих списка для выбора периода.

**Связь с ТЗ:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - раздел 1.3  
**Связь с этапами:** [DOCS/TZ/implementation-stages.md](../TZ/implementation-stages.md) - Этап 4, Подэтап 4.3

---

## Контекст

Это третий подэтап создания базовых компонентов Vue.js. Компонент выбора периода необходим для навигации по месяцам и годам табеля присутствия.

**Зависит от:**
- TASK-003-06: Создание констант (CONFIG для диапазона лет)
- TASK-001-05: Настройка базовой структуры компонентов (файл уже создан)

---

## Модули и компоненты

### Frontend (Vue.js)
- `js/vue-apps/timesheet/components/PeriodSelector.vue` — компонент выбора периода

### Используемые утилиты
- `constants` — для диапазона лет (CONFIG.MIN_YEAR, CONFIG.MAX_YEAR)
- `dateHelpers` — для получения текущего года и месяца

---

## Зависимости

- **От каких задач зависит:**
  - TASK-003-06: Создание констант
  - TASK-003-04: Создание утилит для работы с датами
  - TASK-001-05: Настройка базовой структуры компонентов
- **Какие задачи зависят от этой:**
  - TASK-004-06: Компонент календарной сетки — будет использовать этот компонент

---

## Ступенчатые подзадачи

### Шаг 1: Открытие файла
1. Открыть файл `js/vue-apps/timesheet/components/PeriodSelector.vue`
2. Проверить, что файл существует

### Шаг 2: Создание структуры компонента
1. Создать секцию `<template>` с разметкой
2. Создать секцию `<script setup>` для логики
3. Создать секцию `<style scoped>` для стилей

### Шаг 3: Реализация выбора года
1. Создать выпадающий список (select) для года
2. Сгенерировать массив годов (2025-2035)
3. Использовать константы из `CONFIG`
4. Установить текущий год по умолчанию

### Шаг 4: Реализация выбора месяца
1. Создать выпадающий список (select) для месяца
2. Создать массив месяцев (1-12) с названиями
3. Установить текущий месяц по умолчанию

### Шаг 5: Реализация обработки изменений
1. Использовать `v-model` для привязки значений
2. Создать реактивные переменные для года и месяца
3. Реализовать emit события при изменении периода
4. Использовать `watch` для отслеживания изменений

### Шаг 6: Добавление валидации
1. Валидировать год (2025-2035)
2. Валидировать месяц (1-12)
3. Использовать утилиты валидации (опционально)

### Шаг 7: Добавление стилей
1. Добавить стили для контейнера
2. Добавить стили для выпадающих списков
3. Добавить стили для меток (labels)

---

## Технические требования

### Vue.js
- **Версия:** Vue.js 3.x (Composition API)
- **Подход:** `<script setup>` синтаксис
- **Стили:** Scoped styles

### Диапазон
- Год: 2025-2035 (из CONFIG)
- Месяц: 1-12

### События
- `update:year` — при изменении года
- `update:month` — при изменении месяца
- `change` — при изменении периода (год или месяц)

---

## Критерии приёмки

- [ ] Создан компонент `PeriodSelector.vue`
- [ ] Реализован выбор месяца (выпадающий список)
- [ ] Реализован выбор года (выпадающий список)
- [ ] Годы в диапазоне 2025-2035
- [ ] Месяцы в диапазоне 1-12
- [ ] Текущий год и месяц установлены по умолчанию
- [ ] Реализована обработка изменения периода (emit события)
- [ ] Валидация работает корректно
- [ ] Стили применены корректно
- [ ] Компонент работает корректно

---

## Примеры кода

### PeriodSelector.vue
```vue
<template>
  <div class="period-selector">
    <label class="period-label">
      Период:
      <select v-model="selectedYear" @change="handlePeriodChange" class="period-select">
        <option v-for="year in years" :key="year" :value="year">
          {{ year }}
        </option>
      </select>
      <select v-model="selectedMonth" @change="handlePeriodChange" class="period-select">
        <option v-for="month in months" :key="month.value" :value="month.value">
          {{ month.label }}
        </option>
      </select>
    </label>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { getCurrentYear, getCurrentMonth } from '../utils/dateHelpers.js';
import { CONFIG } from '../utils/constants.js';

/**
 * Компонент выбора периода (месяц и год)
 * 
 * Emits:
 * - change(year, month) - при изменении периода
 */

const emit = defineEmits(['change']);

// Годы (2025-2035)
const years = [];
for (let year = CONFIG.MIN_YEAR; year <= CONFIG.MAX_YEAR; year++) {
  years.push(year);
}

// Месяцы с названиями
const months = [
  { value: 1, label: 'Январь' },
  { value: 2, label: 'Февраль' },
  { value: 3, label: 'Март' },
  { value: 4, label: 'Апрель' },
  { value: 5, label: 'Май' },
  { value: 6, label: 'Июнь' },
  { value: 7, label: 'Июль' },
  { value: 8, label: 'Август' },
  { value: 9, label: 'Сентябрь' },
  { value: 10, label: 'Октябрь' },
  { value: 11, label: 'Ноябрь' },
  { value: 12, label: 'Декабрь' }
];

// Текущие значения
const selectedYear = ref(getCurrentYear());
const selectedMonth = ref(getCurrentMonth());

// Обработка изменения периода
function handlePeriodChange() {
  emit('change', selectedYear.value, selectedMonth.value);
}

// Отслеживание изменений через watch
watch([selectedYear, selectedMonth], () => {
  handlePeriodChange();
});

// Инициализация: emit текущего периода
onMounted(() => {
  handlePeriodChange();
});
</script>

<style scoped>
.period-selector {
  padding: 15px;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
}

.period-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.period-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: #fff;
  cursor: pointer;
  transition: border-color 0.2s;
}

.period-select:hover {
  border-color: #3498db;
}

.period-select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}
</style>
```

### Использование в компоненте
```vue
<template>
  <div class="timesheet-calendar">
    <PeriodSelector @change="handlePeriodChange" />
    <!-- Остальной контент -->
  </div>
</template>

<script setup>
import { ref } from 'vue';
import PeriodSelector from './components/PeriodSelector.vue';

const year = ref(2025);
const month = ref(12);

function handlePeriodChange(newYear, newMonth) {
  year.value = newYear;
  month.value = newMonth;
  // Загрузка данных табеля для нового периода
  loadTimesheet(newYear, newMonth);
}
</script>
```

---

## Тестирование

### Тестирование компонента
1. Импортировать компонент в тестовый файл
2. Проверить отображение выпадающих списков
3. Проверить изменение года
4. Проверить изменение месяца
5. Проверить emit события
6. Проверить валидацию

---

## История правок

- **2025-12-12 11:53 (UTC+3, Брест):** Создана задача TASK-004-03

---

## Примечания

### Важные замечания
- Компонент должен emit события при изменении периода
- Текущий год и месяц должны устанавливаться по умолчанию
- Валидация должна предотвращать выбор недопустимых значений

### Следующие шаги
После завершения этого подэтапа можно переходить к:
- TASK-004-04: Компонент статистики
- TASK-004-06: Компонент календарной сетки — будет использовать этот компонент

---

## Связь с документацией

- **Родительская задача:** [TASK-004](TASK-004-basic-vue-components.md)
- **Техническое задание:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - раздел 1.3

