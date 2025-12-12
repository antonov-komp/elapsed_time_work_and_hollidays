<template>
  <div 
    :class="cellClasses"
    :data-status="props.dayData?.status || null"
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
/**
 * Стили ячейки календаря
 * 
 * Использует цветовую схему из CSS переменных
 * Соответствует гайдлайнам Bitrix24
 * Улучшена стилизация согласно TASK-006-01
 */

.calendar-cell {
  min-height: 80px;
  padding: var(--spacing-sm, 8px);
  border: var(--border-width, 1px) solid var(--color-border, #ddd);
  background-color: var(--color-workday, #ffffff);
  cursor: pointer;
  transition: background-color var(--transition-slow, 0.3s ease), 
              border-color var(--transition-normal, 0.2s ease),
              transform var(--transition-fast, 0.15s ease), 
              box-shadow var(--transition-normal, 0.2s ease);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: var(--border-radius-md, 4px);
  position: relative;
  user-select: none;
}

.calendar-cell:hover {
  background-color: var(--color-bg-secondary, #f0f0f0);
  border-color: var(--color-primary, #2fc6f6);
  transform: scale(1.02);
  box-shadow: var(--shadow-md, 0 2px 4px rgba(0, 0, 0, 0.1));
  z-index: 1;
}

.calendar-cell:active {
  transform: scale(0.98);
}

.day-number {
  font-size: var(--font-size-md, 14px);
  font-weight: 600;
  color: var(--color-text-primary, #333);
  margin-bottom: var(--spacing-xs, 4px);
  line-height: 1.2;
}

.day-value {
  font-size: var(--font-size-sm, 12px);
  color: var(--color-text-secondary, #666);
  margin-top: auto;
  font-weight: 500;
  line-height: 1.3;
  word-break: break-word;
  text-align: center;
}

/* Рабочий день (по умолчанию) */
.calendar-cell {
  background-color: var(--color-workday, #ffffff);
}

/* Сегодняшний день - яркое выделение */
.calendar-cell.today {
  background-color: var(--color-today, #e3f2fd);
  border: 2px solid var(--color-info, #2196f3);
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.25), var(--shadow-md, 0 2px 4px rgba(0, 0, 0, 0.1));
  font-weight: bold;
  z-index: 2;
}

.calendar-cell.today .day-number {
  color: var(--color-info, #1976d2);
  font-weight: 700;
  font-size: var(--font-size-lg, 16px);
}

.calendar-cell.today::before {
  content: '';
  position: absolute;
  top: 6px;
  right: 6px;
  width: 8px;
  height: 8px;
  background-color: var(--color-info, #2196f3);
  border-radius: 50%;
  box-shadow: 0 0 4px rgba(33, 150, 243, 0.5);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

.calendar-cell.today:hover {
  transform: scale(1.03);
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.3), var(--shadow-lg, 0 4px 8px rgba(0, 0, 0, 0.15));
}

/* Выходной день */
.calendar-cell.weekend {
  background-color: var(--color-weekend, #f0f0f0);
}

.calendar-cell.weekend .day-number {
  color: var(--color-text-muted, #999);
}

/* Праздничный день */
.calendar-cell.holiday {
  background-color: var(--color-holiday, #ffebee);
  border-color: var(--color-error, #ff5752);
}

.calendar-cell.holiday .day-number {
  color: var(--color-error, #c62828);
  font-weight: 700;
}

/* День с заполненными часами */
.calendar-cell.has-hours {
  background-color: var(--color-filled, #e8f5e9);
  border-color: var(--color-success, #9dcf00);
}

.calendar-cell.has-hours .day-value {
  color: var(--color-success, #2e7d32);
  font-weight: 600;
  font-size: var(--font-size-md, 14px);
}

/* Неполный день */
.calendar-cell.incomplete {
  background-color: var(--color-incomplete, #fff9c4);
  border-color: var(--color-warning, #ffa726);
}

.calendar-cell.incomplete .day-value {
  color: var(--color-warning, #f57f17);
  font-weight: 600;
  font-size: var(--font-size-sm, 12px);
}

/* День со статусом */
.calendar-cell.has-status {
  background-color: var(--color-status, #fff3e0);
  border-color: var(--color-warning, #ffa726);
}

.calendar-cell.has-status .day-value {
  color: var(--color-warning, #e65100);
  font-weight: 600;
  font-size: var(--font-size-xs, 11px);
  text-align: center;
  padding: 3px 6px;
  background-color: rgba(230, 81, 0, 0.15);
  border-radius: var(--border-radius-sm, 3px);
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Специфичные цвета для разных статусов */
.calendar-cell.has-status[data-status="Больничный"] {
  background-color: var(--color-status-sick, #ffcdd2);
  border-color: var(--color-error, #ff5752);
}

.calendar-cell.has-status[data-status="Командировка"] {
  background-color: var(--color-status-business-trip, #c8e6c9);
  border-color: var(--color-success, #9dcf00);
}

.calendar-cell.has-status[data-status="Отпуск календарный"] {
  background-color: var(--color-status-vacation, #b3e5fc);
  border-color: var(--color-info, #2196f3);
}

.calendar-cell.has-status[data-status="Отпуск за свой счёт"] {
  background-color: var(--color-status-unpaid-vacation, #fff9c4);
  border-color: var(--color-warning, #ffa726);
}

/* Touch-оптимизация для мобильных */
@media (max-width: 768px) {
  .calendar-cell {
    min-height: 60px; /* Увеличено для touch */
    padding: var(--spacing-xs, 4px);
  }
  
  .calendar-cell:hover {
    transform: none; /* Отключаем hover-эффекты на touch-устройствах */
    box-shadow: none;
  }
  
  .calendar-cell:active {
    background-color: var(--color-bg-secondary, #e0e0e0);
    transform: scale(0.97);
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .day-number {
    font-size: var(--font-size-sm, 12px);
  }
  
  .day-value {
    font-size: var(--font-size-xs, 11px);
  }
  
  .calendar-cell.today::before {
    width: 6px;
    height: 6px;
    top: 4px;
    right: 4px;
  }
}
</style>

