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
 * Улучшена стилизация согласно TASK-006-02
 */

.period-selector {
  display: flex;
  align-items: center;
  gap: var(--spacing-md, 16px);
  padding: var(--spacing-md, 16px);
  background-color: var(--color-bg-secondary, #f9f9f9);
  border: var(--border-width, 1px) solid var(--color-border, #ddd);
  border-radius: var(--border-radius-md, 4px);
  flex-wrap: wrap;
  box-shadow: var(--shadow-sm, 0 1px 2px rgba(0, 0, 0, 0.05));
}

.label {
  font-weight: 600;
  color: var(--color-text-primary, #333);
  font-size: var(--font-size-md, 14px);
  white-space: nowrap;
  user-select: none;
}

.select {
  padding: var(--spacing-sm, 8px) var(--spacing-md, 16px);
  border: var(--border-width, 1px) solid var(--color-border, #ddd);
  border-radius: var(--border-radius-md, 4px);
  font-size: var(--font-size-md, 14px);
  background-color: var(--color-bg-primary, #ffffff);
  color: var(--color-text-primary, #333);
  cursor: pointer;
  min-width: 150px;
  transition: all var(--transition-normal, 0.2s ease);
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right var(--spacing-sm, 8px) center;
  padding-right: calc(var(--spacing-md, 16px) + 20px);
}

.select:hover {
  border-color: var(--color-primary, #2fc6f6);
  box-shadow: var(--shadow-sm, 0 1px 2px rgba(0, 0, 0, 0.05));
}

.select:focus {
  outline: none;
  border-color: var(--color-primary, #2fc6f6);
  box-shadow: 0 0 0 3px rgba(47, 198, 246, 0.15);
}

.select:active {
  transform: scale(0.98);
}

/* Адаптивность */
@media (max-width: 768px) {
  .period-selector {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-sm, 8px);
    padding: var(--spacing-sm, 8px);
  }
  
  .label {
    font-size: var(--font-size-sm, 12px);
  }
  
  .select {
    width: 100%;
    min-width: auto;
    font-size: var(--font-size-md, 14px);
    min-height: 44px; /* Touch-оптимизация */
  }
}
</style>

