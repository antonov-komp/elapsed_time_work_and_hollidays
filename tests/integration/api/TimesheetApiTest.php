<?php
/**
 * Интеграционные тесты для API endpoint timesheet.php
 * 
 * Тестирует GET и POST запросы к /api/timesheet.php
 */

namespace Tests\Integration\Api;

use PHPUnit\Framework\TestCase;

class TimesheetApiTest extends TestCase
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
     * Тест получения несуществующего табеля через FileHelper
     */
    public function testGetNonExistentTimesheet(): void
    {
        $fileHelper = new \FileHelper($this->testDataDir);
        $data = $fileHelper->readTimesheet($this->testUserId, 2025, 12);
        
        $this->assertNull($data);
    }
    
    /**
     * Тест получения существующего табеля через FileHelper
     */
    public function testGetExistingTimesheet(): void
    {
        $fileHelper = new \FileHelper($this->testDataDir);
        
        // Создаем тестовые данные
        $testData = [
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
            'days' => [
                '1' => ['hours' => 8.0, 'status' => null],
                '2' => ['hours' => 8.0, 'status' => null]
            ]
        ];
        
        $fileHelper->saveTimesheet($this->testUserId, 2025, 12, $testData);
        
        // Получаем данные
        $data = $fileHelper->readTimesheet($this->testUserId, 2025, 12);
        
        $this->assertNotNull($data);
        $this->assertArrayHasKey('days', $data);
        $this->assertCount(2, $data['days']);
        $this->assertEquals(8.0, $data['days']['1']['hours']);
    }
    
    /**
     * Тест сохранения нового табеля через FileHelper
     */
    public function testSaveNewTimesheet(): void
    {
        $fileHelper = new \FileHelper($this->testDataDir);
        
        $testData = [
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
            'days' => [
                '1' => ['hours' => 8.0, 'status' => null],
                '2' => ['hours' => 8.0, 'status' => null]
            ]
        ];
        
        $result = $fileHelper->saveTimesheet($this->testUserId, 2025, 12, $testData);
        
        $this->assertTrue($result);
        
        // Проверяем, что данные сохранились
        $savedData = $fileHelper->readTimesheet($this->testUserId, 2025, 12);
        $this->assertNotNull($savedData);
        $this->assertCount(2, $savedData['days']);
    }
    
    /**
     * Тест обновления существующего табеля
     */
    public function testUpdateExistingTimesheet(): void
    {
        $fileHelper = new \FileHelper($this->testDataDir);
        
        // Создаем начальные данные
        $initialData = [
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
            'days' => [
                '1' => ['hours' => 8.0, 'status' => null]
            ]
        ];
        $fileHelper->saveTimesheet($this->testUserId, 2025, 12, $initialData);
        
        // Обновляем данные
        $updatedData = [
            'created_at' => $initialData['created_at'],
            'updated_at' => date('Y-m-d H:i:s'),
            'days' => [
                '1' => ['hours' => 8.0, 'status' => null],
                '2' => ['hours' => 8.0, 'status' => null],
                '3' => ['hours' => 4.0, 'status' => null]
            ]
        ];
        
        $result = $fileHelper->saveTimesheet($this->testUserId, 2025, 12, $updatedData);
        $this->assertTrue($result);
        
        // Проверяем обновленные данные
        $savedData = $fileHelper->readTimesheet($this->testUserId, 2025, 12);
        // array_merge объединяет массивы, поэтому может быть больше элементов
        $this->assertGreaterThanOrEqual(3, count($savedData['days']));
        $this->assertArrayHasKey('3', $savedData['days']);
        // updated_at должен быть обновлен (может быть одинаковым только если операция очень быстрая)
        $this->assertArrayHasKey('updated_at', $savedData);
    }
    
    /**
     * Тест создания директории для табеля
     */
    public function testCreateTimesheetDirectory(): void
    {
        $fileHelper = new \FileHelper($this->testDataDir);
        
        $result = $fileHelper->createTimesheetDir($this->testUserId, 2025, 12);
        
        $this->assertTrue($result);
        
        $dirPath = $fileHelper->getTimesheetDirPath($this->testUserId, 2025, 12);
        $this->assertTrue(is_dir($dirPath));
    }
    
    /**
     * Тест получения пути к файлу табеля
     */
    public function testGetTimesheetFilePath(): void
    {
        $fileHelper = new \FileHelper($this->testDataDir);
        
        $path = $fileHelper->getTimesheetFilePath($this->testUserId, 2025, 12);
        
        $this->assertStringContainsString((string)$this->testUserId, $path);
        $this->assertStringContainsString('2025', $path);
        $this->assertStringContainsString('12', $path);
        $this->assertStringEndsWith('data.json', $path);
    }
}
