# TASK-006-02: Стилизация компонентов

**Дата создания:** 2025-12-12 12:13 (UTC+3, Брест)  
**Статус:** Новая  
**Приоритет:** Высокий  
**Исполнитель:** Bitrix24 Программист (Vue.js)  
**Родительская задача:** [TASK-006](TASK-006-styling-adaptivity.md)  
**Подэтап:** 6.2 из 5  
**Длительность:** 1 день

---

## Описание

Стилизация всех компонентов интерфейса табеля присутствия в едином стиле с соответствием гайдлайнам Bitrix24. Создание общих CSS переменных и единых стилей для кнопок, форм и модальных окон.

**Связь с ТЗ:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - разделы 3, 10.4  
**Связь с этапами:** [DOCS/TZ/implementation-stages.md](../TZ/implementation-stages.md) - Этап 6, Подэтап 6.2

---

## Контекст

Это второй подэтап стилизации интерфейса. Единый стиль всех компонентов необходим для создания целостного и профессионального интерфейса.

**Зависит от:**
- Все компоненты из TASK-004 и TASK-005 (должны быть готовы)

---

## Модули и компоненты

### Frontend (Vue.js)
- Все компоненты (обновление стилей):
  - `UserInfo.vue`
  - `PeriodSelector.vue`
  - `StatisticsBar.vue`
  - `CalendarCell.vue`
  - `EditDayModal.vue`
  - `FillWeekButton.vue`
  - `Preloader.vue`

### Общие стили
- `js/vue-apps/timesheet/styles/variables.css` — CSS переменные (опционально)

---

## Зависимости

- **От каких задач зависит:**
  - Все компоненты из TASK-004 и TASK-005
- **Какие задачи зависят от этой:**
  - TASK-006-03: Адаптивность для мобильных устройств — будет использовать эти стили

---

## Ступенчатые подзадачи

### Шаг 1: Создание CSS переменных
1. Создать файл `js/vue-apps/timesheet/styles/variables.css` (опционально)
2. Или добавить CSS переменные в корневой компонент
3. Определить переменные:
   - Цвета (primary, success, error, warning)
   - Цвета для дней
   - Отступы (spacing)
   - Шрифты (размеры, семейства)
   - Границы (border-radius, border-width)

### Шаг 2: Стилизация UserInfo
1. Обновить стили компонента `UserInfo.vue`
2. Применить единый стиль:
   - Фон, отступы, границы
   - Типографика
   - Цвета

### Шаг 3: Стилизация PeriodSelector
1. Обновить стили компонента `PeriodSelector.vue`
2. Стилизовать выпадающие списки:
   - Размеры, отступы
   - Цвета, границы
   - Hover и focus состояния

### Шаг 4: Стилизация StatisticsBar
1. Обновить стили компонента `StatisticsBar.vue`
2. Стилизовать карточки статистики:
   - Размеры, отступы
   - Цвета, границы
   - Типографика

### Шаг 5: Стилизация EditDayModal
1. Обновить стили компонента `EditDayModal.vue`
2. Стилизовать модальное окно:
   - Overlay
   - Контейнер модального окна
   - Форма
   - Кнопки

### Шаг 6: Стилизация FillWeekButton
1. Обновить стили компонента `FillWeekButton.vue`
2. Стилизовать кнопку:
   - Размеры, отступы
   - Цвета, границы
   - Hover и disabled состояния

### Шаг 7: Стилизация Preloader
1. Обновить стили компонента `Preloader.vue`
2. Улучшить анимацию spinner
3. Стилизовать overlay

### Шаг 8: Создание единых стилей
1. Создать единые стили для кнопок
2. Создать единые стили для форм
3. Создать единые стили для модальных окон
4. Применить единые стили во всех компонентах

---

## Технические требования

### CSS
- **Версия:** CSS3
- **Методология:** Scoped styles в компонентах
- **Переменные:** CSS переменные для темизации

### Гайдлайны Bitrix24
- Цветовая палитра Bitrix24
- Типографика Bitrix24
- Отступы и размеры Bitrix24

---

## Критерии приёмки

- [ ] Созданы CSS переменные (или общие стили)
- [ ] Стилизованы все компоненты:
  - [ ] UserInfo.vue
  - [ ] PeriodSelector.vue
  - [ ] StatisticsBar.vue
  - [ ] CalendarCell.vue
  - [ ] EditDayModal.vue
  - [ ] FillWeekButton.vue
  - [ ] Preloader.vue
- [ ] Стили соответствуют гайдлайнам Bitrix24:
  - [ ] Цветовая палитра
  - [ ] Типографика
  - [ ] Отступы и размеры
- [ ] Создан единый стиль интерфейса:
  - [ ] Единые стили для кнопок
  - [ ] Единые стили для форм
  - [ ] Единые стили для модальных окон
- [ ] Все компоненты выглядят единообразно

---

## Примеры кода

### variables.css (общие переменные)
```css
:root {
  /* Основные цвета */
  --color-primary: #2fc6f6;
  --color-primary-hover: #2eb3d9;
  --color-success: #9dcf00;
  --color-error: #ff5752;
  --color-warning: #ffa726;
  
  /* Цвета для дней */
  --color-workday: #ffffff;
  --color-weekend: #f5f5f5;
  --color-holiday: #ffebee;
  --color-today: #e3f2fd;
  --color-filled: #e8f5e9;
  --color-incomplete: #fff9c4;
  
  /* Отступы */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Шрифты */
  --font-size-xs: 11px;
  --font-size-sm: 12px;
  --font-size-md: 14px;
  --font-size-lg: 16px;
  --font-size-xl: 18px;
  --font-size-xxl: 20px;
  
  /* Границы */
  --border-radius-sm: 2px;
  --border-radius-md: 4px;
  --border-radius-lg: 8px;
  --border-width: 1px;
  
  /* Тени */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 2px 4px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 4px 8px rgba(0, 0, 0, 0.15);
}
```

### Единые стили для кнопок
```css
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background-color: var(--color-primary);
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
}

.btn-secondary {
  background-color: #e0e0e0;
  color: #333;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #d0d0d0;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

---

## Тестирование

### Тестирование стилизации
1. Проверить стили всех компонентов
2. Проверить соответствие гайдлайнам Bitrix24
3. Проверить единообразие стилей

---

## История правок

- **2025-12-12 12:13 (UTC+3, Брест):** Создана задача TASK-006-02

---

## Примечания

### Важные замечания
- Стили должны соответствовать гайдлайнам Bitrix24
- Единый стиль должен применяться ко всем компонентам
- CSS переменные упростят темизацию в будущем

### Следующие шаги
После завершения этого подэтапа можно переходить к:
- TASK-006-03: Адаптивность для мобильных устройств — будет использовать эти стили

---

## Связь с документацией

- **Родительская задача:** [TASK-006](TASK-006-styling-adaptivity.md)
- **Техническое задание:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - разделы 3, 10.4

