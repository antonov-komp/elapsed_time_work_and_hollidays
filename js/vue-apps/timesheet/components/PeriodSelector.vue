<template>
  <div class="period-selector">
    <label for="month-select" class="label">Месяц:</label>
    <select 
      id="month-select"
      v-model="selectedMonth" 
      @change="handlePeriodChange"
      class="select"
    >
      <option 
        v-for="(monthName, index) in MONTHS" 
        :key="index"
        :value="index + 1"
      >
        {{ monthName }}
      </option>
    </select>
    
    <label for="year-select" class="label">Год:</label>
    <select 
      id="year-select"
      v-model="selectedYear" 
      @change="handlePeriodChange"
      class="select"
    >
      <option 
        v-for="year in yearsRange" 
        :key="year"
        :value="year"
      >
        {{ year }}
      </option>
    </select>
  </div>
</template>

<script setup>
/**
 * Компонент выбора периода (месяц и год)
 * 
 * Позволяет выбрать месяц и год для отображения табеля
 * Эмитит событие при изменении периода
 * 
 * Использует константы из constants.js
 */

import { ref, computed, onMounted } from 'vue';
import { getCurrentYear, getCurrentMonth } from '../utils/dateHelpers.js';
import { CONFIG, MONTHS } from '../utils/constants.js';

const props = defineProps({
  year: {
    type: Number,
    default: null
  },
  month: {
    type: Number,
    default: null
  }
});

const emit = defineEmits(['period-change']);

const selectedYear = ref(props.year || getCurrentYear());
const selectedMonth = ref(props.month || getCurrentMonth());

// Диапазон лет из констант
const yearsRange = computed(() => {
  const years = [];
  for (let year = CONFIG.MIN_YEAR; year <= CONFIG.MAX_YEAR; year++) {
    years.push(year);
  }
  return years;
});

// Валидация года
const validateYear = (year) => {
  return year >= CONFIG.MIN_YEAR && year <= CONFIG.MAX_YEAR;
};

// Валидация месяца
const validateMonth = (month) => {
  return month >= CONFIG.MIN_MONTH && month <= CONFIG.MAX_MONTH;
};

// Обработка изменения периода
const handlePeriodChange = () => {
  // Валидация
  if (!validateYear(selectedYear.value)) {
    console.error(`Год должен быть в диапазоне ${CONFIG.MIN_YEAR}-${CONFIG.MAX_YEAR}`);
    selectedYear.value = getCurrentYear();
    return;
  }
  
  if (!validateMonth(selectedMonth.value)) {
    console.error(`Месяц должен быть в диапазоне ${CONFIG.MIN_MONTH}-${CONFIG.MAX_MONTH}`);
    selectedMonth.value = getCurrentMonth();
    return;
  }
  
  // Эмит события с новым периодом
  emit('period-change', {
    year: selectedYear.value,
    month: selectedMonth.value
  });
};

// Синхронизация с props
onMounted(() => {
  if (props.year && validateYear(props.year)) {
    selectedYear.value = props.year;
  }
  if (props.month && validateMonth(props.month)) {
    selectedMonth.value = props.month;
  }
});
</script>

<style scoped>
/**
 * Стили компонента выбора периода
 * 
 * Соответствуют гайдлайнам Bitrix24
 */

.period-selector {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background-color: #f9f9f9;
  border-bottom: var(--border-width) solid var(--border-color);
  flex-wrap: wrap;
}

.label {
  font-weight: bold;
  color: #333;
  font-size: var(--font-size-md);
  white-space: nowrap;
}

.select {
  padding: var(--spacing-sm) var(--spacing-md);
  border: var(--border-width) solid var(--border-color);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  background-color: white;
  cursor: pointer;
  min-width: 150px;
  transition: border-color var(--transition-normal), box-shadow var(--transition-normal);
}

.select:hover {
  border-color: var(--color-primary);
}

.select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(47, 198, 246, 0.2);
}

/* Адаптивность */
@media (max-width: 768px) {
  .period-selector {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-sm);
  }
  
  .label {
    font-size: var(--font-size-sm);
  }
  
  .select {
    width: 100%;
    min-width: auto;
    font-size: var(--font-size-md);
  }
}
</style>

