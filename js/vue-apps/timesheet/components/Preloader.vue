<template>
  <div v-show="visible" class="preloader-overlay">
    <div class="preloader-spinner"></div>
  </div>
</template>

<script setup>
/**
 * Компонент прелоадера
 * 
 * Отображает индикатор загрузки с overlay, блокирующим интерфейс
 */

defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
/**
 * Стили компонента прелоадера
 * 
 * Соответствуют гайдлайнам Bitrix24
 */

.preloader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: fadeIn var(--transition-slow);
}

.preloader-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(243, 243, 243, 0.3);
  border-top: 4px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  position: relative;
}

.preloader-spinner::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(47, 198, 246, 0.2) 0%, transparent 70%);
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes pulse {
  0%, 100% { 
    opacity: 0.5; 
    transform: scale(1); 
  }
  50% { 
    opacity: 1; 
    transform: scale(1.1); 
  }
}
</style>

