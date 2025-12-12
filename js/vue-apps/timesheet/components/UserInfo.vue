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
.user-info {
  padding: 15px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

.user-data {
  font-size: 16px;
  font-weight: bold;
}

.name {
  color: #333;
}

.separator {
  margin: 0 10px;
  color: #999;
}

.position {
  color: #666;
  font-weight: normal;
}

.loading {
  color: #666;
  font-style: italic;
}

.error {
  color: #dc3545;
  font-size: 14px;
}
</style>
