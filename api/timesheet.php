<?php
/**
 * API endpoint для работы с табелем присутствия
 * 
 * GET /api/timesheet.php?year=2025&month=12 - получение данных
 * POST /api/timesheet.php?year=2025&month=12 - сохранение данных
 * 
 * Используется метод Bitrix24 REST API: user.current
 * Документация: https://context7.com/bitrix24/rest/user.current
 * 
 * @package api
 */

require_once(__DIR__ . '/../crest.php');
require_once(__DIR__ . '/helpers/ValidationHelper.php');
require_once(__DIR__ . '/helpers/SecurityHelper.php');
require_once(__DIR__ . '/helpers/FileHelper.php');

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
    $securityHelper = new SecurityHelper();
    $securityHelper->logOperation('api_error', array_merge(['message' => $message], $context), 'error');
}

try {
    // Получение данных пользователя из Bitrix24
    $user = CRest::call('user.current');
    
    if (empty($user['result']) || !isset($user['result']['ID'])) {
        throw new Exception('Не удалось получить данные пользователя из Bitrix24');
    }
    
    $userId = (int)$user['result']['ID'];
    
    // Инициализация помощников
    $validationHelper = new ValidationHelper();
    $securityHelper = new SecurityHelper();
    $fileHelper = new FileHelper();
    
    // Получение параметров запроса
    $year = isset($_GET['year']) ? (int)$_GET['year'] : null;
    $month = isset($_GET['month']) ? (int)$_GET['month'] : null;
    
    // Валидация параметров
    if (!$validationHelper->validateYear($year)) {
        throw new Exception('Неверный год (должен быть ' . $validationHelper->getMinYear() . '-' . $validationHelper->getMaxYear() . ')');
    }
    
    if (!$validationHelper->validateMonth($month)) {
        throw new Exception('Неверный месяц (должен быть 1-12)');
    }
    
    // Обработка GET запроса (получение данных)
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Чтение данных табеля
        $data = $fileHelper->readTimesheet($userId, $year, $month);
        
        // Если файл не существует, возвращаем пустой объект
        if ($data === null) {
            $data = [
                'created_at' => null,
                'updated_at' => null,
                'days' => []
            ];
        }
        
        // Логирование операции
        $securityHelper->logOperation('get_timesheet', [
            'user_id' => $userId,
            'year' => $year,
            'month' => $month
        ], 'info');
        
        sendJsonResponse(true, $data);
    }
    // Обработка POST запроса (сохранение данных)
    elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Получение данных из тела запроса
        $input = file_get_contents('php://input');
        $inputData = json_decode($input, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Ошибка декодирования JSON: ' . json_last_error_msg());
        }
        
        if (!isset($inputData['days']) || !is_array($inputData['days'])) {
            throw new Exception('Неверный формат данных: отсутствует массив days');
        }
        
        // Валидация данных дней
        $validationErrors = $validationHelper->validateDaysData($inputData['days']);
        
        if (!empty($validationErrors)) {
            sendJsonResponse(false, null, 'Ошибки валидации: ' . implode(', ', $validationErrors), 400);
            exit;
        }
        
        // Сохранение данных
        $saveData = [
            'days' => $inputData['days']
        ];
        
        $result = $fileHelper->saveTimesheet($userId, $year, $month, $saveData);
        
        if (!$result) {
            throw new Exception('Не удалось сохранить данные табеля');
        }
        
        // Чтение сохранённых данных для ответа
        $savedData = $fileHelper->readTimesheet($userId, $year, $month);
        
        // Логирование операции
        $securityHelper->logOperation('save_timesheet', [
            'user_id' => $userId,
            'year' => $year,
            'month' => $month,
            'days_count' => count($inputData['days'])
        ], 'info');
        
        sendJsonResponse(true, [
            'created_at' => $savedData['created_at'] ?? null,
            'updated_at' => $savedData['updated_at'] ?? null
        ]);
    }
    // Неподдерживаемый метод
    else {
        throw new Exception('Метод ' . $_SERVER['REQUEST_METHOD'] . ' не поддерживается');
    }
} catch (Exception $e) {
    // Логирование ошибки
    logError($e->getMessage(), [
        'trace' => $e->getTraceAsString(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ]);
    
    // Определение HTTP кода ошибки
    $httpCode = 500;
    $errorMessage = $e->getMessage();
    
    // Ошибки валидации - 400
    if (strpos($errorMessage, 'Неверный') !== false || strpos($errorMessage, 'Ошибка декодирования') !== false) {
        $httpCode = 400;
    }
    
    sendJsonResponse(false, null, $errorMessage, $httpCode);
}

