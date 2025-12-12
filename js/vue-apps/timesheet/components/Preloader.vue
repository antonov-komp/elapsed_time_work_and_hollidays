<template>
  <div v-if="visible" class="preloader-overlay">
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
}

.preloader-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

