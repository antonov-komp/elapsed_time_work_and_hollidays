# TASK-005-04: Реализация автосохранения

**Дата создания:** 2025-12-12 12:04 (UTC+3, Брест)  
**Статус:** Новая  
**Приоритет:** Высокий  
**Исполнитель:** Bitrix24 Программист (Vue.js)  
**Родительская задача:** [TASK-005](TASK-005-functional-components.md)  
**Подэтап:** 5.4 из 6  
**Длительность:** 1.5 дня

---

## Описание

Реализация автосохранения данных табеля с debounce (1.5 секунды), индикатором сохранения, обработкой ошибок и retry при ошибках (3 попытки).

**Связь с ТЗ:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - разделы 10.1, 10.3  
**Связь с этапами:** [DOCS/TZ/implementation-stages.md](../TZ/implementation-stages.md) - Этап 5, Подэтап 5.4

---

## Контекст

Это четвёртый подэтап создания функциональных компонентов. Автосохранение необходимо для автоматического сохранения изменений без необходимости нажимать кнопку "Сохранить".

**Зависит от:**
- TASK-005-03: Реализация состояния приложения (Store)
- TASK-003-02: Создание сервиса для работы с табелем

---

## Модули и компоненты

### Frontend (Vue.js)
- `js/vue-apps/timesheet/stores/timesheetStore.js` — обновление Store для автосохранения
- `js/vue-apps/timesheet/components/SaveIndicator.vue` — компонент индикатора сохранения (опционально)

### Используемые сервисы
- `TimesheetApiService` — для сохранения данных табеля

---

## Зависимости

- **От каких задач зависит:**
  - TASK-005-03: Реализация состояния приложения (Store)
  - TASK-003-02: Создание сервиса для работы с табелем
- **Какие задачи зависят от этой:**
  - TASK-005-06: Интеграция всех компонентов — будет использовать автосохранение

---

## Ступенчатые подзадачи

### Шаг 1: Реализация debounce функции
1. Создать утилиту `debounce` или использовать библиотеку
2. Настроить задержку 1.5 секунды
3. Реализовать отмену предыдущего вызова

### Шаг 2: Интеграция debounce в Store
1. Добавить debounce для метода сохранения
2. Вызывать сохранение при изменении данных табеля
3. Использовать `watch` для отслеживания изменений

### Шаг 3: Реализация индикатора сохранения
1. Добавить состояние `saving` в Store
2. Обновлять состояние при начале сохранения
3. Обновлять состояние при завершении сохранения
4. Создать компонент индикатора (опционально)

### Шаг 4: Реализация обработки ошибок
1. Обработать ошибки сохранения
2. Логировать ошибки
3. Показывать сообщения пользователю (опционально)

### Шаг 5: Реализация retry при ошибках
1. Реализовать механизм retry (3 попытки)
2. Добавить задержку между попытками
3. Обработать случай, когда все попытки исчерпаны

### Шаг 6: Добавление визуального индикатора
1. Создать компонент индикатора сохранения
2. Отображать состояние сохранения (сохранение, сохранено, ошибка)
3. Добавить стили для индикатора

---

## Технические требования

### Vue.js
- **Версия:** Vue.js 3.x (Composition API)
- **Debounce:** 1.5 секунды
- **Retry:** 3 попытки при ошибках

### Debounce
- Можно использовать библиотеку (lodash) или реализовать самостоятельно
- Задержка: 1500 мс

### Retry
- Количество попыток: 3
- Задержка между попытками: 1 секунда

---

## Критерии приёмки

- [ ] Реализовано автосохранение с debounce (1.5 сек)
- [ ] Реализован индикатор сохранения
- [ ] Реализована обработка ошибок сохранения
- [ ] Реализован retry при ошибках (3 попытки)
- [ ] Автосохранение интегрировано в Store
- [ ] Визуальный индикатор сохранения работает
- [ ] Автосохранение работает корректно

---

## Примеры кода

### Утилита debounce
```javascript
/**
 * Утилита debounce
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
```

### Обновление Store с автосохранением
```javascript
import { debounce } from '../utils/debounce.js';

export const useTimesheetStore = defineStore('timesheet', {
  // ... state, getters ...
  
  actions: {
    // ... другие actions ...
    
    /**
     * Автосохранение с debounce
     */
    autoSave: debounce(async function(year, month, days) {
      this.timesheet.saving = true;
      this.timesheet.error = null;
      
      let attempts = 0;
      const maxAttempts = 3;
      
      while (attempts < maxAttempts) {
        try {
          await TimesheetApiService.saveTimesheet(year, month, days);
          
          // Успешное сохранение
          this.timesheet.saving = false;
          this.timesheet.lastSaved = new Date();
          return;
        } catch (error) {
          attempts++;
          
          if (attempts >= maxAttempts) {
            // Все попытки исчерпаны
            console.error('Auto-save failed after', maxAttempts, 'attempts:', error);
            this.timesheet.error = error.message;
            this.timesheet.saving = false;
            throw error;
          }
          
          // Задержка перед следующей попыткой
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }, 1500),
    
    /**
     * Обновление дня с автосохранением
     */
    updateDay(day, dayData) {
      this.timesheet.days = {
        ...this.timesheet.days,
        [day]: dayData
      };
      
      // Автосохранение
      this.autoSave(
        this.timesheet.year,
        this.timesheet.month,
        this.timesheet.days
      );
    }
  }
});
```

### Компонент индикатора сохранения
```vue
<template>
  <div class="save-indicator" v-if="show">
    <span v-if="saving" class="saving">Сохранение...</span>
    <span v-else-if="saved" class="saved">Сохранено</span>
    <span v-else-if="error" class="error">Ошибка сохранения</span>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useTimesheetStore } from '../stores/timesheetStore.js';

const store = useTimesheetStore();

const saving = computed(() => store.timesheet.saving);
const error = computed(() => store.timesheet.error);
const saved = computed(() => !saving.value && !error.value && store.timesheet.lastSaved);

const show = computed(() => saving.value || saved.value || error.value);
</script>

<style scoped>
.save-indicator {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px 15px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 12px;
}

.saving {
  color: #3498db;
}

.saved {
  color: #2ecc71;
}

.error {
  color: #e74c3c;
}
</style>
```

---

## Тестирование

### Тестирование автосохранения
1. Изменить данные табеля
2. Проверить, что сохранение происходит через 1.5 секунды
3. Проверить индикатор сохранения
4. Проверить retry при ошибках
5. Проверить обработку ошибок

---

## История правок

- **2025-12-12 12:04 (UTC+3, Брест):** Создана задача TASK-005-04

---

## Примечания

### Важные замечания
- Debounce должен отменять предыдущие вызовы
- Retry должен иметь ограничение на количество попыток
- Индикатор сохранения должен быть ненавязчивым

### Следующие шаги
После завершения этого подэтапа можно переходить к:
- TASK-005-05: Реализация расчёта статистики
- TASK-005-06: Интеграция всех компонентов — будет использовать автосохранение

---

## Связь с документацией

- **Родительская задача:** [TASK-005](TASK-005-functional-components.md)
- **Предыдущий подэтап:** [TASK-005-03](TASK-005-03-store.md)
- **Техническое задание:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - разделы 10.1, 10.3

