# TASK-005-01: Компонент модального окна редактирования дня

**Дата создания:** 2025-12-12 12:04 (UTC+3, Брест)  
**Дата обновления:** 2025-12-12 12:32 (UTC+3, Брест)  
**Статус:** В работе  
**Приоритет:** Критический  
**Исполнитель:** Bitrix24 Программист (Vue.js)  
**Родительская задача:** [TASK-005](TASK-005-functional-components.md)  
**Подэтап:** 5.1 из 6 (Этап 1 из 6)  
**Длительность:** 2 дня

---

## ⚠️ ИНСТРУКЦИЯ ДЛЯ ПРОГРАММИСТА

**Это ЭТАП 1 из 6 последовательных этапов задачи TASK-005.**

### Порядок выполнения:
1. ✅ **Начните с этого этапа** (TASK-005-01)
2. После завершения → переходите к **Этапу 2** ([TASK-005-02](TASK-005-02-fill-week-button.md))
3. **НЕ пропускайте этапы!** Выполняйте строго по порядку.

### Что нужно сделать:
- Создать компонент `EditDayModal.vue` для редактирования дня
- Реализовать форму с валидацией
- Протестировать компонент

### Требования:
- TASK-003-05: Утилиты валидации (должны быть готовы)
- TASK-003-06: Константы (должны быть готовы)

---

## Описание

Создание компонента `EditDayModal.vue` для редактирования данных дня в табеле присутствия. Компонент содержит форму для ввода часов или выбора статуса с валидацией в реальном времени.

**Связь с ТЗ:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - разделы 2.4, 3.2  
**Связь с этапами:** [DOCS/TZ/implementation-stages.md](../TZ/implementation-stages.md) - Этап 5, Подэтап 5.1

---

## Контекст

Это первый подэтап создания функциональных компонентов. Компонент модального окна необходим для редактирования данных дня при клике на ячейку календаря.

**Зависит от:**
- TASK-003-05: Создание утилит валидации
- TASK-003-06: Создание констант (STATUSES)
- TASK-001-05: Настройка базовой структуры компонентов (файл уже создан)

---

## Модули и компоненты

### Frontend (Vue.js)
- `js/vue-apps/timesheet/components/EditDayModal.vue` — компонент модального окна редактирования дня

### Используемые утилиты
- `validation` — для валидации данных
- `constants` — для статусов (STATUSES)

---

## Зависимости

- **От каких задач зависит:**
  - TASK-003-05: Создание утилит валидации
  - TASK-003-06: Создание констант
  - TASK-001-05: Настройка базовой структуры компонентов
- **Какие задачи зависят от этой:**
  - TASK-005-06: Интеграция всех компонентов — будет использовать этот компонент

---

## Ступенчатые подзадачи

### Шаг 1: Открытие файла
1. Открыть файл `js/vue-apps/timesheet/components/EditDayModal.vue`
2. Проверить, что файл существует

### Шаг 2: Создание структуры компонента
1. Создать секцию `<template>` с разметкой модального окна
2. Создать секцию `<script setup>` для логики
3. Создать секцию `<style scoped>` для стилей

### Шаг 3: Реализация модального окна
1. Создать overlay (фон с затемнением)
2. Создать контейнер модального окна
3. Реализовать закрытие по клику на overlay
4. Реализовать закрытие по клавише Escape

### Шаг 4: Реализация формы редактирования
1. Создать поле для ввода часов:
   - Тип: number
   - Шаг: 0.5
   - Диапазон: 0-24
   - Блокировка при выборе статуса
2. Создать выпадающий список для статуса:
   - Варианты из STATUSES
   - Блокировка при вводе часов
3. Добавить метки (labels) для полей

### Шаг 5: Реализация валидации
1. Интегрировать утилиты валидации
2. Валидировать часы в реальном времени
3. Валидировать статус
4. Проверять бизнес-правило: часы и статус не одновременно
5. Отображать ошибки валидации

### Шаг 6: Реализация кнопок
1. Создать кнопку "Сохранить"
2. Создать кнопку "Отмена"
3. Блокировать кнопку "Сохранить" при ошибках валидации
4. Обработать клики на кнопки

### Шаг 7: Реализация обработки сохранения
1. Emit событие `save` с данными дня
2. Передать данные в формате: `{hours, status}`
3. Закрыть модальное окно после сохранения

### Шаг 8: Добавление стилей
1. Добавить стили для overlay
2. Добавить стили для модального окна
3. Добавить стили для формы
4. Добавить стили для кнопок
5. Добавить анимацию открытия/закрытия

---

## Технические требования

### Vue.js
- **Версия:** Vue.js 3.x (Composition API)
- **Подход:** `<script setup>` синтаксис
- **Стили:** Scoped styles

### Валидация
- Валидация в реальном времени
- Блокировка недопустимых комбинаций (часы и статус одновременно)
- Понятные сообщения об ошибках

### События
- `save` — при сохранении данных
- `close` — при закрытии модального окна

---

## Критерии приёмки

- [ ] Создан компонент `EditDayModal.vue`
- [ ] Реализована форма редактирования:
  - [ ] Поле для ввода часов (шаг 0.5, диапазон 0-24)
  - [ ] Выбор статуса (выпадающий список)
