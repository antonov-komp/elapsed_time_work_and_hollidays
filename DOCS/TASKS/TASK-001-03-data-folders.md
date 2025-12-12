# TASK-001-03: Создание структуры папок для данных

**Дата создания:** 2025-12-12 11:08 (UTC+3, Брест)  
**Статус:** Новая  
**Приоритет:** Критический  
**Исполнитель:** Bitrix24 Программист (Vue.js) / Системный администратор  
**Родительская задача:** [TASK-001](TASK-001-preparation-infrastructure.md)  
**Подэтап:** 1.3 из 5  
**Длительность:** 0.5 дня

---

## Описание

Создание папки `data/` для хранения JSON файлов табеля присутствия. Настройка правильных прав доступа для работы PHP с файловой системой.

**Связь с ТЗ:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - раздел 4.1  
**Связь с этапами:** [DOCS/TZ/implementation-stages.md](../TZ/implementation-stages.md) - Этап 1, Подэтап 1.3

---

## Контекст

Это третий подэтап подготовки инфраструктуры. Папка `data/` необходима для хранения данных табеля в формате JSON. Без правильных прав доступа PHP не сможет создавать подпапки и файлы.

**Структура хранения:**
```
data/
├── {ID_сотрудника}/
│   ├── {ГОД}/
│   │   ├── {МЕСЯЦ}/
│   │   │   └── data.json
```

---

## Модули и компоненты

### Папки
- `data/` — основная папка для хранения данных (в корне проекта)

### Обновляемые файлы
- `.gitignore` — добавление `data/` в игнорируемые файлы (опционально)

---

## Зависимости

- **От каких задач зависит:** Нет (можно выполнять параллельно с другими подэтапами)
- **Какие задачи зависят от этой:**
  - TASK-002: Backend API (PHP endpoints) — будет использовать эту папку

---

## Ступенчатые подзадачи

### Шаг 1: Создание основной папки
1. Перейти в корень проекта:
   ```bash
   cd /var/www/back1
   ```
2. Создать папку `data/`:
   ```bash
   mkdir -p data
   ```
3. Проверить создание:
   ```bash
   ls -ld data/
   ```

### Шаг 2: Настройка прав доступа
1. Установить права на папку `data/`:
   ```bash
   chmod 775 data/
   ```
2. Проверить права:
   ```bash
   ls -ld data/
   # Должно быть: drwxrwxr-x
   ```
3. Проверить владельца папки (должен быть пользователь веб-сервера):
   ```bash
   ls -ld data/
   # Например: www-data или apache
   ```

### Шаг 3: Проверка прав PHP
1. Создать тестовый PHP файл `test-data-write.php`:
   ```php
   <?php
   $testDir = __DIR__ . '/data/test-write';
   if (!is_dir($testDir)) {
       mkdir($testDir, 0775, true);
   }
   
   $testFile = $testDir . '/test.json';
   file_put_contents($testFile, json_encode(['test' => 'data']));
   
   if (file_exists($testFile)) {
       echo "SUCCESS: PHP can write to data/ folder\n";
       unlink($testFile);
       rmdir($testDir);
   } else {
       echo "ERROR: PHP cannot write to data/ folder\n";
   }
   ```
2. Запустить тест:
   ```bash
   php test-data-write.php
   ```
3. Удалить тестовый файл:
   ```bash
   rm test-data-write.php
   ```

### Шаг 4: Создание тестовой структуры
1. Создать тестовую структуру:
   ```bash
   mkdir -p data/12345/2025/12
   ```
2. Проверить структуру:
   ```bash
   tree data/ -d
   # или
   find data/ -type d
   ```

### Шаг 5: Проверка записи файла
1. Создать тестовый JSON файл:
   ```bash
   echo '{"test": "data"}' > data/12345/2025/12/test.json
   ```
2. Проверить создание файла:
   ```bash
   cat data/12345/2025/12/test.json
   ```
3. Проверить права на файл:
   ```bash
   ls -l data/12345/2025/12/test.json
   # Должно быть: -rw-rw-r-- (664)
   ```

### Шаг 6: Очистка тестовых данных
1. Удалить тестовый файл:
   ```bash
   rm data/12345/2025/12/test.json
   ```
2. Удалить тестовые папки:
   ```bash
   rmdir data/12345/2025/12
   rmdir data/12345/2025
   rmdir data/12345
   ```
3. Проверить, что папка `data/` пустая:
   ```bash
   ls -la data/
   ```

### Шаг 7: Обновление .gitignore
1. Открыть файл `.gitignore`
2. Добавить строку (если нужно исключить данные из репозитория):
   ```
   # Данные табеля присутствия
   data/
   ```
