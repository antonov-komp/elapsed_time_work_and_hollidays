<?php
/**
 * Класс для работы с файловой системой
 * 
 * Используется для чтения и записи данных табеля присутствия
 * 
 * @package api\helpers
 */
class FileHelper
{
    /**
     * Базовый путь к папке с данными
     * 
     * @var string
     */
    private string $dataBasePath;
    
    /**
     * Конструктор
     * 
     * @param string|null $basePath Базовый путь (по умолчанию __DIR__ . '/../../data')
     */
    public function __construct(?string $basePath = null)
    {
        $this->dataBasePath = $basePath ?? __DIR__ . '/../../data';
    }
    
    /**
     * Получение пути к файлу данных табеля
     * 
     * @param int $userId ID пользователя
     * @param int $year Год
     * @param int $month Месяц (1-12)
     * @return string Путь к файлу
     */
    public function getTimesheetFilePath(int $userId, int $year, int $month): string
    {
        $path = $this->dataBasePath . '/' . $userId . '/' . $year . '/' . $month . '/data.json';
        return $path;
    }
    
    /**
     * Получение пути к директории данных табеля
     * 
     * @param int $userId ID пользователя
     * @param int $year Год
     * @param int $month Месяц (1-12)
     * @return string Путь к директории
     */
    public function getTimesheetDirPath(int $userId, int $year, int $month): string
    {
        $path = $this->dataBasePath . '/' . $userId . '/' . $year . '/' . $month;
        return $path;
    }
    
    /**
     * Создание структуры папок для данных табеля
     * 
     * @param int $userId ID пользователя
     * @param int $year Год
     * @param int $month Месяц (1-12)
     * @return bool Успешность создания
     */
    public function createTimesheetDir(int $userId, int $year, int $month): bool
    {
        $dirPath = $this->getTimesheetDirPath($userId, $year, $month);
        
        if (!file_exists($dirPath)) {
            return mkdir($dirPath, 0755, true);
        }
        
        return true;
    }
    
    /**
     * Чтение данных табеля из файла
     * 
     * @param int $userId ID пользователя
     * @param int $year Год
     * @param int $month Месяц (1-12)
     * @return array|null Данные табеля или null, если файл не существует
     */
    public function readTimesheet(int $userId, int $year, int $month): ?array
    {
        $filePath = $this->getTimesheetFilePath($userId, $year, $month);
        
        if (!file_exists($filePath)) {
            return null;
        }
        
        $content = file_get_contents($filePath);
        if ($content === false) {
            return null;
        }
        
        $data = json_decode($content, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            return null;
        }
        
        return $data;
    }
    
    /**
     * Сохранение данных табеля в файл
     * 
     * @param int $userId ID пользователя
     * @param int $year Год
     * @param int $month Месяц (1-12)
     * @param array $data Данные для сохранения
     * @return bool Успешность сохранения
     */
    public function saveTimesheet(int $userId, int $year, int $month, array $data): bool
    {
        // Создаём структуру папок, если не существует
        if (!$this->createTimesheetDir($userId, $year, $month)) {
            return false;
        }
        
        $filePath = $this->getTimesheetFilePath($userId, $year, $month);
        
        // Читаем существующие данные, если файл есть
        $existingData = $this->readTimesheet($userId, $year, $month);
        
        // Объединяем данные
        if ($existingData !== null) {
            // Обновляем существующие дни
            if (isset($existingData['days']) && isset($data['days'])) {
                $existingData['days'] = array_merge($existingData['days'], $data['days']);
            } else {
                $existingData['days'] = $data['days'] ?? [];
            }
            
            // Обновляем метаданные
            $existingData['updated_at'] = date('Y-m-d H:i:s');
            if (!isset($existingData['created_at'])) {
                $existingData['created_at'] = date('Y-m-d H:i:s');
            }
            
            $data = $existingData;
        } else {
            // Создаём новые данные
            $data['created_at'] = date('Y-m-d H:i:s');
            $data['updated_at'] = date('Y-m-d H:i:s');
        }
        
        // Сохраняем в файл
        $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        if ($json === false) {
            return false;
        }
        
        return file_put_contents($filePath, $json) !== false;
    }
}


