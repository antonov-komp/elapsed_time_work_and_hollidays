<template>
  <div class="calendar-grid">
    <div v-if="loading" class="loading">Загрузка данных...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="grid-container">
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
 * Загружает данные табеля и праздников
 * Определяет тип дня (рабочий, выходной, праздник)
 * 
 * Использует:
 * - TimesheetApiService для загрузки данных табеля
 * - HolidaysService для загрузки праздников
 * - dateHelpers для работы с датами
 */

import { ref, computed, watch, onMounted } from 'vue';
import CalendarCell from './CalendarCell.vue';
import { TimesheetApiService } from '../services/TimesheetApiService.js';
import { HolidaysService } from '../services/HolidaysService.js';
import { getDaysInMonth, isWeekend, formatDateForComparison } from '../utils/dateHelpers.js';
import { WEEKDAYS_SHORT } from '../utils/constants.js';

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
const timesheetData = ref({});
const holidays = ref([]);

// Генерация массива дней месяца
const daysArray = computed(() => {
  const days = [];
  const daysInMonth = getDaysInMonth(props.year, props.month);
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(props.year, props.month - 1, day);
    const dateStr = formatDateForComparison(date);
    const dayData = timesheetData.value[dateStr] || null;
    const isWeekendDay = isWeekend(date);
    
    days.push({
      dayNumber: day,
      date: date,
      dateStr: dateStr,
      dayData: dayData,
      isWeekend: isWeekendDay
    });
  }
  
  return days;
});

// Пустые ячейки до начала месяца (для выравнивания)
const emptyDaysBefore = computed(() => {
  const firstDay = new Date(props.year, props.month - 1, 1);
  const dayOfWeek = firstDay.getDay(); // 0 = воскресенье, 1 = понедельник, ..., 6 = суббота
  
  // Преобразуем в формат: 0 = понедельник, 6 = воскресенье
  const mondayBasedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  
  return mondayBasedDay;
});

// Загрузка данных табеля
const loadTimesheetData = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    const data = await TimesheetApiService.getTimesheet(props.year, props.month);
    
    // Преобразуем данные в формат { 'YYYY-MM-DD': { hours, status } }
    if (data && data.days) {
      timesheetData.value = data.days;
    } else {
      timesheetData.value = {};
    }
  } catch (e) {
    error.value = e.message || 'Ошибка загрузки данных табеля';
    console.error('CalendarGrid loadTimesheetData error:', e);
    timesheetData.value = {};
  } finally {
    loading.value = false;
  }
};

// Загрузка праздников
const loadHolidays = async () => {
  try {
    const holidaysData = await HolidaysService.getHolidays(props.year);
    holidays.value = holidaysData || [];
  } catch (e) {
    console.error('CalendarGrid loadHolidays error:', e);
    holidays.value = [];
  }
};

// Обработка клика по ячейке
const handleCellClick = (cellData) => {
  emit('cell-click', cellData);
};

// Загрузка данных при изменении года/месяца
watch([() => props.year, () => props.month], async () => {
  await Promise.all([
    loadTimesheetData(),
    loadHolidays()
  ]);
}, { immediate: false });

// Загрузка данных при монтировании
onMounted(async () => {
  await Promise.all([
    loadTimesheetData(),
    loadHolidays()
  ]);
});
</script>

<style scoped>
.calendar-grid {
  padding: 20px;
}

.loading,
.error {
  padding: 20px;
  text-align: center;
}

.error {
  color: #dc3545;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: #ddd;
  border: 1px solid #ddd;
}

.weekday-header {
  padding: 10px;
  background-color: #f5f5f5;
  font-weight: bold;
  text-align: center;
  font-size: 12px;
  color: #666;
  border-bottom: 2px solid #ddd;
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
</style>

