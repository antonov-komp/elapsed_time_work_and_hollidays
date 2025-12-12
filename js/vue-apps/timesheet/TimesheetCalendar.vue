<template>
  <div class="timesheet-calendar">
    <Preloader :visible="store.isPreloaderVisible" />
    <SaveIndicator />
    
    <UserInfo />
    
    <div class="calendar-controls">
      <PeriodSelector
        :year="store.timesheet.year"
        :month="store.timesheet.month"
        @change="handlePeriodChange"
      />
      <FillWeekButton
        :year="store.timesheet.year"
        :month="store.timesheet.month"
        :holidays="store.getHolidays"
        :current-days="store.timesheet.days"
        @fill-week="handleFillWeek"
      />
    </div>
    
    <StatisticsBar />
    
    <CalendarGrid
      :year="store.timesheet.year"
      :month="store.timesheet.month"
      :timesheet-data="store.timesheet.days"
      :holidays="store.getHolidays"
      @cell-click="handleCellClick"
    />
    
    <EditDayModal
      v-if="store.isEditModalOpen && store.getEditModal.day"
      :visible="store.isEditModalOpen"
      :day="store.getEditModal.day"
      :day-data="selectedDayData"
      @save="handleSaveDay"
      @close="handleCloseModal"
    />
  </div>
</template>

<script setup>
/**
 * Корневой компонент табеля присутствия
 * 
 * Интегрирует все компоненты через Store:
 * - UserInfo - информация о пользователе
 * - PeriodSelector - выбор периода (месяц/год)
 * - FillWeekButton - заполнение недели
 * - StatisticsBar - статистика табеля
 * - CalendarGrid - календарная сетка
 * - EditDayModal - модальное окно редактирования дня
 * - Preloader - индикатор загрузки
 * - SaveIndicator - индикатор сохранения
 * 
 * Использует Pinia Store для управления состоянием всего приложения
 */

import { computed, onMounted, watch } from 'vue';
import { useTimesheetStore } from './stores/timesheetStore.js';

// Компоненты
import Preloader from './components/Preloader.vue';
import SaveIndicator from './components/SaveIndicator.vue';
import UserInfo from './components/UserInfo.vue';
import PeriodSelector from './components/PeriodSelector.vue';
import StatisticsBar from './components/StatisticsBar.vue';
import CalendarGrid from './components/CalendarGrid.vue';
import FillWeekButton from './components/FillWeekButton.vue';

// Модальное окно редактирования дня
// Временно отключаем ленивую загрузку из-за проблем с путями в production
// TODO: Включить ленивую загрузку после исправления путей в Vite
import EditDayModal from './components/EditDayModal.vue';

const store = useTimesheetStore();

/**
 * Данные выбранного дня для модального окна
 * 
 * Получает данные дня из Store на основе открытого модального окна
 */
const selectedDayData = computed(() => {
  const modal = store.getEditModal;
  if (modal.open && modal.day) {
    return store.timesheet.days[modal.day] || null;
  }
  return null;
});

/**
 * Обработка изменения периода
 * 
 * Загружает данные табеля и праздников для нового периода
 * 
 * @param {number} year - Год
 * @param {number} month - Месяц
 */
async function handlePeriodChange(year, month) {
  store.setPreloader(true);
  
  try {
    await Promise.all([
      store.loadTimesheet(year, month),
      store.loadHolidays(year)
    ]);
  } catch (error) {
    console.error('Ошибка загрузки данных при изменении периода:', error);
  } finally {
    store.setPreloader(false);
  }
}

/**
 * Обработка клика на ячейку календаря
 * 
 * Открывает модальное окно редактирования дня
 * 
 * @param {number} day - Номер дня
 * @param {Date} date - Дата дня
 * @param {Object|null} dayData - Данные дня (часы, статус)
 */
function handleCellClick(day, date, dayData) {
  // Логирование для отладки
  console.log('TimesheetCalendar.handleCellClick:', {
    day: day,
    date: date,
    dayData: dayData
  });
  
  store.openEditModal(day, store.timesheet.year, store.timesheet.month);
  
  // Логирование после открытия
  console.log('TimesheetCalendar.handleCellClick: модальное окно открыто', {
    isOpen: store.isEditModalOpen,
    modal: store.getEditModal
  });
}

