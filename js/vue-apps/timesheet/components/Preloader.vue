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
  background-color: rgba(0, 0, 0, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: fadeIn var(--transition-slow, 0.3s ease);
  backdrop-filter: blur(2px);
}

.preloader-spinner {
  width: 56px;
  height: 56px;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top: 4px solid var(--color-primary, #2fc6f6);
  border-right: 4px solid var(--color-primary, #2fc6f6);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  position: relative;
  box-shadow: 0 0 20px rgba(47, 198, 246, 0.3);
}

.preloader-spinner::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(47, 198, 246, 0.3) 0%, transparent 70%);
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

