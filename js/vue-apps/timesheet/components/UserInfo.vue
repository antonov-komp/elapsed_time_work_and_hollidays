<template>
  <div class="user-info">
    <div v-if="store.user.loading" class="loading">Загрузка...</div>
    <div v-else-if="store.user.error" class="error">{{ store.user.error }}</div>
    <div v-else class="user-data">
      <span class="name">{{ fullName }}</span>
      <span v-if="store.user.position" class="separator">|</span>
      <span v-if="store.user.position" class="position">{{ store.user.position }}</span>
    </div>
  </div>
</template>

<script setup>
/**
 * Компонент информации о пользователе
 * 
 * Отображает ФИО и должность текущего пользователя из Bitrix24
 * Использует Store для получения данных пользователя
 * 
 * Метод Bitrix24 API: user.current
 * Документация: https://context7.com/bitrix24/rest/user.current
 */

import { computed } from 'vue';
import { useTimesheetStore } from '../stores/timesheetStore.js';

const store = useTimesheetStore();

/**
 * Полное имя пользователя
 * 
 * Формируется из данных пользователя в Store
 */
const fullName = computed(() => {
  if (store.user.name) {
    return store.user.name;
  }
  if (store.user.id) {
    return `Пользователь #${store.user.id}`;
  }
  return 'Пользователь';
});
</script>

<style scoped>
/**
 * Стили компонента информации о пользователе
 * 
 * Соответствуют гайдлайнам Bitrix24
 * Улучшена стилизация согласно TASK-006-02
 */

.user-info {
  padding: var(--spacing-md, 16px) var(--spacing-lg, 24px);
  background: linear-gradient(135deg, var(--color-bg-secondary, #f5f5f5) 0%, var(--color-header-bg, #f9f9f9) 100%);
  border-bottom: var(--border-width, 1px) solid var(--color-border, #ddd);
  box-shadow: var(--shadow-sm, 0 1px 2px rgba(0, 0, 0, 0.05));
}

.user-data {
  font-size: var(--font-size-lg, 16px);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm, 8px);
  color: var(--color-text-primary, #333);
}

.name {
  color: var(--color-text-primary, #333);
  font-weight: 700;
}

.separator {
  color: var(--color-text-muted, #999);
  font-weight: 400;
  margin: 0 var(--spacing-xs, 4px);
}

.position {
  color: var(--color-text-secondary, #666);
  font-weight: 500;
  font-size: var(--font-size-md, 14px);
}

.loading {
  color: var(--color-text-secondary, #666);
  font-style: italic;
  font-size: var(--font-size-md, 14px);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm, 8px);
}

.loading::before {
  content: '';
  width: 16px;
  height: 16px;
  border: 2px solid var(--color-border, #ddd);
  border-top-color: var(--color-primary, #2fc6f6);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error {
  color: var(--color-error, #ff5752);
  font-size: var(--font-size-md, 14px);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm, 8px);
}

.error::before {
  content: '⚠';
  font-size: var(--font-size-lg, 16px);
}

/* Адаптивность */
@media (max-width: 768px) {
  .user-info {
    padding: var(--spacing-sm, 8px) var(--spacing-md, 16px);
  }
  
  .user-data {
    font-size: var(--font-size-md, 14px);
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs, 4px);
  }
  
  .separator {
    display: none;
  }
  
  .position {
    font-size: var(--font-size-sm, 12px);
  }
}
</style>
