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
 * Использует цветовую схему из констант COLORS
 * Соответствует гайдлайнам Bitrix24
 */

.calendar-cell {
  min-height: 80px;
  padding: 8px;
  border: 1px solid #ddd;
  background-color: #ffffff;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 4px;
  position: relative;
}

.calendar-cell:hover {
  background-color: #f0f0f0;
  border-color: #3498db;
  transform: scale(1.02);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Touch-оптимизация для мобильных */
@media (max-width: 768px) {
  .calendar-cell {
    min-height: 60px; /* Увеличено для touch */
    padding: var(--spacing-xs);
  }
  
  .calendar-cell:hover {
    transform: none; /* Отключаем hover-эффекты на touch-устройствах */
  }
  
  .calendar-cell:active {
    background-color: #e0e0e0;
    transform: scale(0.98);
  }
  
  .day-number {
    font-size: var(--font-size-sm);
  }
  
  .day-value {
    font-size: var(--font-size-xs);
  }
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
  font-weight: 500;
}

/* Рабочий день (по умолчанию) */
.calendar-cell {
  background-color: #ffffff; /* COLORS.WORKDAY */
}

/* Сегодняшний день - яркое выделение */
.calendar-cell.today {
  background-color: #e3f2fd; /* COLORS.TODAY */
  border: 2px solid #2196f3;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
  font-weight: bold;
}

.calendar-cell.today .day-number {
  color: #1976d2;
  font-weight: bold;
  font-size: 15px;
}

.calendar-cell.today::before {
  content: '';
  position: absolute;
  top: 4px;
  right: 4px;
  width: 6px;
  height: 6px;
  background-color: #2196f3;
  border-radius: 50%;
}

/* Выходной день */
.calendar-cell.weekend {
  background-color: #f0f0f0; /* COLORS.WEEKEND */
}

.calendar-cell.weekend .day-number {
  color: #999;
}

/* Праздничный день */
.calendar-cell.holiday {
  background-color: #ffebee; /* COLORS.HOLIDAY */
}

.calendar-cell.holiday .day-number {
  color: #c62828;
  font-weight: bold;
}

/* День с заполненными часами */
.calendar-cell.has-hours {
  background-color: #e8f5e9; /* COLORS.FILLED */
}

.calendar-cell.has-hours .day-value {
  color: #2e7d32;
  font-weight: bold;
  font-size: 13px;
}

/* Неполный день */
.calendar-cell.incomplete {
  background-color: #fff9c4; /* COLORS.INCOMPLETE */
}

.calendar-cell.incomplete .day-value {
  color: #f57f17;
  font-weight: bold;
  font-size: 12px;
}

/* День со статусом */
.calendar-cell.has-status {
  background-color: #fff3e0; /* COLORS.STATUS */
}

.calendar-cell.has-status .day-value {
  color: #e65100;
  font-weight: bold;
  font-size: 11px;
  text-align: center;
  padding: 2px 4px;
  background-color: rgba(230, 81, 0, 0.1);
  border-radius: 3px;
}

/* Специфичные цвета для разных статусов */
.calendar-cell.has-status[data-status="Больничный"] {
  background-color: #ffcdd2;
}

.calendar-cell.has-status[data-status="Командировка"] {
  background-color: #c8e6c9;
}

.calendar-cell.has-status[data-status="Отпуск календарный"] {
  background-color: #b3e5fc;
}

.calendar-cell.has-status[data-status="Отпуск за свой счёт"] {
  background-color: #fff9c4;
}
</style>

