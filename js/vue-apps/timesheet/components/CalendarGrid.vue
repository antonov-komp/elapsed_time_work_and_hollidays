<template>
  <div class="calendar-grid">
    <div class="grid-container">
      <!-- Заголовки дней недели -->
      <div class="weekday-header" v-for="weekday in WEEKDAYS_SHORT" :key="weekday">
        {{ weekday }}
      </div>
      
      <!-- Пустые ячейки для дней до начала месяца -->
      <div 
        v-for="empty in emptyDaysBefore" 
        :key="`empty-before-${empty}`"
        class="calendar-cell empty"
      ></div>
      
      <!-- Ячейки дней месяца -->
      <CalendarCell
        v-for="day in daysArray"
        :key="`day-${day.dateStr}`"
        :day-number="day.dayNumber"
        :date="day.date"
        :day-data="day.dayData"
        :holidays="holidays"
        :is-weekend-day="day.isWeekend"
        @cell-click="handleCellClick"
      />
    </div>
  </div>
</template>

<script setup>
/**
 * Компонент календарной сетки
 * 
 * Отображает все дни месяца в виде сетки
 * Интегрирует CalendarCell для каждого дня
 * Получает данные табеля и праздников через props из Store
 * Определяет тип дня (рабочий, выходной, праздник)
 * 
 * Использует:
 * - dateHelpers для работы с датами
 * - Данные из Store через props
 */

import { computed } from 'vue';
import CalendarCell from './CalendarCell.vue';
import { getDaysInMonth, isWeekend, formatDateForComparison, isHoliday } from '../utils/dateHelpers.js';
import { WEEKDAYS_SHORT } from '../utils/constants.js';

const props = defineProps({
  /**
   * Год для отображения
   */
  year: {
    type: Number,
    required: true
  },
  /**
   * Месяц для отображения (1-12)
   */
  month: {
    type: Number,
    required: true
  },
  /**
   * Данные табеля (объект с ключами-днями в формате числа дня)
   * Структура: { 1: { hours: 8, status: null }, 2: { hours: 0, status: 'Больничный' }, ... }
   */
  timesheetData: {
    type: Object,
    default: () => ({})
  },
  /**
   * Массив праздников (массив дат в формате YYYY-MM-DD)
   */
  holidays: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['cell-click']);

/**
 * Генерация массива дней месяца
 * 
 * Создаёт массив объектов для каждого дня месяца с данными из табеля
 */
const daysArray = computed(() => {
  const days = [];
  const daysInMonth = getDaysInMonth(props.year, props.month);
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(props.year, props.month - 1, day);
    const dateStr = formatDateForComparison(date);
    const dayData = props.timesheetData[day] || null;
    const isWeekendDay = isWeekend(date);
    const isHolidayDay = isHoliday(date, props.holidays);
    
    days.push({
      dayNumber: day,
      date: date,
      dateStr: dateStr,
      dayData: dayData,
      isWeekend: isWeekendDay,
      isHoliday: isHolidayDay
    });
  }
  
  return days;
});

/**
 * Пустые ячейки до начала месяца (для выравнивания)
 * 
 * Вычисляет количество пустых ячеек для выравнивания первого дня месяца
 * с правильным днём недели (понедельник = 0, воскресенье = 6)
 */
const emptyDaysBefore = computed(() => {
  const firstDay = new Date(props.year, props.month - 1, 1);
  const dayOfWeek = firstDay.getDay(); // 0 = воскресенье, 1 = понедельник, ..., 6 = суббота
  
  // Преобразуем в формат: 0 = понедельник, 6 = воскресенье
  const mondayBasedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  
  return mondayBasedDay;
});

/**
 * Обработка клика по ячейке
 * 
 * Эмитит событие с данными дня для открытия модального окна редактирования
 * 
 * @param {Object} cellData - Данные ячейки (dayNumber, date, dayData)
 */
function handleCellClick(cellData) {
  emit('cell-click', cellData.dayNumber, cellData.date, cellData.dayData);
}
</script>

<style scoped>
.calendar-grid {
  padding: 20px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: #ddd;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.weekday-header {
  padding: 10px;
  background-color: #f5f5f5;
  font-weight: bold;
  text-align: center;
  font-size: 12px;
  color: #666;
  border-bottom: 2px solid #ddd;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.calendar-cell.empty {
  background-color: #fafafa;
  min-height: 80px;
  cursor: default;
}

.calendar-cell.empty:hover {
  background-color: #fafafa;
  border-color: #ddd;
}

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
  .calendar-grid {
    padding: 10px;
  }
  
  .grid-container {
    gap: 0;
  }
  
  .weekday-header {
    padding: 8px 4px;
    font-size: 11px;
  }
}
</style>
