# Табель присутствия для Bitrix24

**Версия:** 1.0.0  
**Дата:** 2025-12-12 (UTC+3, Брест)  

---

## Описание

Веб-приложение для заполнения табеля присутствия сотрудниками в Bitrix24. Приложение позволяет сотрудникам заполнять календарь присутствия, указывая количество отработанных часов или статус (больничный, командировка, отпуск) для каждого дня месяца.

**Связь с ТЗ:** [DOCS/TZ/interface-timesheet-calendar.md](../../DOCS/TZ/interface-timesheet-calendar.md)

---

## Технологический стек

- **Frontend:**
  - Vue.js 3.x (Composition API)
  - Pinia (state management)
  - Vite (build tool)
  - Vanilla JS (без дополнительных фреймворков)

- **Backend:**
  - PHP 8.3+
  - REST API endpoints
  - JSON файловое хранилище

- **Тестирование:**
  - Vitest (unit tests)
  - PHPUnit (integration tests)
  - Playwright (E2E tests)

- **Интеграция:**
  - Bitrix24 REST API
  - Bitrix24 BX.* API

---

## Структура проекта

```
js/vue-apps/timesheet/
├── components/          # Vue.js компоненты
│   ├── UserInfo.vue
│   ├── PeriodSelector.vue
│   ├── StatisticsBar.vue
│   ├── CalendarCell.vue
│   ├── CalendarGrid.vue
│   ├── EditDayModal.vue
│   ├── FillWeekButton.vue
│   ├── Preloader.vue
│   └── SaveIndicator.vue
├── stores/              # Pinia stores
│   ├── userStore.js
│   ├── timesheetStore.js
│   └── holidaysStore.js
├── services/            # API сервисы
│   ├── Bitrix24ApiService.js
│   ├── TimesheetApiService.js
│   └── HolidaysService.js
├── utils/               # Утилиты
│   ├── dateHelpers.js
│   ├── validation.js
│   ├── constants.js
│   └── debounce.js
├── tests/               # Тесты
│   ├── unit/           # Unit тесты
│   ├── integration/    # Integration тесты
│   └── e2e/            # E2E тесты
├── main.js             # Точка входа приложения
├── App.vue             # Корневой компонент
└── package.json        # Зависимости и скрипты
```

---

## Установка

### Требования

- Node.js 18+
- npm или yarn
- PHP 8.3+
- Bitrix24 аккаунт (облачная или коробочная версия)

### Шаги установки

1. **Клонировать репозиторий:**
   ```bash
   git clone <repository-url>
   cd back1
   ```

2. **Установить зависимости:**
   ```bash
   cd js/vue-apps/timesheet
   npm install
   ```

3. **Настроить Bitrix24:**
   - Для облачной версии: настроить OAuth приложение
   - Для коробочной версии: настроить доступ к REST API

4. **Настроить API endpoints:**
   - Убедиться, что `api/timesheet.php` и `api/holidays.php` доступны
   - Проверить права доступа к директории данных

---

## Запуск

### Development режим

```bash
npm run dev
```

Приложение будет доступно по адресу `http://localhost:5173` (или другому порту, указанному Vite).

### Production сборка

```bash
npm run build
```

Собранные файлы будут в директории `dist/`.

### Preview production сборки

```bash
npm run preview
```

---

## Разработка

### Структура проекта

- **Компоненты:** Все Vue.js компоненты находятся в `components/`
- **Stores:** Pinia stores для управления состоянием в `stores/`
- **Сервисы:** API сервисы для работы с backend в `services/`
- **Утилиты:** Вспомогательные функции в `utils/`

### Стиль кода

- Использовать ESLint для проверки кода
- Следовать Vue.js Style Guide
- Добавлять JSDoc комментарии для всех публичных функций

### Процесс разработки

1. Создать ветку для новой функции
2. Реализовать функционал
3. Написать тесты
4. Проверить код (ESLint, тесты)
5. Создать Pull Request

---

## Тестирование

### Unit тесты

```bash
npm run test:unit
```

Запуск unit тестов с покрытием:

```bash
npm run test:coverage
```

### Integration тесты

```bash
cd ../../../
vendor/bin/phpunit
```

