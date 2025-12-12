<template>
  <div class="user-info">
    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="user-data">
      <span class="name">{{ fullName }}</span>
      <span v-if="position" class="separator">|</span>
      <span v-if="position" class="position">{{ position }}</span>
    </div>
  </div>
</template>

<script setup>
/**
 * Компонент информации о пользователе
 * 
 * Отображает ФИО и должность текущего пользователя из Bitrix24
 * Использует Bitrix24ApiService для получения данных
 * 
 * Метод Bitrix24 API: user.current
 * Документация: https://context7.com/bitrix24/rest/user.current
 */

import { ref, onMounted } from 'vue';
import { Bitrix24ApiService } from '../services/Bitrix24ApiService.js';

const loading = ref(true);
const error = ref(null);
const fullName = ref('');
const position = ref('');

onMounted(async () => {
  try {
    loading.value = true;
    error.value = null;
    
    const user = await Bitrix24ApiService.getCurrentUser();
    
    // Формирование ФИО из LAST_NAME, NAME, SECOND_NAME
    const nameParts = [
      user.LAST_NAME,
      user.NAME,
      user.SECOND_NAME
    ].filter(Boolean);
    
    fullName.value = nameParts.length > 0 
      ? nameParts.join(' ') 
      : `Пользователь #${user.ID}`;
    
    position.value = user.WORK_POSITION || '';
  } catch (e) {
    error.value = e.message || 'Ошибка загрузки данных пользователя';
    console.error('UserInfo component error:', e);
  } finally {
    loading.value = false;
  }
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

