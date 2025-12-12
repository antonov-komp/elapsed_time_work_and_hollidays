<?php
/**
 * Bootstrap файл для PHPUnit тестов
 * 
 * Инициализирует тестовое окружение
 */

// Установка тестовой директории для данных
define('TEST_DATA_DIR', __DIR__ . '/data');

// Создание тестовой директории, если её нет
if (!is_dir(TEST_DATA_DIR)) {
    mkdir(TEST_DATA_DIR, 0755, true);
}

// Подключение автозагрузчика Composer
require_once __DIR__ . '/../vendor/autoload.php';

// Подключение необходимых файлов
require_once __DIR__ . '/../api/helpers/FileHelper.php';
require_once __DIR__ . '/../api/helpers/ValidationHelper.php';
require_once __DIR__ . '/../api/helpers/SecurityHelper.php';

// Очистка тестовых данных перед запуском
if (is_dir(TEST_DATA_DIR)) {
    $files = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator(TEST_DATA_DIR, RecursiveDirectoryIterator::SKIP_DOTS),
        RecursiveIteratorIterator::CHILD_FIRST
    );
    
    foreach ($files as $fileinfo) {
        $todo = ($fileinfo->isDir() ? 'rmdir' : 'unlink');
        @$todo($fileinfo->getRealPath());
    }
}

