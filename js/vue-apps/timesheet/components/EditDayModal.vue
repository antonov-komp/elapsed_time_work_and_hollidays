<template>
  <Teleport to="body">
    <div 
      v-if="visible" 
      class="modal-overlay" 
      @click="handleOverlayClick"
      @keydown.esc="handleClose"
    >
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Редактирование дня {{ day }}</h3>
          <button class="close-button" @click="handleClose" aria-label="Закрыть">×</button>
        </div>
        
        <form @submit.prevent="handleSave" class="modal-form">
          <div class="form-group">
            <label for="hours">Часы:</label>
            <input
              id="hours"
              v-model.number="localHours"
              type="number"
              step="0.5"
              min="0"
              max="24"
              :disabled="hasStatus"
              @input="validateHoursInput"
              class="form-input"
              :class="{ 'error': hoursError }"
            />
            <span v-if="hoursError" class="error-message">{{ hoursError }}</span>
          </div>
          
          <div class="form-group">
            <label for="status">Статус:</label>
            <select
              id="status"
              v-model="localStatus"
              :disabled="hasHours"
              @change="validateStatusInput"
              class="form-select"
              :class="{ 'error': statusError }"
            >
              <option :value="null">Нет</option>
              <option v-for="status in statuses" :key="status" :value="status">
                {{ status }}
              </option>
            </select>
            <span v-if="statusError" class="error-message">{{ statusError }}</span>
          </div>
          
          <div class="form-actions">
            <button 
              type="submit" 
              :disabled="!isValid" 
              class="btn-primary"
            >
              Сохранить
            </button>
            <button 
              type="button" 
              @click="handleClose" 
              class="btn-secondary"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { validateHours, validateStatus, validateDayEntry } from '../utils/validation.js';
import { STATUSES_ARRAY } from '../utils/constants.js';

/**
 * Компонент модального окна редактирования дня
 * 
 * Props:
 * - visible: boolean - видимость модального окна
 * - day: number - номер дня
 * - dayData: Object - данные дня {hours, status}
 * 
 * Emits:
 * - save(dayData) - при сохранении данных
 * - close() - при закрытии модального окна
 */

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  day: {
    type: Number,
    required: true
  },
  dayData: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['save', 'close']);

const statuses = STATUSES_ARRAY;

const localHours = ref(props.dayData?.hours || 0);
const localStatus = ref(props.dayData?.status || null);
const hoursError = ref(null);
const statusError = ref(null);

const hasHours = computed(() => localHours.value > 0);
const hasStatus = computed(() => localStatus.value !== null);

const isValid = computed(() => {
  return !hoursError.value && !statusError.value;
});

// Сброс данных при открытии модального окна
watch(() => props.visible, (newVal) => {
  if (newVal) {
    localHours.value = props.dayData?.hours || 0;
    localStatus.value = props.dayData?.status || null;
    hoursError.value = null;
    statusError.value = null;
  }
});

// Валидация часов
function validateHoursInput() {
  if (hasStatus.value) {
    localHours.value = 0;
    hoursError.value = null;
    return;
  }
  
  const errors = validateHours(localHours.value);
  if (errors.length > 0) {
    hoursError.value = errors[0]; // Показываем первую ошибку
  } else {
    hoursError.value = null;
  }
  
  // Проверка бизнес-правила: часы и статус не одновременно
  validateDayEntryRule();
}

// Валидация статуса
function validateStatusInput() {
  if (hasHours.value) {
    localStatus.value = null;
    statusError.value = null;
    return;
  }
  
  const errors = validateStatus(localStatus.value);
  if (errors.length > 0) {
    statusError.value = errors[0]; // Показываем первую ошибку
  } else {
    statusError.value = null;
  }
  
  // Проверка бизнес-правила: часы и статус не одновременно
  validateDayEntryRule();
}

// Проверка бизнес-правила: часы и статус не одновременно
function validateDayEntryRule() {
  const dayEntry = {
    hours: localHours.value,
    status: localStatus.value
  };
  
  const errors = validateDayEntry(dayEntry);
  
  // Если есть ошибка о том, что часы и статус одновременно
  const conflictError = errors.find(err => err.includes('одновременно'));
  if (conflictError) {
    if (hasHours.value) {
      statusError.value = conflictError;
    } else if (hasStatus.value) {
      hoursError.value = conflictError;
    }
  }
}

// Обработка сохранения
function handleSave() {
  // Финальная валидация перед сохранением
  validateHoursInput();
  validateStatusInput();
  
  if (!isValid.value) {
    return;
  }
  
  const dayData = {
    hours: hasStatus.value ? 0 : localHours.value,
    status: hasHours.value ? null : localStatus.value
  };
  
  emit('save', dayData);
  handleClose();
}

// Обработка закрытия
function handleClose() {
  emit('close');
}

// Обработка клика на overlay
function handleOverlayClick(event) {
  if (event.target === event.currentTarget) {
    handleClose();
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  animation: fadeIn var(--transition-normal);
  backdrop-filter: blur(2px);
}

.modal-content {
  background-color: #fff;
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  min-width: 400px;
  max-width: 90%;
  max-height: 90%;
  overflow-y: auto;
  animation: slideIn var(--transition-slow);
  box-shadow: var(--shadow-lg);
  transform-origin: center;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ddd;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.close-button:hover {
  color: #333;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.form-input,
.form-select {
  padding: var(--spacing-sm);
  border: var(--border-width) solid var(--border-color);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  transition: border-color var(--transition-normal), box-shadow var(--transition-normal);
  min-height: 44px; /* Touch-оптимизация */
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(47, 198, 246, 0.2);
}

.form-input:disabled,
.form-select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.6;
}

.form-input.error,
.form-select.error {
  border-color: var(--color-error);
}

.error-message {
  color: var(--color-error);
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-xs);
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 10px;
}

.btn-primary,
.btn-secondary {
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  cursor: pointer;
  transition: background-color var(--transition-normal), opacity var(--transition-normal);
  font-weight: 500;
  min-height: 44px; /* Touch-оптимизация */
}

.btn-primary {
  background-color: var(--color-primary);
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
}

.btn-primary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-secondary {
  background-color: #e0e0e0;
  color: #333;
}

.btn-secondary:hover {
  background-color: #d0d0d0;
}

@keyframes fadeIn {
  from { 
    opacity: 0; 
  }
  to { 
    opacity: 1; 
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Адаптивность для планшетов */
@media (max-width: 1024px) and (min-width: 769px) {
  .modal-content {
    min-width: 350px;
    max-width: 85%;
  }
}

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
  .modal-content {
    min-width: auto;
    width: 100%;
    max-width: 100%;
    margin: var(--spacing-sm);
    padding: var(--spacing-md);
    border-radius: var(--border-radius-md);
  }
  
  .modal-header h3 {
    font-size: var(--font-size-lg);
  }
  
  .form-group input,
  .form-group select {
    font-size: var(--font-size-md); /* Предотвращает zoom на iOS */
  }
  
  .form-actions {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
    min-height: 44px; /* Touch-оптимизация */
  }
}
</style>
