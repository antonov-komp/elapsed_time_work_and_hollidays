<template>
  <div class="statistics-bar">
    <div class="stat-item">
      <span class="stat-label">Часов всего:</span>
      <span class="stat-value">{{ formattedTotalHours }}</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">Рабочих дней:</span>
      <span class="stat-value">{{ store.workingDays }}</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">Неполных дней:</span>
      <span class="stat-value">{{ store.incompleteDays }}</span>
    </div>
    <div class="stat-item" v-if="store.statusDays > 0">
      <span class="stat-label">Дней со статусами:</span>
      <span class="stat-value">{{ store.statusDays }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useTimesheetStore } from '../stores/timesheetStore.js';

/**
 * Компонент статистики табеля присутствия
 * 
 * Отображает статистику по табелю:
 * - Сумма часов всего
 * - Сумма рабочих дней (дни с часами > 0)
 * - Сумма неполных дней (дни с часами < 8)
 * - Сумма дней со статусами
 * 
 * Использует getters из Store для реактивного обновления
 */

const store = useTimesheetStore();

/**
 * Форматированная сумма часов
 * 
 * Отображает часы с одним знаком после запятой
 */
const formattedTotalHours = computed(() => {
  return store.totalHours.toFixed(1);
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
  align-items: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 120px;
}

.stat-label {
  font-size: 12px;
  color: #666;
  font-weight: normal;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

/* Цвета для разных типов статистики */
.stat-item:nth-child(1) .stat-value {
  color: #2ecc71; /* Зелёный для часов */
}

.stat-item:nth-child(2) .stat-value {
  color: #3498db; /* Синий для рабочих дней */
}

.stat-item:nth-child(3) .stat-value {
  color: #f39c12; /* Оранжевый для неполных дней */
}

.stat-item:nth-child(4) .stat-value {
  color: #9b59b6; /* Фиолетовый для дней со статусами */
}

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
  .statistics-bar {
    gap: 15px;
    padding: 12px;
  }
  
  .stat-item {
    min-width: 100px;
    flex: 1 1 calc(50% - 15px);
  }
  
  .stat-label {
    font-size: 11px;
  }
  
  .stat-value {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .statistics-bar {
    flex-direction: column;
    gap: 10px;
  }
  
  .stat-item {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
