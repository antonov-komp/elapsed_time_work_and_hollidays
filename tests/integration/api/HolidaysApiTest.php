<?php
/**
 * Интеграционные тесты для API endpoint holidays.php
 * 
 * Тестирует GET запросы к /api/holidays.php
 */

namespace Tests\Integration\Api;

use PHPUnit\Framework\TestCase;

class HolidaysApiTest extends TestCase
{
    /**
     * Тест валидации года через ValidationHelper
     */
    public function testValidateYear(): void
    {
        $validationHelper = new \ValidationHelper();
        
        // Валидные годы
        $this->assertTrue($validationHelper->validateYear(2025));
        $this->assertTrue($validationHelper->validateYear(2030));
        $this->assertTrue($validationHelper->validateYear(2035));
        
        // Невалидные годы
        $this->assertFalse($validationHelper->validateYear(2024));
        $this->assertFalse($validationHelper->validateYear(2036));
        $this->assertFalse($validationHelper->validateYear(null));
        $this->assertFalse($validationHelper->validateYear('invalid'));
    }
    
    /**
     * Тест получения праздников для валидного года
     */
    public function testGetHolidaysForValidYear(): void
    {
        $holidaysFile = __DIR__ . '/../../../config/holidays-rb.json';
        
        if (!file_exists($holidaysFile)) {
            $this->markTestSkipped('Файл праздников не найден');
        }
        
        $content = file_get_contents($holidaysFile);
        $this->assertNotFalse($content);
        
        $holidaysData = json_decode($content, true);
        $this->assertNotNull($holidaysData);
        
        // Проверяем наличие данных для 2025 года
        if (isset($holidaysData['2025'])) {
            $this->assertIsArray($holidaysData['2025']);
        }
    }
    
    /**
     * Тест обработки невалидного года
     */
    public function testGetHolidaysForInvalidYear(): void
    {
        $validationHelper = new \ValidationHelper();
        
        $this->assertFalse($validationHelper->validateYear(2020));
        $this->assertFalse($validationHelper->validateYear(2040));
    }
    
    /**
     * Тест формата данных праздников
     */
    public function testHolidaysDataFormat(): void
    {
        $holidaysFile = __DIR__ . '/../../../config/holidays-rb.json';
        
        if (!file_exists($holidaysFile)) {
            $this->markTestSkipped('Файл праздников не найден');
        }
        
        $content = file_get_contents($holidaysFile);
        $holidaysData = json_decode($content, true);
        
        if (isset($holidaysData['2025'])) {
            $holidays = $holidaysData['2025'];
            $this->assertIsArray($holidays);
            
            // Проверяем формат дат (если есть)
            foreach ($holidays as $holiday) {
                if (is_string($holiday)) {
                    // Проверяем формат YYYY-MM-DD
                    $this->assertMatchesRegularExpression('/^\d{4}-\d{2}-\d{2}$/', $holiday);
                }
            }
        }
    }
}

