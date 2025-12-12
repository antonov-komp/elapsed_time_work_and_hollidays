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
/**
 * Стили компонента статистики
 * 
 * Соответствуют гайдлайнам Bitrix24
 */

.statistics-bar {
  display: flex;
  gap: var(--spacing-lg);
  padding: var(--spacing-md);
  background-color: #f9f9f9;
  border-bottom: var(--border-width) solid var(--border-color);
  flex-wrap: wrap;
  align-items: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  min-width: 120px;
  transition: transform var(--transition-fast);
}

.stat-item:hover {
  transform: translateY(-2px);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: #666;
  font-weight: normal;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: var(--font-size-xl);
  font-weight: bold;
  color: #333;
  transition: color var(--transition-normal), transform var(--transition-fast);
  display: inline-block;
}

/* Анимация при изменении значения */
.stat-value {
  animation: valueChange 0.3s ease;
}

@keyframes valueChange {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

/* Цвета для разных типов статистики */
.stat-item:nth-child(1) .stat-value {
  color: var(--color-success); /* Зелёный для часов */
}

.stat-item:nth-child(2) .stat-value {
  color: var(--color-primary); /* Синий для рабочих дней */
}

.stat-item:nth-child(3) .stat-value {
  color: var(--color-warning); /* Оранжевый для неполных дней */
}

.stat-item:nth-child(4) .stat-value {
  color: #9b59b6; /* Фиолетовый для дней со статусами */
}

/* Адаптивность для мобильных устройств */
@media (max-width: 1024px) {
  .statistics-bar {
    gap: var(--spacing-md);
  }
}

@media (max-width: 768px) {
  .statistics-bar {
    gap: var(--spacing-md);
    padding: var(--spacing-sm);
  }
  
  .stat-item {
    min-width: 100px;
    flex: 1 1 calc(50% - var(--spacing-md));
  }
  
  .stat-label {
    font-size: var(--font-size-xs);
  }
  
  .stat-value {
    font-size: var(--font-size-lg);
  }
}

@media (max-width: 480px) {
  .statistics-bar {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .stat-item {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
