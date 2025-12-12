# TASK-007-01: Unit-тесты

**Дата создания:** 2025-12-12 12:24 (UTC+3, Брест)  
**Статус:** Новая  
**Приоритет:** Высокий  
**Исполнитель:** Bitrix24 Программист (Vue.js) / QA Engineer  
**Родительская задача:** [TASK-007](TASK-007-testing-documentation.md)  
**Подэтап:** 7.1 из 6  
**Длительность:** 1.5 дня

---

## Описание

Настройка тестового окружения и написание unit-тестов для компонентов Vue.js, утилит и сервисов. Достижение покрытия кода минимум 70%.

**Связь с ТЗ:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - раздел 11  
**Связь с этапами:** [DOCS/TZ/implementation-stages.md](../TZ/implementation-stages.md) - Этап 7, Подэтап 7.1

---

## Контекст

Это первый подэтап тестирования. Unit-тесты необходимы для проверки корректности работы отдельных компонентов, утилит и сервисов.

**Зависит от:**
- Все компоненты из TASK-004 и TASK-005 (должны быть готовы)
- Все утилиты из TASK-003 (должны быть готовы)
- Все сервисы из TASK-003 (должны быть готовы)

---

## Модули и компоненты

### Тестирование
- `tests/unit/components/` — тесты компонентов Vue.js
- `tests/unit/utils/` — тесты утилит
- `tests/unit/services/` — тесты сервисов

### Тестовое окружение
- Vitest или Jest
- @vue/test-utils (для тестирования Vue компонентов)

---

## Зависимости

- **От каких задач зависит:**
  - Все компоненты из TASK-004 и TASK-005
  - Все утилиты и сервисы из TASK-003
- **Какие задачи зависят от этой:**
  - TASK-007-04: Исправление ошибок — будет использовать результаты тестов

---

## Ступенчатые подзадачи

### Шаг 1: Настройка тестового окружения
1. Установить Vitest или Jest:
   - `npm install -D vitest` или `npm install -D jest`
   - Установить @vue/test-utils: `npm install -D @vue/test-utils`
2. Создать конфигурационный файл:
   - `vitest.config.js` или `jest.config.js`
3. Настроить конфигурацию:
   - Пути к тестам
   - Алиасы для импортов
   - Окружение (jsdom для DOM)
4. Добавить скрипты в `package.json`:
   - `test:unit` — запуск unit-тестов
   - `test:coverage` — запуск с покрытием

### Шаг 2: Тесты для компонентов Vue.js
1. Создать тесты для `UserInfo.vue`:
   - Тест отображения данных пользователя
   - Тест состояния загрузки
   - Тест обработки ошибок
2. Создать тесты для `PeriodSelector.vue`:
   - Тест выбора года
   - Тест выбора месяца
   - Тест emit события change
3. Создать тесты для `StatisticsBar.vue`:
   - Тест расчёта статистики
   - Тест реактивного обновления
4. Создать тесты для `CalendarCell.vue`:
   - Тест отображения дня
   - Тест визуального выделения
   - Тест emit события click
5. Создать тесты для `CalendarGrid.vue`:
   - Тест генерации сетки
   - Тест загрузки данных
6. Создать тесты для `EditDayModal.vue`:
   - Тест открытия/закрытия
   - Тест валидации
   - Тест сохранения
7. Создать тесты для `FillWeekButton.vue`:
   - Тест заполнения недели
   - Тест исключения выходных и праздников
8. Создать тесты для `Preloader.vue`:
   - Тест отображения/скрытия

### Шаг 3: Тесты для утилит
1. Создать тесты для `dateHelpers.js`:
   - Тесты для всех функций работы с датами
   - Тесты для проверки типов дней
   - Тесты для форматирования
2. Создать тесты для `validation.js`:
   - Тесты валидации часов
   - Тесты валидации статусов
   - Тесты валидации записей дней
   - Тесты валидации года и месяца
3. Создать тесты для `constants.js`:
   - Тесты экспорта констант
   - Тесты корректности значений

### Шаг 4: Тесты для сервисов
1. Создать тесты для `Bitrix24ApiService.js`:
   - Тест получения данных пользователя
   - Тест обработки ошибок
   - Моки для BX.ajax или fetch
2. Создать тесты для `TimesheetApiService.js`:
   - Тест получения данных табеля
   - Тест сохранения данных табеля
   - Тест обработки ошибок
   - Моки для fetch
3. Создать тесты для `HolidaysService.js`:
   - Тест получения праздников
   - Тест кэширования
   - Тест проверки праздника
   - Моки для fetch

