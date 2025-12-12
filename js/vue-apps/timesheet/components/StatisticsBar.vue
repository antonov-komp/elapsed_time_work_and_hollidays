<template>
  <div class="statistics-bar">
    <div class="stat-item">
      <span class="stat-label">Всего часов:</span>
      <span class="stat-value">{{ totalHours }}</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">Рабочих дней:</span>
      <span class="stat-value">{{ workingDays }}</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">Неполных дней:</span>
      <span class="stat-value">{{ incompleteDays }}</span>
    </div>
    <div class="stat-item" v-if="statusDaysCount > 0">
      <span class="stat-label">Дней со статусами:</span>
      <span class="stat-value">{{ statusDaysCount }}</span>
    </div>
  </div>
</template>

<script setup>
/**
 * Компонент статистики
 * 
 * Отображает статистику по табелю:
 * - Сумма часов всего
 * - Сумма рабочих дней (дни с часами > 0)
 * - Сумма неполных дней (дни с часами < 8)
 * - Сумма дней со статусами
 * 
 * Реактивно обновляется при изменении данных табеля
 */

import { computed } from 'vue';
import { CONFIG } from '../utils/constants.js';

const props = defineProps({
  /**
   * Данные табеля (объект с ключами-датами в формате YYYY-MM-DD)
   * Структура: { '2025-12-01': { hours: 8, status: null }, ... }
   */
  timesheetData: {
    type: Object,
    default: () => ({})
  }
});

// Сумма часов всего
const totalHours = computed(() => {
  if (!props.timesheetData || typeof props.timesheetData !== 'object') {
    return 0;
  }
  
  let total = 0;
  Object.values(props.timesheetData).forEach(day => {
    if (day && typeof day.hours === 'number' && day.hours > 0) {
      total += day.hours;
    }
  });
  
  return total.toFixed(1);
});

// Сумма рабочих дней (дни с часами > 0)
const workingDays = computed(() => {
  if (!props.timesheetData || typeof props.timesheetData !== 'object') {
    return 0;
  }
  
  let count = 0;
  Object.values(props.timesheetData).forEach(day => {
    if (day && typeof day.hours === 'number' && day.hours > 0) {
      count++;
    }
  });
  
  return count;
});

// Сумма неполных дней (дни с часами < 8 и > 0)
const incompleteDays = computed(() => {
  if (!props.timesheetData || typeof props.timesheetData !== 'object') {
    return 0;
  }
  
  let count = 0;
  Object.values(props.timesheetData).forEach(day => {
    if (day && 
        typeof day.hours === 'number' && 
        day.hours > 0 && 
        day.hours < CONFIG.STANDARD_HOURS &&
        !day.status) { // Не считаем дни со статусами
      count++;
    }
  });
  
  return count;
});

// Сумма дней со статусами
const statusDaysCount = computed(() => {
  if (!props.timesheetData || typeof props.timesheetData !== 'object') {
    return 0;
  }
  
  let count = 0;
  Object.values(props.timesheetData).forEach(day => {
    if (day && day.status && day.status.trim() !== '') {
      count++;
    }
  });
  
  return count;
});
</script>

<style scoped>
.statistics-bar {
  display: flex;
  gap: 30px;
  padding: 15px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #ddd;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stat-label {
  font-size: 12px;
  color: #666;
  font-weight: normal;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}
</style>

