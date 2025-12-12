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
.period-selector {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #ddd;
}

.label {
  font-weight: bold;
  color: #333;
  font-size: 14px;
}

.select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  min-width: 150px;
}

.select:hover {
  border-color: #3498db;
}

.select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}
</style>