### Шаг 5: Проверка покрытия кода
1. Запустить тесты с покрытием
2. Проверить покрытие кода
3. Дописать тесты для достижения минимум 70% покрытия
4. Документировать покрытие

---

## Технические требования

### Тестирование
- **Фреймворк:** Vitest (рекомендуется) или Jest
- **Vue тестирование:** @vue/test-utils
- **Покрытие кода:** Минимум 70%

### Моки
- Моки для API запросов (fetch, BX.ajax)
- Моки для внешних зависимостей

---

## Критерии приёмки

- [ ] Настроено тестовое окружение:
  - [ ] Установлен Vitest или Jest
  - [ ] Установлен @vue/test-utils
  - [ ] Создан конфигурационный файл
  - [ ] Добавлены скрипты в package.json
- [ ] Написаны тесты для компонентов Vue.js:
  - [ ] UserInfo.vue
  - [ ] PeriodSelector.vue
  - [ ] StatisticsBar.vue
  - [ ] CalendarCell.vue
  - [ ] CalendarGrid.vue
  - [ ] EditDayModal.vue
  - [ ] FillWeekButton.vue
  - [ ] Preloader.vue
- [ ] Написаны тесты для утилит:
  - [ ] dateHelpers.js
  - [ ] validation.js
  - [ ] constants.js
- [ ] Написаны тесты для сервисов:
  - [ ] Bitrix24ApiService.js
  - [ ] TimesheetApiService.js
  - [ ] HolidaysService.js
- [ ] Покрытие кода минимум 70%
- [ ] Все тесты проходят

---

## Примеры кода

### Конфигурация Vitest
```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '*.config.js'
      ]
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './js/vue-apps/timesheet')
    }
  }
});
```

### Пример теста компонента
```javascript
// tests/unit/components/UserInfo.spec.js
import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import UserInfo from '@/components/UserInfo.vue';
import { Bitrix24ApiService } from '@/services/Bitrix24ApiService.js';

vi.mock('@/services/Bitrix24ApiService.js');

describe('UserInfo', () => {
  it('отображает данные пользователя', async () => {
    const userData = {
      ID: 123,
      NAME: 'Иван',
      LAST_NAME: 'Иванов',
      WORK_POSITION: 'Менеджер'
    };
    
    Bitrix24ApiService.getCurrentUser = vi.fn().mockResolvedValue(userData);
    
    const wrapper = mount(UserInfo);
    
    await wrapper.vm.$nextTick();
    
    expect(wrapper.text()).toContain('Иванов Иван');
    expect(wrapper.text()).toContain('Менеджер');
  });
});
```

### Пример теста утилиты
```javascript
// tests/unit/utils/dateHelpers.spec.js
import { describe, it, expect } from 'vitest';
import { isToday, isWeekend, getDaysInMonth } from '@/utils/dateHelpers.js';

describe('dateHelpers', () => {
  describe('isToday', () => {
    it('возвращает true для сегодняшнего дня', () => {
      expect(isToday(new Date())).toBe(true);
    });
    
    it('возвращает false для другого дня', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday)).toBe(false);
    });
  });
  
  describe('isWeekend', () => {
    it('возвращает true для субботы', () => {
      const saturday = new Date('2025-12-13'); // Суббота
      expect(isWeekend(saturday)).toBe(true);
    });
  });
  
  describe('getDaysInMonth', () => {
    it('возвращает правильное количество дней', () => {
      expect(getDaysInMonth(2025, 2)).toBe(28);
      expect(getDaysInMonth(2025, 12)).toBe(31);
    });
  });
});
```

---

## Тестирование

### Запуск тестов
```bash
# Запуск всех unit-тестов
npm run test:unit

# Запуск с покрытием
npm run test:coverage

# Запуск в watch режиме
npm run test:unit -- --watch
```

---

## История правок

- **2025-12-12 12:24 (UTC+3, Брест):** Создана задача TASK-007-01

---

## Примечания

### Важные замечания
- Тесты должны быть изолированными и независимыми
- Использовать моки для внешних зависимостей
- Покрытие кода должно быть минимум 70%

### Следующие шаги
После завершения этого подэтапа можно переходить к:
- TASK-007-02: Интеграционные тесты
- TASK-007-04: Исправление ошибок — будет использовать результаты тестов

---

## Связь с документацией

- **Родительская задача:** [TASK-007](TASK-007-testing-documentation.md)
- **Техническое задание:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - раздел 11


