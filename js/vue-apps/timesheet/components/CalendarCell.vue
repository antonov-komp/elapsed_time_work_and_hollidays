<template>
  <div 
    :class="cellClasses"
    @click="handleClick"
    class="calendar-cell"
  >
    <div class="day-number">{{ dayNumber }}</div>
    <div v-if="displayValue" class="day-value">
      {{ displayValue }}
    </div>
  </div>
</template>

<script setup>
/**
 * Компонент ячейки дня календаря
 * 
 * Отображает день месяца с визуальным выделением:
 * - Сегодняшний день
 * - Выходные дни
 * - Праздничные дни
 * - Дни с часами или статусами
 * 
 * Использует утилиты dateHelpers и константы
 */

import { computed } from 'vue';
import { isToday, isWeekend, isHoliday } from '../utils/dateHelpers.js';
import { COLORS, CONFIG } from '../utils/constants.js';

const props = defineProps({
  /**
   * Номер дня (1-31)
   */
  dayNumber: {
    type: Number,
    required: true
  },
  /**
   * Дата дня (Date объект или строка)
   */
  date: {
    type: [Date, String],
    required: true
  },
  /**
   * Данные дня из табеля { hours: number, status: string }
   */
  dayData: {
    type: Object,
    default: null
  },
  /**
   * Массив праздников в формате YYYY-MM-DD
   */
  holidays: {
    type: Array,
    default: () => []
  },
  /**
   * Является ли день выходным (суббота, воскресенье)
   */
  isWeekendDay: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['cell-click']);

// Определение типа дня
const isTodayDay = computed(() => isToday(props.date));
const isHolidayDay = computed(() => isHoliday(props.date, props.holidays));
const isWeekendDayComputed = computed(() => {
  return props.isWeekendDay || isWeekend(props.date);
});

// Значение для отображения (часы или статус)
const displayValue = computed(() => {
  if (!props.dayData) {
    return null;
  }
  
  // Если есть статус, показываем его
  if (props.dayData.status && props.dayData.status.trim() !== '') {
    return props.dayData.status;
  }
  
  // Если есть часы, показываем их
  if (typeof props.dayData.hours === 'number' && props.dayData.hours > 0) {
    return `${props.dayData.hours}ч`;
  }
  
  return null;
});

// Классы для стилизации
const cellClasses = computed(() => {
  const classes = [];
  
  // Сегодняшний день
  if (isTodayDay.value) {
    classes.push('today');
  }
  
  // Выходной день
  if (isWeekendDayComputed.value) {
    classes.push('weekend');
  }
  
  // Праздничный день
  if (isHolidayDay.value) {
    classes.push('holiday');
  }
  
  // День с данными
  if (props.dayData) {
    if (props.dayData.status && props.dayData.status.trim() !== '') {
      classes.push('has-status');
    } else if (typeof props.dayData.hours === 'number' && props.dayData.hours > 0) {
      classes.push('has-hours');
      
      // Неполный день
      if (props.dayData.hours < CONFIG.STANDARD_HOURS) {
        classes.push('incomplete');
      }
    }
  }
  
  return classes;
});

// Обработка клика
const handleClick = () => {
  emit('cell-click', {
    day: props.dayNumber,
    date: props.date,
    dayData: props.dayData
  });
};
</script>

<style scoped>
.calendar-cell {
  min-height: 80px;
  padding: 8px;
  border: 1px solid #ddd;
  background-color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.calendar-cell:hover {
  background-color: #f0f0f0;
  border-color: #3498db;
}

.day-number {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.day-value {
  font-size: 12px;
  color: #666;
  margin-top: auto;
}

/* Сегодняшний день */
.calendar-cell.today {
  background-color: #e3f2fd;
  border-color: #2196f3;
  border-width: 2px;
}

.calendar-cell.today .day-number {
  color: #1976d2;
  font-weight: bold;
}

/* Выходной день */
.calendar-cell.weekend {
  background-color: #f0f0f0;
}

.calendar-cell.weekend .day-number {
  color: #999;
}

/* Праздничный день */
.calendar-cell.holiday {
  background-color: #ffebee;
}

.calendar-cell.holiday .day-number {
  color: #c62828;
}

/* День с часами */
.calendar-cell.has-hours {
  background-color: #e8f5e9;
}

.calendar-cell.has-hours .day-value {
  color: #2e7d32;
  font-weight: bold;
}

/* Неполный день */
.calendar-cell.incomplete {
  background-color: #fff9c4;
}

.calendar-cell.incomplete .day-value {
  color: #f57f17;
}

/* День со статусом */
.calendar-cell.has-status {
  background-color: #fff3e0;
}

.calendar-cell.has-status .day-value {
  color: #e65100;
  font-weight: bold;
  font-size: 11px;
}
</style>

