<?php
/**
 * Placement для табеля присутствия в Bitrix24
 * 
 * Подключает Vue.js приложение табеля присутствия
 * Использует собранные файлы из dist/
 * 
 * Метод Bitrix24 API: placement.bind
 * Документация: https://context7.com/bitrix24/rest/placement/
 */

// Разрешаем загрузку в iframe для Bitrix24
header('Content-Type: text/html; charset=utf-8');
header('X-Content-Type-Options: nosniff');
// Не устанавливаем X-Frame-Options, чтобы разрешить загрузку в iframe из Bitrix24

require_once(__DIR__ . '/crest.php');

// Путь к собранным файлам Vue.js приложения
// Vite генерирует пути относительно корня сайта
$assetsPath = '/js/vue-apps/timesheet/dist/assets';

?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Табель присутствия</title>
    
    <!-- Подключение собранных CSS файлов -->
    <!-- Все стили (включая EditDayModal) включены в основной bundle -->
    <link rel="stylesheet" href="<?= $assetsPath ?>/index.css?v=<?= time() ?>">
</head>
<body>
    <!-- Контейнер для Vue.js приложения -->
    <div id="vue-timesheet-app"></div>
    
    <!-- Передача токена пользователя в JavaScript для API запросов -->
    <script>
    // Передача токена пользователя из placement в глобальную переменную
    // Bitrix24 передаёт AUTH_ID в параметрах placement для текущего пользователя
    window.PLACEMENT_AUTH_ID = <?= json_encode($_REQUEST['AUTH_ID'] ?? null) ?>;
    
    // Логирование для отладки (временно)
    console.log('Placement AUTH_ID:', window.PLACEMENT_AUTH_ID ? 'передан' : 'не передан');
    </script>
    
    <!-- Подключение собранных JS файлов -->
    <!-- Все компоненты (включая EditDayModal) включены в основной bundle -->
    <script type="module" src="<?= $assetsPath ?>/index.js?v=<?= time() ?>"></script>
    
    <script>
    // Логирование для отладки
    console.log('Placement loaded:', {
        placementOptions: <?= json_encode($_REQUEST['PLACEMENT_OPTIONS'] ?? null) ?>,
        assetsPath: '<?= $assetsPath ?>'
    });
    
    // Проверка загрузки Vue.js приложения
    document.addEventListener('DOMContentLoaded', function() {
        const appContainer = document.getElementById('vue-timesheet-app');
        if (!appContainer) {
            console.error('Контейнер #vue-timesheet-app не найден!');
        } else {
            console.log('Контейнер #vue-timesheet-app найден, ожидание загрузки Vue.js...');
            
            // Проверка через небольшую задержку
            setTimeout(function() {
                if (appContainer.innerHTML.trim() === '') {
                    console.warn('Vue.js приложение не загрузилось. Проверьте пути к файлам.');
                } else {
                    console.log('Vue.js приложение успешно загружено!');
                }
            }, 2000);
        }
    });
    </script>
</body>
</html>