### E2E тесты

```bash
npm run test:e2e
```

Запуск E2E тестов для конкретного браузера:

```bash
npm run test:e2e -- --project=chromium
```

---

## API Endpoints

### GET /api/timesheet.php

Получение данных табеля для указанного года и месяца.

**Параметры:**
- `year` (обязательный) - Год (2025-2035)
- `month` (обязательный) - Месяц (1-12)

**Пример запроса:**
```
GET /api/timesheet.php?year=2025&month=12
```

**Пример ответа:**
```json
{
  "success": true,
  "data": {
    "created_at": "2025-12-01 10:00:00",
    "updated_at": "2025-12-12 15:30:00",
    "days": {
      "1": { "hours": 8, "status": null },
      "2": { "hours": 4, "status": null },
      "3": { "hours": null, "status": "Больничный" }
    }
  }
}
```

### POST /api/timesheet.php

Сохранение данных табеля для указанного года и месяца.

**Параметры:**
- `year` (обязательный) - Год (2025-2035)
- `month` (обязательный) - Месяц (1-12)

**Тело запроса:**
```json
{
  "days": {
    "1": { "hours": 8, "status": null },
    "2": { "hours": 4, "status": null }
  }
}
```

**Пример ответа:**
```json
{
  "success": true,
  "data": {
    "created_at": "2025-12-01 10:00:00",
    "updated_at": "2025-12-12 15:30:00",
    "days": {
      "1": { "hours": 8, "status": null },
      "2": { "hours": 4, "status": null }
    }
  }
}
```

### GET /api/holidays.php

Получение списка праздничных дней для указанного года.

**Параметры:**
- `year` (обязательный) - Год (2025-2035)

**Пример запроса:**
```
GET /api/holidays.php?year=2025
```

**Пример ответа:**
```json
{
  "success": true,
  "data": [
    "2025-01-01",
    "2025-01-07",
    "2025-03-08"
  ]
}
```

Подробная документация API: [DOCS/API-REFERENCES/api-endpoints.md](../../DOCS/API-REFERENCES/api-endpoints.md)

---

## Интеграция с Bitrix24

### Облачная версия

Приложение использует Bitrix24 REST API через вебхуки или OAuth.

**Методы API:**
- `user.current` - получение данных текущего пользователя
- Документация: https://context7.com/bitrix24/rest/user.current

### Коробочная версия

Приложение может использовать как REST API, так и D7 ORM для работы с данными Bitrix24.

---

## Производительность

### Оптимизации

- Ленивая загрузка компонентов
- Кэширование данных через Pinia stores
- Debounce для частых операций (сохранение)
- Минимизация реактивных зависимостей

### Метрики

- Время загрузки: < 3 секунд (первая загрузка)
- FPS: минимум 60
- Размер bundle: оптимизирован через Vite

---

## Безопасность

### Валидация данных

- Валидация на frontend (Vue.js компоненты)
- Валидация на backend (PHP)
- Проверка прав доступа (пользователь видит только свои данные)

### Защита от уязвимостей

- Защита от XSS (экранирование данных)
- Защита от CSRF (проверка токенов)
- Валидация всех входящих данных

---

## Поддержка

### Документация

- [Техническое задание](../../DOCS/TZ/interface-timesheet-calendar.md)
- [API документация](../../DOCS/API-REFERENCES/api-endpoints.md)
- [Руководства](../../DOCS/GUIDES/)

### Контакты

Для вопросов и поддержки обращайтесь к команде разработки.

---

## Лицензия

ISC

---

## История изменений

### Версия 1.0.0 (2025-12-12)

- Первый релиз
- Реализован полный функционал табеля присутствия
- Добавлены unit, integration и E2E тесты
- Создана документация

---

## Связь с документацией

- **Техническое задание:** [DOCS/TZ/interface-timesheet-calendar.md](../../DOCS/TZ/interface-timesheet-calendar.md)
- **API документация:** [DOCS/API-REFERENCES/api-endpoints.md](../../DOCS/API-REFERENCES/api-endpoints.md)
- **Архитектура:** [DOCS/ARCHITECTURE/](../../DOCS/ARCHITECTURE/)

