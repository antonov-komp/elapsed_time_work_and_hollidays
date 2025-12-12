# TASK-004-02: Компонент информации о пользователе

**Дата создания:** 2025-12-12 11:53 (UTC+3, Брест)  
**Статус:** Новая  
**Приоритет:** Высокий  
**Исполнитель:** Bitrix24 Программист (Vue.js)  
**Родительская задача:** [TASK-004](TASK-004-basic-vue-components.md)  
**Подэтап:** 4.2 из 6  
**Длительность:** 1 день

---

## Описание

Создание компонента `UserInfo.vue` для отображения информации о пользователе (ФИО и Должность), полученной через Bitrix24 API.

**Связь с ТЗ:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - раздел 1.1  
**Связь с этапами:** [DOCS/TZ/implementation-stages.md](../TZ/implementation-stages.md) - Этап 4, Подэтап 4.2

---

## Контекст

Это второй подэтап создания базовых компонентов Vue.js. Компонент информации о пользователе необходим для отображения данных авторизованного пользователя в верхней части интерфейса.

**Зависит от:**
- TASK-003-01: Создание сервиса для работы с Bitrix24 API
- TASK-001-05: Настройка базовой структуры компонентов (файл уже создан)

---

## Модули и компоненты

### Frontend (Vue.js)
- `js/vue-apps/timesheet/components/UserInfo.vue` — компонент информации о пользователе

### Используемые сервисы
- `Bitrix24ApiService` — для получения данных пользователя

---

## Зависимости

- **От каких задач зависит:**
  - TASK-003-01: Создание сервиса для работы с Bitrix24 API
  - TASK-001-05: Настройка базовой структуры компонентов
- **Какие задачи зависят от этой:**
  - TASK-004-06: Компонент календарной сетки — будет использовать этот компонент

---

## Ступенчатые подзадачи

### Шаг 1: Открытие файла
1. Открыть файл `js/vue-apps/timesheet/components/UserInfo.vue`
2. Проверить, что файл существует

### Шаг 2: Создание структуры компонента
1. Создать секцию `<template>` с разметкой
2. Создать секцию `<script setup>` для логики
3. Создать секцию `<style scoped>` для стилей

### Шаг 3: Интеграция Bitrix24ApiService
1. Импортировать `Bitrix24ApiService`
2. Создать реактивные переменные для данных пользователя
3. Создать переменные для состояния загрузки и ошибок

### Шаг 4: Реализация загрузки данных
1. Использовать `onMounted` для загрузки данных при монтировании
2. Вызвать `Bitrix24ApiService.getCurrentUser()`
3. Обработать успешный ответ
4. Обработать ошибки

### Шаг 5: Формирование ФИО
1. Извлечь `LAST_NAME`, `NAME`, `SECOND_NAME` из данных пользователя
2. Объединить в строку ФИО
3. Обработать случай отсутствия данных (отобразить ID)

### Шаг 6: Отображение данных
1. Отобразить ФИО
2. Отобразить Должность (если есть)
3. Добавить разделитель "|" между ФИО и Должностью
4. Обработать состояния загрузки и ошибок

### Шаг 7: Добавление стилей
1. Добавить стили для контейнера
2. Добавить стили для текста (жирный, размер)
3. Добавить стили для разделителя
4. Добавить стили для состояний загрузки и ошибок

---

## Технические требования

### Vue.js
- **Версия:** Vue.js 3.x (Composition API)
- **Подход:** `<script setup>` синтаксис
- **Стили:** Scoped styles

### Bitrix24 API
- **Метод:** `user.current`
- **Поля:** `ID`, `NAME`, `LAST_NAME`, `SECOND_NAME`, `WORK_POSITION`

### Визуальные требования
- Формат: "Фамилия Имя Отчество | Должность"
- Шрифт: жирный, размер 16-18px
- Цвет текста: тёмно-серый/чёрный
- Фон: светло-серый/белый с лёгкой тенью

---

## Критерии приёмки

- [ ] Создан компонент `UserInfo.vue`
- [ ] Компонент отображает ФИО пользователя
- [ ] Компонент отображает Должность (если есть)
- [ ] Интегрирован `Bitrix24ApiService`
- [ ] Реализовано состояние загрузки
- [ ] Реализована обработка ошибок
- [ ] Обработаны случаи отсутствия данных:
  - [ ] Если ФИО отсутствует, отображается ID
  - [ ] Если должность отсутствует, отображается только ФИО
- [ ] Стили применены корректно
- [ ] Компонент работает корректно

---

## Примеры кода

### UserInfo.vue
```vue
<template>
  <div class="user-info">
    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="user-data">
      <span class="name">{{ fullName }}</span>
      <span v-if="position" class="separator">|</span>
      <span v-if="position" class="position">{{ position }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Bitrix24ApiService } from '../services/Bitrix24ApiService.js';

/**
 * Компонент информации о пользователе
 * 
 * Отображает ФИО и Должность пользователя, полученные из Bitrix24
 */

const loading = ref(true);
const error = ref(null);
const fullName = ref('');
const position = ref('');

onMounted(async () => {
  try {
    loading.value = true;
    error.value = null;
    
    const user = await Bitrix24ApiService.getCurrentUser();
    
    // Формирование ФИО
    const nameParts = [
      user.LAST_NAME,
      user.NAME,
      user.SECOND_NAME
    ].filter(Boolean);
    
    if (nameParts.length > 0) {
      fullName.value = nameParts.join(' ');
    } else {
      // Если ФИО отсутствует, отображаем ID
      fullName.value = `Пользователь #${user.ID}`;
    }
    
    // Должность
    position.value = user.WORK_POSITION || '';
    
  } catch (e) {
    console.error('UserInfo error:', e);
    error.value = 'Не удалось загрузить данные пользователя';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.user-info {
  padding: 15px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-data {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.name {
  color: #000;
}

.separator {
  margin: 0 10px;
  color: #999;
}

.position {
  color: #666;
}

.loading {
  color: #999;
  font-style: italic;
}

.error {
  color: #d32f2f;
  font-size: 14px;
}
</style>
```

### Использование в компоненте
```vue
<template>
  <div class="timesheet-calendar">
    <UserInfo />
    <!-- Остальной контент -->
  </div>
</template>

<script setup>
import UserInfo from './components/UserInfo.vue';
</script>
```

---

## Тестирование

### Тестирование компонента
1. Импортировать компонент в тестовый файл
2. Проверить отображение ФИО и Должности
3. Проверить состояние загрузки
4. Проверить обработку ошибок
5. Проверить случаи отсутствия данных

---

## История правок

- **2025-12-12 11:53 (UTC+3, Брест):** Создана задача TASK-004-02

---

## Примечания

### Важные замечания
- Компонент должен обрабатывать все случаи отсутствия данных
- Ошибки должны отображаться понятно для пользователя
- Загрузка данных должна происходить при монтировании компонента

### Следующие шаги
После завершения этого подэтапа можно переходить к:
- TASK-004-03: Компонент выбора периода
- TASK-004-06: Компонент календарной сетки — будет использовать этот компонент

---

## Связь с документацией

- **Родительская задача:** [TASK-004](TASK-004-basic-vue-components.md)
- **Предыдущий подэтап:** [TASK-004-01](TASK-004-01-preloader.md)
- **Техническое задание:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - раздел 1.1


