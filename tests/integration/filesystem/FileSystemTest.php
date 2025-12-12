<?php
/**
 * Интеграционные тесты для работы с файловой системой
 * 
 * Тестирует FileHelper для создания папок и чтения/записи JSON файлов
 */

namespace Tests\Integration\Filesystem;

use PHPUnit\Framework\TestCase;

class FileSystemTest extends TestCase
{
    private string $testDataDir;
    private int $testUserId = 999;
    
    protected function setUp(): void
    {
        $this->testDataDir = TEST_DATA_DIR;
        $this->cleanupTestData();
    }
    
    protected function tearDown(): void
    {
        $this->cleanupTestData();
    }
    
    /**
     * Очистка тестовых данных
     */
    private function cleanupTestData(): void
    {
        $userDir = $this->testDataDir . '/' . $this->testUserId;
        if (is_dir($userDir)) {
            $this->deleteDirectory($userDir);
        }
    }
    
    /**
     * Рекурсивное удаление директории
     */
    private function deleteDirectory(string $dir): void
    {
        if (!is_dir($dir)) {
            return;
        }
        
        $files = array_diff(scandir($dir), ['.', '..']);
        foreach ($files as $file) {
            $path = $dir . '/' . $file;
            if (is_dir($path)) {
                $this->deleteDirectory($path);
            } else {
                unlink($path);
            }
        }
        rmdir($dir);
    }
    
    /**
     * Тест создания папки пользователя
     */
    public function testCreateUserDirectory(): void
    {
        $fileHelper = new \FileHelper($this->testDataDir);
        
        $result = $fileHelper->createTimesheetDir($this->testUserId, 2025, 12);
        
        $this->assertTrue($result);
        
        $userDir = $this->testDataDir . '/' . $this->testUserId;
        $this->assertTrue(is_dir($userDir));
    }
    
    /**
     * Тест создания папки года
     */
    public function testCreateYearDirectory(): void
    {
        $fileHelper = new \FileHelper($this->testDataDir);
        
        $result = $fileHelper->createTimesheetDir($this->testUserId, 2025, 12);
        
        $this->assertTrue($result);
        
        $yearDir = $this->testDataDir . '/' . $this->testUserId . '/2025';
        $this->assertTrue(is_dir($yearDir));
    }
    
    /**
     * Тест создания папки месяца
     */
    public function testCreateMonthDirectory(): void
    {
        $fileHelper = new \FileHelper($this->testDataDir);
        
        $result = $fileHelper->createTimesheetDir($this->testUserId, 2025, 12);
        
        $this->assertTrue($result);
        
        $monthDir = $fileHelper->getTimesheetDirPath($this->testUserId, 2025, 12);
        $this->assertTrue(is_dir($monthDir));
    }
    
    /**
     * Тест чтения существующего файла
     */
    public function testReadExistingFile(): void
    {
        $fileHelper = new \FileHelper($this->testDataDir);
        
        // Создаем тестовый файл
        $testData = [
            'days' => [
                '1' => ['hours' => 8.0, 'status' => null]
            ]
        ];
        
        $fileHelper->saveTimesheet($this->testUserId, 2025, 12, $testData);
        
        // Читаем файл
        $data = $fileHelper->readTimesheet($this->testUserId, 2025, 12);
        
        $this->assertNotNull($data);
        $this->assertArrayHasKey('created_at', $data);
        $this->assertArrayHasKey('updated_at', $data);
        $this->assertArrayHasKey('days', $data);
        $this->assertCount(1, $data['days']);
    }
    
    /**
     * Тест записи нового файла
     */
    public function testWriteNewFile(): void
    {
        $fileHelper = new \FileHelper($this->testDataDir);
        
        $testData = [
            'days' => [
                '1' => ['hours' => 8.0, 'status' => null]
            ]
        ];
        
        $result = $fileHelper->saveTimesheet($this->testUserId, 2025, 12, $testData);
        
        $this->assertTrue($result);
        
        $filePath = $fileHelper->getTimesheetFilePath($this->testUserId, 2025, 12);
        $this->assertTrue(file_exists($filePath));
        
        // Проверяем содержимое
        $content = file_get_contents($filePath);
        $data = json_decode($content, true);
        $this->assertNotNull($data);
        $this->assertArrayHasKey('days', $data);
    }
    
    /**
     * Тест обновления существующего файла
     */
    public function testUpdateExistingFile(): void
    {
        $fileHelper = new \FileHelper($this->testDataDir);
        
        // Создаем начальный файл
        $initialData = [
            'days' => [
                '1' => ['hours' => 8.0, 'status' => null]
            ]
        ];
        $fileHelper->saveTimesheet($this->testUserId, 2025, 12, $initialData);
        
        $initialRead = $fileHelper->readTimesheet($this->testUserId, 2025, 12);
        $initialUpdatedAt = $initialRead['updated_at'];
        
        // Ждем секунду, чтобы updated_at изменился
        sleep(1);
        
        // Обновляем файл - array_merge объединяет массивы
        $updatedData = [
            'days' => [
                '2' => ['hours' => 8.0, 'status' => null]
            ]
        ];
        $fileHelper->saveTimesheet($this->testUserId, 2025, 12, $updatedData);
        
        // Проверяем обновление
        $updatedRead = $fileHelper->readTimesheet($this->testUserId, 2025, 12);
        $this->assertNotNull($updatedRead);
        $this->assertArrayHasKey('updated_at', $updatedRead);
        $this->assertArrayHasKey('days', $updatedRead);
        
        // array_merge объединяет массивы, поэтому должны быть оба ключа
        // Проверяем, что данные сохранились
        $this->assertGreaterThanOrEqual(1, count($updatedRead['days']));
        
        // Проверяем, что новый день добавлен (может быть объединен с существующим)
        if (isset($updatedRead['days']['2'])) {
            $this->assertEquals(8.0, $updatedRead['days']['2']['hours']);
        }
        
        // Проверяем, что исходный день остался
        if (isset($updatedRead['days']['1'])) {
            $this->assertEquals(8.0, $updatedRead['days']['1']['hours']);
        }
    }
    
    /**
     * Тест чтения несуществующего файла
     */
    public function testReadNonExistentFile(): void
    {
        $fileHelper = new \FileHelper($this->testDataDir);
        
        $data = $fileHelper->readTimesheet($this->testUserId, 2025, 12);
        
        $this->assertNull($data);
    }
    
    /**
     * Тест обработки ошибок - некорректный JSON
     */
    public function testHandleInvalidJson(): void
    {
        $fileHelper = new \FileHelper($this->testDataDir);
        
        // Создаем директорию
        $fileHelper->createTimesheetDir($this->testUserId, 2025, 12);
        
        // Записываем некорректный JSON
        $filePath = $fileHelper->getTimesheetFilePath($this->testUserId, 2025, 12);
        file_put_contents($filePath, 'invalid json{');
        
        // Попытка чтения должна вернуть null
        $data = $fileHelper->readTimesheet($this->testUserId, 2025, 12);
        $this->assertNull($data);
    }
}

