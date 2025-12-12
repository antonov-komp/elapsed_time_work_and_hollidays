<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="show" class="save-indicator" :class="indicatorClass">
        <span v-if="saving" class="indicator-content">
          <span class="spinner"></span>
          Сохранение...
        </span>
        <span v-else-if="saved" class="indicator-content">
          <span class="icon">✓</span>
          Сохранено
        </span>
        <span v-else-if="error" class="indicator-content">
          <span class="icon">✕</span>
          Ошибка сохранения
        </span>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, watch, ref } from 'vue';
import { useTimesheetStore } from '../stores/timesheetStore.js';

/**
 * Компонент индикатора сохранения
 * 
 * Отображает состояние сохранения данных табеля:
 * - Сохранение (saving)
 * - Сохранено (saved)
 * - Ошибка (error)
 */

const store = useTimesheetStore();

const saving = computed(() => store.timesheet.saving);
const error = computed(() => store.timesheet.error);
const lastSaved = computed(() => store.timesheet.lastSaved);

// Состояние "сохранено" показывается 2 секунды после успешного сохранения
const savedVisible = ref(false);
let savedTimeout = null;

watch(lastSaved, () => {
  if (lastSaved.value && !saving.value && !error.value) {
    savedVisible.value = true;
    
    // Скрываем через 2 секунды
    if (savedTimeout) {
      clearTimeout(savedTimeout);
    }
    savedTimeout = setTimeout(() => {
      savedVisible.value = false;
    }, 2000);
  }
});

watch(saving, (newVal) => {
  if (newVal) {
    savedVisible.value = false;
    if (savedTimeout) {
      clearTimeout(savedTimeout);
    }
  }
});

watch(error, (newVal) => {
  if (newVal) {
    savedVisible.value = false;
    if (savedTimeout) {
      clearTimeout(savedTimeout);
    }
  }
});

const saved = computed(() => savedVisible.value && !saving.value && !error.value);

const show = computed(() => saving.value || saved.value || error.value);

const indicatorClass = computed(() => {
  if (saving.value) return 'saving';
  if (saved.value) return 'saved';
  if (error.value) return 'error';
  return '';
});
</script>

<style scoped>
.save-indicator {
  position: fixed;
  bottom: var(--spacing-lg, 24px);
  right: var(--spacing-lg, 24px);
  padding: var(--spacing-sm, 8px) var(--spacing-md, 16px);
  background-color: var(--color-bg-primary, #fff);
  border: var(--border-width, 1px) solid var(--color-border, #ddd);
  border-radius: var(--border-radius-md, 6px);
  box-shadow: var(--shadow-lg, 0 4px 8px rgba(0, 0, 0, 0.15));
  font-size: var(--font-size-md, 14px);
  font-weight: 500;
  z-index: 9999;
  min-width: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-normal, 0.2s ease);
}

.save-indicator.saving {
  border-color: var(--color-primary, #2fc6f6);
  color: var(--color-primary, #2fc6f6);
  background-color: rgba(47, 198, 246, 0.05);
  animation: pulse 1.5s ease-in-out infinite;
}

.save-indicator.saved {
  border-color: var(--color-success, #9dcf00);
  color: var(--color-success, #9dcf00);
  background-color: rgba(157, 207, 0, 0.1);
  animation: successPulse 0.5s ease;
}

.save-indicator.error {
  border-color: var(--color-error, #ff5752);
  color: var(--color-error, #ff5752);
  background-color: rgba(255, 87, 82, 0.1);
  animation: errorShake 0.5s ease;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes successPulse {
  0% {
    transform: scale(0.9);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes errorShake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

.indicator-content {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(47, 198, 246, 0.3);
  border-top-color: var(--color-primary, #2fc6f6);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.icon {
  font-size: 16px;
  font-weight: bold;
  line-height: 1;
}

/* Анимации появления/исчезновения */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
  .save-indicator {
    bottom: 10px;
    right: 10px;
    left: 10px;
    min-width: auto;
    font-size: 13px;
    padding: 10px 15px;
  }
}
</style>


