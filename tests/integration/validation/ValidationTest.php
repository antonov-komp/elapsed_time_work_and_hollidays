<?php
/**
 * Интеграционные тесты для валидации данных на backend
 * 
 * Тестирует ValidationHelper для валидации всех типов данных
 */

namespace Tests\Integration\Validation;

use PHPUnit\Framework\TestCase;

class ValidationTest extends TestCase
{
    private \ValidationHelper $validationHelper;
    
    protected function setUp(): void
    {
        $this->validationHelper = new \ValidationHelper();
    }
    
    /**
     * Тест валидации года (2025-2035)
     */
    public function testValidateYear(): void
    {
        // Валидные годы
        $this->assertTrue($this->validationHelper->validateYear(2025));
        $this->assertTrue($this->validationHelper->validateYear(2030));
        $this->assertTrue($this->validationHelper->validateYear(2035));
        
        // Невалидные годы
        $this->assertFalse($this->validationHelper->validateYear(2024));
        $this->assertFalse($this->validationHelper->validateYear(2036));
        $this->assertFalse($this->validationHelper->validateYear(null));
        $this->assertFalse($this->validationHelper->validateYear('invalid'));
        $this->assertFalse($this->validationHelper->validateYear(0));
    }
    
    /**
     * Тест валидации месяца (1-12)
     */
    public function testValidateMonth(): void
    {
        // Валидные месяцы
        for ($month = 1; $month <= 12; $month++) {
            $this->assertTrue($this->validationHelper->validateMonth($month));
        }
        
        // Невалидные месяцы
        $this->assertFalse($this->validationHelper->validateMonth(0));
        $this->assertFalse($this->validationHelper->validateMonth(13));
        $this->assertFalse($this->validationHelper->validateMonth(null));
        $this->assertFalse($this->validationHelper->validateMonth('invalid'));
    }
    
    /**
     * Тест валидации часов (0-24, шаг 0.5)
     */
    public function testValidateHours(): void
    {
        // Валидные часы
        $this->assertTrue($this->validationHelper->validateHours(0));
        $this->assertTrue($this->validationHelper->validateHours(0.5));
        $this->assertTrue($this->validationHelper->validateHours(8));
        $this->assertTrue($this->validationHelper->validateHours(8.5));
        $this->assertTrue($this->validationHelper->validateHours(24));
        
        // Невалидные часы
        $this->assertFalse($this->validationHelper->validateHours(-1));
        $this->assertFalse($this->validationHelper->validateHours(25));
        $this->assertFalse($this->validationHelper->validateHours(1.3)); // Не кратно 0.5
        $this->assertFalse($this->validationHelper->validateHours(null));
        $this->assertFalse($this->validationHelper->validateHours('invalid'));
    }
    
    /**
     * Тест валидации статусов
     */
    public function testValidateStatus(): void
    {
        // Валидные статусы
        $this->assertTrue($this->validationHelper->validateStatus('vacation'));
        $this->assertTrue($this->validationHelper->validateStatus('sick'));
        $this->assertTrue($this->validationHelper->validateStatus('day_off'));
        $this->assertTrue($this->validationHelper->validateStatus('holiday'));
        
        // null - допустимое значение
        $this->assertTrue($this->validationHelper->validateStatus(null));
        
        // Невалидные статусы
        $this->assertFalse($this->validationHelper->validateStatus('invalid_status'));
        $this->assertFalse($this->validationHelper->validateStatus(''));
    }
    
    /**
     * Тест бизнес-правил - часы и статус не одновременно
     */
    public function testValidateDayEntryHoursAndStatus(): void
    {
        // Валидные записи
        $this->assertTrue($this->validationHelper->validateDayEntry([
            'hours' => 8.0,
            'status' => null
        ]));
        
        $this->assertTrue($this->validationHelper->validateDayEntry([
            'hours' => null,
            'status' => 'vacation'
        ]));
        
        // Невалидные записи - часы и статус одновременно
        $this->assertFalse($this->validationHelper->validateDayEntry([
            'hours' => 8.0,
            'status' => 'vacation'
        ]));
    }
    
    /**
     * Тест обработки невалидных данных
     */
    public function testHandleInvalidData(): void
    {
        // Пустой массив - невалиден (должно быть либо часы, либо статус)
        $this->assertFalse($this->validationHelper->validateDayEntry([]));
        
        // Невалидный тип данных - будет TypeError, но это нормально для строгой типизации
        // Проверяем, что метод требует array
        $this->expectException(\TypeError::class);
        $this->validationHelper->validateDayEntry('invalid');
    }
    
    /**
     * Тест обработки отсутствующих данных
     */
    public function testHandleMissingData(): void
    {
        // Пустая запись дня - невалидна (должно быть либо часы, либо статус)
        $this->assertFalse($this->validationHelper->validateDayEntry([
            'hours' => null,
            'status' => null
        ]));
    }
    
    /**
     * Тест обработки некорректных типов данных
     */
    public function testHandleIncorrectTypes(): void
    {
        // Часы как строка - is_numeric('8') вернет true, но validateHours проверит тип
        // Проверяем реальное поведение: is_numeric('8') = true, но после (float)'8' = 8.0, что валидно
        // Поэтому '8' может пройти валидацию, но это нормально
        
        // Месяц как строка - is_numeric('12') = true, (int)'12' = 12, что валидно
        $this->assertTrue($this->validationHelper->validateMonth('12'));
        
        // Год как массив - is_numeric([2025]) = false
        $this->assertFalse($this->validationHelper->validateYear([2025]));
        
        // Часы как строка, которая не является числом
        $this->assertFalse($this->validationHelper->validateHours('invalid'));
    }
    
    /**
     * Тест валидации массива дней
     */
    public function testValidateDaysData(): void
    {
        // Валидные данные
        $validDays = [
            '1' => ['hours' => 8.0, 'status' => null],
            '2' => ['hours' => null, 'status' => 'vacation'],
            '3' => ['hours' => 4.0, 'status' => null]
        ];
        
        $errors = $this->validationHelper->validateDaysData($validDays);
        $this->assertEmpty($errors);
        
        // Невалидные данные - часы и статус одновременно
        $invalidDays = [
            '1' => ['hours' => 8.0, 'status' => 'vacation']
        ];
        
        $errors = $this->validationHelper->validateDaysData($invalidDays);
        $this->assertNotEmpty($errors);
    }
}

