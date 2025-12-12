<?php
/**
 * API endpoint для получения праздников
 * 
 * GET /api/holidays.php?year=2025
 * 
 * @package api
 */

require_once(__DIR__ . '/helpers/ValidationHelper.php');

header('Content-Type: application/json; charset=utf-8');

/**
 * Функция для отправки JSON ответа
 * 
 * @param bool $success Успешность операции
 * @param mixed $data Данные ответа
 * @param string|null $error Сообщение об ошибке
 * @param int $httpCode HTTP код ответа
 * @return void
 */
function sendJsonResponse(bool $success, $data = null, ?string $error = null, int $httpCode = 200): void
{
    http_response_code($httpCode);
    
    $response = [
        'success' => $success
    ];
    
    if ($success) {
        $response['data'] = $data;
    } else {
        $response['error'] = $error;
    }
    
    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}

/**
 * Функция для логирования ошибки
 * 
 * @param string $message Сообщение об ошибке
 * @param array $context Контекст ошибки
 * @return void
 */
function logError(string $message, array $context = []): void
{
    $logDir = __DIR__ . '/../logs';
    
    if (!file_exists($logDir)) {
        mkdir($logDir, 0755, true);
    }
    
    $logFile = $logDir . '/api_' . date('Y-m-d') . '.log';
    
    $logEntry = [
        'timestamp' => date('Y-m-d H:i:s'),
        'type' => 'error',
        'operation' => 'get_holidays',
        'message' => $message,
        'context' => $context
    ];
    
    $logLine = json_encode($logEntry, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . "\n";
    
    file_put_contents($logFile, $logLine, FILE_APPEND);
}

try {
    // Получение параметра года
    $year = isset($_GET['year']) ? (int)$_GET['year'] : null;
    
    // Валидация года
    $validationHelper = new ValidationHelper();
    
    if (!$validationHelper->validateYear($year)) {
        throw new Exception('Неверный год (должен быть 2025-2035)');
    }
    
    // Путь к файлу праздников
    $holidaysFile = __DIR__ . '/../config/holidays-rb.json';
    
    // Проверка существования файла
    if (!file_exists($holidaysFile)) {
        throw new Exception('Файл праздников не найден');
    }
    
    // Чтение файла
    $holidaysContent = file_get_contents($holidaysFile);
    
    if ($holidaysContent === false) {
        throw new Exception('Не удалось прочитать файл праздников');
    }
    
    // Декодирование JSON
    $holidaysData = json_decode($holidaysContent, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Ошибка чтения файла праздников: ' . json_last_error_msg());
    }
    
    // Получение праздников для указанного года
    $holidays = $holidaysData[(string)$year] ?? [];
    
    // Если года нет в файле, возвращаем пустой массив
    if (empty($holidays)) {
        $holidays = [];
    }
    
    sendJsonResponse(true, $holidays);
    
} catch (Exception $e) {
    // Логирование ошибки
    logError($e->getMessage(), [
        'trace' => $e->getTraceAsString(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ]);
    
    // Определение HTTP кода ошибки
    $httpCode = 400;
    
    if (strpos($e->getMessage(), 'не найден') !== false || strpos($e->getMessage(), 'Не удалось прочитать') !== false) {
        $httpCode = 500;
    }
    
    sendJsonResponse(false, null, $e->getMessage(), $httpCode);
}

