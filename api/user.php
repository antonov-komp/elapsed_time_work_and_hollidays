<?php
/**
 * API endpoint для получения данных текущего пользователя
 * 
 * GET /api/user.php - получение данных текущего пользователя
 * 
 * Используется метод Bitrix24 REST API: user.current
 * Документация: https://context7.com/bitrix24/rest/user.current
 * 
 * @package api
 */

require_once(__DIR__ . '/../crest.php');

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Обработка preflight запросов
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Только GET запросы
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Метод не разрешён. Используйте GET.'
    ]);
    exit;
}

try {
    // В контексте placement используем токен из AUTH_ID (текущий пользователь)
    // Если AUTH_ID не передан, используем сохранённый токен (владелец приложения)
    $userToken = null;
    
    // Проверяем токен в GET параметрах (из JavaScript fetch)
    if (!empty($_GET['AUTH_ID'])) {
        $userToken = htmlspecialchars($_GET['AUTH_ID']);
    }
    // Также проверяем в $_REQUEST (на случай, если передано через POST)
    elseif (!empty($_REQUEST['AUTH_ID'])) {
        $userToken = htmlspecialchars($_REQUEST['AUTH_ID']);
    }
    
    // Логирование для отладки (временно)
    error_log('API user.php: AUTH_ID from GET=' . ($_GET['AUTH_ID'] ?? 'null') . ', from REQUEST=' . ($_REQUEST['AUTH_ID'] ?? 'null') . ', userToken=' . ($userToken ?? 'null'));
    
    // Получение данных пользователя из Bitrix24
    // Если есть токен пользователя, передаём его напрямую
    if ($userToken !== null) {
        // Получаем endpoint из константы или файла настроек
        $endpoint = null;
        
        // Проверяем константу C_REST_WEB_HOOK_URL
        if (defined('C_REST_WEB_HOOK_URL') && !empty(C_REST_WEB_HOOK_URL)) {
            $endpoint = C_REST_WEB_HOOK_URL;
        } else {
            // Читаем из settings.json
            $settingsFile = __DIR__ . '/../settings.json';
            if (file_exists($settingsFile)) {
                $settingsData = json_decode(file_get_contents($settingsFile), true);
                if (!empty($settingsData['client_endpoint'])) {
                    $endpoint = $settingsData['client_endpoint'];
                }
            }
        }
        
        if (empty($endpoint)) {
            throw new Exception('Не настроено подключение к Bitrix24 (endpoint не найден)');
        }
        
        // Убеждаемся, что endpoint заканчивается на /
        if (substr($endpoint, -1) !== '/') {
            $endpoint .= '/';
        }
        
        // Формируем URL для запроса
        $url = $endpoint . 'user.current.json';
        
        // Выполняем запрос с токеном пользователя
        // Bitrix24 REST API ожидает параметр 'auth' в POST данных
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query(['auth' => $userToken]));
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Bitrix24 CRest PHP');
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);
        
        if ($curlError) {
            throw new Exception("CURL error: {$curlError}");
        }
        
        if ($httpCode !== 200) {
            throw new Exception("HTTP error! status: {$httpCode}, response: {$response}");
        }
        
        $user = json_decode($response, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("JSON decode error: " . json_last_error_msg());
        }
    } else {
        // Используем стандартный метод CRest (токен владельца)
        $user = CRest::call('user.current');
    }
    
    if (empty($user['result']) || !empty($user['error'])) {
        throw new Exception($user['error_description'] ?? $user['error'] ?? 'Не удалось получить данные пользователя');
    }
    
    // Формирование ответа
    $response = [
        'success' => true,
        'result' => $user['result']
    ];
    
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'error_description' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}

