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

