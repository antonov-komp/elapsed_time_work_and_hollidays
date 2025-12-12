<?php
/**
 * Класс для проверки безопасности
 * 
 * Используется для проверки прав доступа и защиты от атак
 * 
 * @package api\helpers
 */
class SecurityHelper
{
    /**
     * Проверка прав доступа пользователя
     * 
     * Пользователь может редактировать только свой табель
     * 
     * @param int $userId ID пользователя, который запрашивает доступ
     * @param int $targetUserId ID пользователя, данные которого запрашиваются
     * @return bool true, если доступ разрешён
     */
    public function checkUserAccess(int $userId, int $targetUserId): bool
    {
        return $userId === $targetUserId;
    }
    
    /**
     * Санитизация пути файла
     * 
     * Защита от path traversal атак
     * 
     * @param string $path Путь для санитизации
     * @return string Очищенный путь
     */
    public function sanitizePath(string $path): string
    {
        // Удаляем все символы, кроме букв, цифр, слэшей, точек, дефисов и подчёркиваний
        $path = preg_replace('/[^a-zA-Z0-9\/\.\-_]/', '', $path);
        
        // Удаляем последовательности '../'
        $path = str_replace('../', '', $path);
        $path = str_replace('..\\', '', $path);
        
        // Удаляем двойные слэши
        $path = preg_replace('#/+#', '/', $path);
        
        return $path;
    }
    
    /**
     * Валидация ID пользователя
     * 
     * @param mixed $userId ID пользователя
     * @return bool true, если ID валиден
     */
    public function validateUserId($userId): bool
    {
        if (!is_numeric($userId)) {
            return false;
        }
        
        $userId = (int)$userId;
        
        return $userId > 0;
    }
    
    /**
     * Логирование операции
     * 
     * @param string $operation Название операции
     * @param array $data Данные для логирования
     * @param string $type Тип лога (info, warning, error)
     * @return void
     */
    public function logOperation(string $operation, array $data = [], string $type = 'info'): void
    {
        $logDir = __DIR__ . '/../../logs';
        
        if (!file_exists($logDir)) {
            mkdir($logDir, 0755, true);
        }
        
        $logFile = $logDir . '/api_' . date('Y-m-d') . '.log';
        
        $logEntry = [
            'timestamp' => date('Y-m-d H:i:s'),
            'type' => $type,
            'operation' => $operation,
            'data' => $data
        ];
        
        $logLine = json_encode($logEntry, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . "\n";
        
        file_put_contents($logFile, $logLine, FILE_APPEND);
    }
}