/**
 * Обработка сохранения дня
 * 
 * Обновляет данные дня через Store (автосохранение сработает автоматически)
 * 
 * @param {Object} payload - Объект с полями day (номер дня) и dayData (данные дня)
 */
function handleSaveDay(payload) {
  // Поддержка старого формата (только dayData) для обратной совместимости
  let day, dayData;
  
  if (payload && typeof payload === 'object' && 'day' in payload && 'dayData' in payload) {
    // Новый формат: { day: number, dayData: { hours, status } }
    day = payload.day;
    dayData = payload.dayData;
  } else {
    // Старый формат: только dayData, день берём из модального окна
    dayData = payload;
    const modal = store.getEditModal;
    day = modal?.day;
    
    if (!day) {
      console.warn('TimesheetCalendar.handleSaveDay: день не указан', {
        payload: payload,
        modal: modal
      });
      return;
    }
  }
  
  // Валидация дня
  if (!day || day < 1 || day > 31) {
    console.error('TimesheetCalendar.handleSaveDay: неверный номер дня', day);
    return;
  }
  
  // Логирование для отладки
  console.log('TimesheetCalendar.handleSaveDay:', {
    day: day,
    dayData: dayData
  });
  
  // Обновляем данные дня
  store.updateDay(day, dayData);
  
  // Закрываем модальное окно
  store.closeEditModal();
}

/**
 * Обработка закрытия модального окна
 */
function handleCloseModal() {
  store.closeEditModal();
}

/**
 * Обработка заполнения недели
 * 
 * Обновляет дни через Store (автосохранение сработает автоматически)
 * 
 * @param {Object} days - Объект с данными дней для заполнения
 */
function handleFillWeek(days) {
  // Обновление дней через Store (автосохранение сработает автоматически)
  for (const day in days) {
    store.updateDay(parseInt(day), days[day]);
  }
}

/**
 * Инициализация приложения
 * 
 * Загружает все необходимые данные при монтировании компонента:
 * - Данные пользователя
 * - Данные табеля для текущего периода
 * - Праздники для текущего года
 */
onMounted(async () => {
  store.setPreloader(true);
  
  try {
    await Promise.all([
      store.loadUser(),
      store.loadTimesheet(store.timesheet.year, store.timesheet.month),
      store.loadHolidays(store.timesheet.year)
    ]);
  } catch (error) {
    console.error('Ошибка инициализации приложения:', error);
  } finally {
    store.setPreloader(false);
  }
});

/**
 * Отслеживание изменений периода для автоматической загрузки данных
 * 
 * Автоматически загружает данные табеля и праздников при изменении года или месяца
 */
watch(
  [() => store.timesheet.year, () => store.timesheet.month],
  async ([year, month], [oldYear, oldMonth]) => {
    // Загружаем только если период действительно изменился
    if (year !== oldYear || month !== oldMonth) {
      store.setPreloader(true);
      
      try {
        await Promise.all([
          store.loadTimesheet(year, month),
          store.loadHolidays(year)
        ]);
      } catch (error) {
        console.error('Ошибка загрузки данных при изменении периода:', error);
      } finally {
        store.setPreloader(false);
      }
    }
  }
);
</script>

<style>
/* Подключение общих CSS переменных */
@import './styles/variables.css';
</style>

<style scoped>
.timesheet-calendar {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-lg);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.calendar-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
  gap: 20px;
  flex-wrap: wrap;
}

/* Адаптивность для планшетов */
@media (max-width: 1024px) and (min-width: 769px) {
  .timesheet-calendar {
    padding: var(--spacing-md, 16px);
    max-width: 100%;
  }
  
  .calendar-controls {
    gap: var(--spacing-md, 16px);
  }
}

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
  .timesheet-calendar {
    padding: var(--spacing-sm, 8px);
    max-width: 100%;
  }
  
  .calendar-controls {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-sm, 8px);
  }
}

@media (max-width: 480px) {
  .timesheet-calendar {
    padding: var(--spacing-xs, 4px);
  }
}
</style>