3. Сохранить файл

---

## Технические требования

### Права доступа
- **Папки:** `775` (rwxrwxr-x)
  - Владелец и группа: чтение, запись, выполнение
  - Остальные: чтение, выполнение
- **Файлы:** `664` (rw-rw-r--)
  - Владелец и группа: чтение, запись
  - Остальные: только чтение

### Владелец папки
- Должен быть пользователь веб-сервера (например, `www-data`, `apache`, `nginx`)
- Проверка:
  ```bash
  ps aux | grep -E 'apache|httpd|nginx|php-fpm' | head -1
  ```

### Структура папок
- Папка `data/` должна быть в корне проекта
- PHP должен иметь права на создание подпапок и файлов

---

## Критерии приёмки

- [ ] Создана папка `data/` в корне проекта
- [ ] Права доступа на папку `data/` установлены: `775`
- [ ] PHP может создавать подпапки в `data/` (проверено тестом)
- [ ] PHP может создавать файлы в `data/` (проверено тестом)
- [ ] Тестовая структура создана и удалена успешно
- [ ] Папка `data/` пустая после очистки тестовых данных
- [ ] `data/` добавлена в `.gitignore` (если требуется)

---

## Примеры кода

### Тестовый PHP скрипт (test-data-write.php)
```php
<?php
/**
 * Тест записи в папку data/
 */

$dataDir = __DIR__ . '/data';
$testDir = $dataDir . '/test-write';

// Создание тестовой структуры
if (!is_dir($testDir)) {
    if (!mkdir($testDir, 0775, true)) {
        die("ERROR: Cannot create directory: $testDir\n");
    }
    echo "SUCCESS: Directory created: $testDir\n";
}

// Создание тестового файла
$testFile = $testDir . '/test.json';
$testData = ['test' => 'data', 'timestamp' => time()];

if (file_put_contents($testFile, json_encode($testData, JSON_PRETTY_PRINT))) {
    echo "SUCCESS: File created: $testFile\n";
    
    // Проверка чтения
    $readData = json_decode(file_get_contents($testFile), true);
    if ($readData === $testData) {
        echo "SUCCESS: File can be read correctly\n";
    } else {
        echo "ERROR: File read failed\n";
    }
    
    // Очистка
    unlink($testFile);
    rmdir($testDir);
    echo "SUCCESS: Test files cleaned up\n";
} else {
    die("ERROR: Cannot write file: $testFile\n");
}

echo "\nAll tests passed!\n";
```

### .gitignore (добавление)
```
# Данные табеля присутствия
data/
```

---

## Тестирование

### Проверка создания папки
```bash
# Проверка наличия папки
ls -ld data/

# Проверка прав доступа
ls -ld data/ | awk '{print $1}'
# Должно быть: drwxrwxr-x
```

### Проверка прав PHP
```bash
# Создать тестовый скрипт
cat > test-data-write.php << 'EOF'
<?php
$testDir = __DIR__ . '/data/test-write';
mkdir($testDir, 0775, true);
file_put_contents($testDir . '/test.json', '{"test": "data"}');
echo file_exists($testDir . '/test.json') ? "SUCCESS\n" : "ERROR\n";
unlink($testDir . '/test.json');
rmdir($testDir);
EOF

# Запустить тест
php test-data-write.php

# Удалить тестовый скрипт
rm test-data-write.php
```

### Проверка структуры
```bash
# Создать тестовую структуру
mkdir -p data/12345/2025/12

# Проверить структуру
tree data/ -d
# или
find data/ -type d

# Очистить
rm -rf data/12345
```

---

## История правок

- **2025-12-12 11:08 (UTC+3, Брест):** Создана задача TASK-001-03

---

## Примечания

### Важные замечания
- Права доступа критически важны — без них не будет работать сохранение данных
- Владелец папки должен быть пользователем веб-сервера
- Папка `data/` может содержать конфиденциальные данные — не коммитить в репозиторий

### Безопасность
- Папка `data/` должна быть недоступна напрямую через веб-сервер (через `.htaccess` или настройки nginx)
- Рекомендуется добавить `data/` в `.gitignore`

### Следующие шаги
После завершения этого подэтапа можно переходить к:
- TASK-002: Backend API (PHP endpoints) — будет использовать эту папку

---

## Связь с документацией

- **Родительская задача:** [TASK-001](TASK-001-preparation-infrastructure.md)
- **Техническое задание:** [DOCS/TZ/interface-timesheet-calendar.md](../TZ/interface-timesheet-calendar.md) - раздел 4.1
- **Этапы реализации:** [DOCS/TZ/implementation-stages.md](../TZ/implementation-stages.md)