- [ ] Реализована валидация в реальном времени:
  - [ ] Валидация часов
  - [ ] Валидация статуса
  - [ ] Проверка бизнес-правил
- [ ] Реализованы кнопки "Сохранить" и "Отмена"
- [ ] Реализована обработка сохранения (emit события)
- [ ] Реализовано закрытие модального окна:
  - [ ] По клику на overlay
  - [ ] По клавише Escape
  - [ ] По кнопке "Отмена"
- [ ] Стили применены корректно
- [ ] Компонент работает корректно

---

## Примеры кода

### EditDayModal.vue
```vue
<template>
  <Teleport to="body">
    <div v-if="visible" class="modal-overlay" @click="handleOverlayClick" @keydown.esc="handleClose">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Редактирование дня {{ day }}</h3>
          <button class="close-button" @click="handleClose">×</button>
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
              @input="validateHours"
            />
            <span v-if="hoursError" class="error-message">{{ hoursError }}</span>
          </div>
          
          <div class="form-group">
            <label for="status">Статус:</label>
            <select
              id="status"
              v-model="localStatus"
              :disabled="hasHours"
              @change="validateStatus"
            >
              <option :value="null">Нет</option>
              <option v-for="status in statuses" :key="status" :value="status">
                {{ status }}
              </option>
            </select>
            <span v-if="statusError" class="error-message">{{ statusError }}</span>
          </div>
          
          <div class="form-actions">
            <button type="submit" :disabled="!isValid" class="btn-primary">
              Сохранить
            </button>
            <button type="button" @click="handleClose" class="btn-secondary">
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
import { STATUSES } from '../utils/constants.js';

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

const statuses = Object.values(STATUSES);

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
function validateHours() {
  if (hasStatus.value) {
    localHours.value = 0;
    hoursError.value = null;
    return;
  }
  
  const result = validateHours(localHours.value);
  if (!result.valid) {
    hoursError.value = result.error;
  } else {
    hoursError.value = null;
  }
}

// Валидация статуса
function validateStatus() {
  if (hasHours.value) {
    localStatus.value = null;
    statusError.value = null;
    return;
  }
  
  const result = validateStatus(localStatus.value);
  if (!result.valid) {
    statusError.value = result.error;
  } else {
    statusError.value = null;
  }
}

// Обработка сохранения
function handleSave() {
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
  animation: fadeIn 0.2s;
}

.modal-content {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  min-width: 400px;
  max-width: 90%;
  max-height: 90%;
  overflow-y: auto;
  animation: slideIn 0.3s;
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
}

.form-group input,
.form-group select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:disabled,
.form-group select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.error-message {
  color: #d32f2f;
  font-size: 12px;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 10px;
}

.btn-primary,
.btn-secondary {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #3498db;
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2980b9;
}

.btn-primary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #e0e0e0;
  color: #333;
}

.btn-secondary:hover {
  background-color: #d0d0d0;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
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
</style>
```

### Использование в компоненте
```vue
<template>
  <EditDayModal
    :visible="editModal.open"
    :day="editModal.day"
    :day-data="selectedDayData"
    @save="handleSaveDay"
    @close="handleCloseModal"
  />
</template>

<script setup>
import { ref } from 'vue';
import EditDayModal from './components/EditDayModal.vue';

const editModal = ref({
  open: false,
  day: null,
  year: null,
  month: null
});

const selectedDayData = ref(null);

function handleSaveDay(dayData) {
  // Сохранение данных дня
  console.log('Save day:', dayData);
}

function handleCloseModal() {
  editModal.value.open = false;
}
</script>
```

---

## Тестирование

### Тестирование компонента
1. Импортировать компонент в тестовый файл
2. Проверить открытие/закрытие модального окна
3. Проверить ввод часов
4. Проверить выбор статуса
5. Проверить валидацию
6. Проверить сохранение данных

---

## История правок

- **2025-12-12 12:04 (UTC+3, Брест):** Создана задача TASK-005-01
- **2025-12-12 12:32 (UTC+3, Брест):** Добавлены инструкции для последовательного выполнения этапов
- **2025-12-12 12:45 (UTC+3, Брест):** Реализован компонент EditDayModal.vue:
  - ✅ Создана структура компонента с template, script и style
  - ✅ Реализовано модальное окно с overlay и закрытием по Escape
  - ✅ Реализована форма редактирования (часы и статус)
  - ✅ Интегрирована валидация в реальном времени
  - ✅ Реализованы кнопки "Сохранить" и "Отмена"
  - ✅ Добавлены стили и анимации
  - ✅ Компонент адаптирован под существующие утилиты валидации

---

## Примечания

### Важные замечания
- Компонент должен использовать Teleport для рендеринга в body
- Валидация должна работать в реальном времени
- Бизнес-правила должны строго соблюдаться (часы и статус не одновременно)

### Следующие шаги
После завершения этого подэтапа можно переходить к:
- TASK-005-02: Компонент кнопки "Заполнить неделю"
- TASK-005-06: Интеграция всех компонентов — будет использовать этот компонент

---

## Связь с документацией

- **Родительская задача:** [TASK-005](TASK-005-functional-components.md)
- **Техническое задание:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - разделы 2.4, 3.2

