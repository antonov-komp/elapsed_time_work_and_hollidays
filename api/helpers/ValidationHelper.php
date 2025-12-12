<?php
/**
 * Класс для валидации данных
 * 
 * Используется для проверки входящих данных в API endpoints
 * 
 * @package api\helpers
 */
class ValidationHelper
{
    /**
     * Минимальный год
     * 
     * @var int
     */
    private const MIN_YEAR = 2025;
    
    /**
     * Максимальный год
     * 
     * @var int
     */
    private const MAX_YEAR = 2035;
    
    /**
     * Минимальный месяц
     * 
     * @var int
     */
    private const MIN_MONTH = 1;
    
    /**
     * Максимальный месяц
     * 
     * @var int
     */
    private const MAX_MONTH = 12;
    
    /**
     * Минимальное количество часов
     * 
     * @var float
     */
    private const MIN_HOURS = 0;
    
    /**
     * Максимальное количество часов
     * 
     * @var float
     */
    private const MAX_HOURS = 24;
    
    /**
     * Шаг для часов
     * 
     * @var float
     */
    private const HOURS_STEP = 0.5;
    
    /**
     * Допустимые статусы
     * 
     * @var array
     */
    private const ALLOWED_STATUSES = ['vacation', 'sick', 'day_off', 'holiday'];
    
    /**
     * Валидация года
     * 
     * @param mixed $year Год для проверки
     * @return bool true, если год валиден
     */
    public function validateYear($year): bool
    {
        if (!is_numeric($year)) {
            return false;
        }
        
        $year = (int)$year;
        
        return $year >= self::MIN_YEAR && $year <= self::MAX_YEAR;
    }
    
    /**
     * Валидация месяца
     * 
     * @param mixed $month Месяц для проверки
     * @return bool true, если месяц валиден
     */
    public function validateMonth($month): bool
    {
        if (!is_numeric($month)) {
            return false;
        }
        
        $month = (int)$month;
        
        return $month >= self::MIN_MONTH && $month <= self::MAX_MONTH;
    }
    
    /**
     * Валидация часов
     * 
     * @param mixed $hours Часы для проверки
     * @return bool true, если часы валидны
     */
    public function validateHours($hours): bool
    {
        if (!is_numeric($hours)) {
            return false;
        }
        
        $hours = (float)$hours;
        
        // Проверка диапазона
        if ($hours < self::MIN_HOURS || $hours > self::MAX_HOURS) {
            return false;
        }
        
        // Проверка шага (0, 0.5, 1, 1.5, ...)
        $steps = $hours / self::HOURS_STEP;
        return abs($steps - round($steps)) < 0.0001;
    }
    
    /**
     * Валидация статуса
     * 
     * @param mixed $status Статус для проверки
     * @return bool true, если статус валиден
     */
    public function validateStatus($status): bool
    {
        if ($status === null) {
            return true; // null - допустимое значение
        }
        
        if (!is_string($status)) {
            return false;
        }
        
        return in_array($status, self::ALLOWED_STATUSES, true);
    }
    
    /**
     * Валидация записи дня
     * 
     * Проверяет, что часы и статус не указаны одновременно
     * 
     * @param array $dayEntry Запись дня
     * @return bool true, если запись валидна
     */
    public function validateDayEntry(array $dayEntry): bool
    {
        $hasHours = isset($dayEntry['hours']) && $dayEntry['hours'] !== null;
        $hasStatus = isset($dayEntry['status']) && $dayEntry['status'] !== null;
        
        // Часы и статус не могут быть указаны одновременно
        if ($hasHours && $hasStatus) {
            return false;
        }
        
        // Должно быть указано либо часы, либо статус
        if (!$hasHours && !$hasStatus) {
            return false;
        }
        
        // Валидация часов, если указаны
        if ($hasHours && !$this->validateHours($dayEntry['hours'])) {
            return false;
        }
        
        // Валидация статуса, если указан
        if ($hasStatus && !$this->validateStatus($dayEntry['status'])) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Валидация данных дней
     * 
     * @param array $days Массив данных дней
     * @return array Массив ошибок валидации (пустой, если ошибок нет)
     */
    public function validateDaysData(array $days): array
    {
        $errors = [];
        
        foreach ($days as $day => $dayEntry) {
            // Проверка номера дня
            if (!is_numeric($day) || (int)$day < 1 || (int)$day > 31) {
                $errors[] = "Неверный номер дня: {$day}";
                continue;
            }
            
            // Проверка структуры записи
            if (!is_array($dayEntry)) {
                $errors[] = "День {$day}: неверный формат данных";
                continue;
            }
            
            // Валидация записи дня
            if (!$this->validateDayEntry($dayEntry)) {
                $errors[] = "День {$day}: неверные данные (часы и статус не могут быть указаны одновременно)";
            }
        }
        
        return $errors;
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
     * Получение минимального года
     * 
     * @return int
     */
    public function getMinYear(): int
    {
        return self::MIN_YEAR;
    }
    
    /**
     * Получение максимального года
     * 
     * @return int
     */
    public function getMaxYear(): int
    {
        return self::MAX_YEAR;
    }
}

