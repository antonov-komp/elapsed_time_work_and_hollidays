<template>
  <button
    @click="handleFillWeek"
    :disabled="loading"
    class="fill-week-button"
    type="button"
  >
    <span v-if="loading" class="button-text">
      <span class="spinner"></span>
      Заполнение...
    </span>
    <span v-else class="button-text">Заполнить неделю</span>
  </button>
</template>

<script setup>
import { ref } from 'vue';
import { getCurrentWeek, isWeekend, isHoliday, formatDateForComparison } from '../utils/dateHelpers.js';
import { CONFIG } from '../utils/constants.js';

/**
 * Компонент кнопки "Заполнить неделю"
 * 
 * Props:
 * - year: number - год
 * - month: number - месяц (1-12)
 * - holidays: Array - массив праздников (формат "YYYY-MM-DD")
 * - currentDays: Object - текущие данные дней (опционально)
 * 
 * Emits:
 * - fill-week(days) - при заполнении недели (объект с данными дней)
 */

const props = defineProps({
  year: {
    type: Number,
    required: true
  },
  month: {
    type: Number,
    required: true
  },
  holidays: {
    type: Array,
    default: () => []
  },
  currentDays: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['fill-week']);

const loading = ref(false);

/**
 * Обработка заполнения недели
 */
function handleFillWeek() {
  try {
    // Получаем текущую неделю (понедельник-воскресенье)
    const week = getCurrentWeek();
    const daysToFill = {};
    
    // Определяем границы текущего месяца
    const monthStart = new Date(props.year, props.month - 1, 1);
    const monthEnd = new Date(props.year, props.month, 0); // Последний день месяца
    
    // Находим пересечение недели с текущим месяцем
    const weekStart = week.monday > monthStart ? week.monday : monthStart;
    const weekEnd = week.sunday < monthEnd ? week.sunday : monthEnd;
    
    // Проходим по всем дням недели в текущем месяце
    for (let date = new Date(weekStart); date <= weekEnd; date.setDate(date.getDate() + 1)) {
      const day = date.getDate();
      const dateStr = formatDateForComparison(date);
      
      // Пропускаем выходные дни
      if (isWeekend(date)) {
        continue;
      }
      
      // Пропускаем праздничные дни
      if (isHoliday(date, props.holidays)) {
        continue;
      }
      
      // Пропускаем дни, которые уже имеют статус (не перезаписываем статусы)
      const existingDay = props.currentDays[day];
      if (existingDay && existingDay.status) {
        continue;
      }
      
      // Заполняем рабочий день стандартным количеством часов
      daysToFill[day] = {
        hours: CONFIG.STANDARD_HOURS,
        status: null
      };
    }
    
    // Проверка, есть ли дни для заполнения
    const daysCount = Object.keys(daysToFill).length;
    if (daysCount === 0) {
      alert('Нет рабочих дней для заполнения в текущей неделе');
      return;
    }
    
    // Подтверждение действия
    const daysWord = daysCount === 1 ? 'день' : daysCount < 5 ? 'дня' : 'дней';
    const confirmMessage = `Заполнить ${daysCount} рабочи${daysWord} по ${CONFIG.STANDARD_HOURS} часов?`;
    
    if (!confirm(confirmMessage)) {
      return;
    }
    
    // Emit события с данными
    loading.value = true;
    emit('fill-week', daysToFill);
    
    // Сбрасываем loading после небольшой задержки (для визуального эффекта)
    setTimeout(() => {
      loading.value = false;
    }, 300);
    
  } catch (error) {
    console.error('Ошибка при заполнении недели:', error);
    alert('Произошла ошибка при заполнении недели');
    loading.value = false;
  }
}
</script>

<style scoped>
.fill-week-button {
  padding: 10px 20px;
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, opacity 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 150px;
}

.fill-week-button:hover:not(:disabled) {
  background-color: #2980b9;
}

.fill-week-button:active:not(:disabled) {
  transform: translateY(1px);
}

.fill-week-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

.button-text {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
  .fill-week-button {
    width: 100%;
    padding: 12px 20px;
    font-size: 16px;
  }
}
</style>
