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
 */

.user-info {
  padding: var(--spacing-md);
  background-color: #f5f5f5;
  border-bottom: var(--border-width) solid var(--border-color);
}

.user-data {
  font-size: var(--font-size-lg);
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.name {
  color: #333;
}

.separator {
  color: #999;
  font-weight: normal;
}

.position {
  color: #666;
  font-weight: normal;
}

.loading {
  color: #666;
  font-style: italic;
  font-size: var(--font-size-md);
}

.error {
  color: var(--color-error);
  font-size: var(--font-size-md);
}

/* Адаптивность */
@media (max-width: 768px) {
  .user-info {
    padding: var(--spacing-sm);
  }
  
  .user-data {
    font-size: var(--font-size-md);
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }
  
  .separator {
    display: none;
  }
}
</style>
