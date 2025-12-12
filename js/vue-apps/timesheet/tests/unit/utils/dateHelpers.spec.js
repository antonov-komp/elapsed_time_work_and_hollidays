/**
 * Unit-тесты для утилит работы с датами
 * 
 * Тестируются все функции из utils/dateHelpers.js
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
    getCurrentDate,
    getCurrentYear,
    getCurrentMonth,
    isToday,
    isWeekend,
    isHoliday,
    getDaysInMonth,
    getCurrentWeek,
    formatDate,
    formatDateForComparison
} from '@/utils/dateHelpers.js';

describe('dateHelpers', () => {
    describe('getCurrentDate', () => {
        it('возвращает объект Date', () => {
            const date = getCurrentDate();
            expect(date).toBeInstanceOf(Date);
        });
        
        it('возвращает текущую дату', () => {
            const date = getCurrentDate();
            const now = new Date();
            // Проверяем, что разница не больше 1 секунды
            expect(Math.abs(date.getTime() - now.getTime())).toBeLessThan(1000);
        });
    });
    
    describe('getCurrentYear', () => {
        it('возвращает текущий год', () => {
            const year = getCurrentYear();
            const expectedYear = new Date().getFullYear();
            expect(year).toBe(expectedYear);
        });
        
        it('возвращает число', () => {
            const year = getCurrentYear();
            expect(typeof year).toBe('number');
        });
    });
    
    describe('getCurrentMonth', () => {
        it('возвращает текущий месяц (1-12)', () => {
            const month = getCurrentMonth();
            const expectedMonth = new Date().getMonth() + 1;
            expect(month).toBe(expectedMonth);
        });
        
        it('возвращает число от 1 до 12', () => {
            const month = getCurrentMonth();
            expect(month).toBeGreaterThanOrEqual(1);
            expect(month).toBeLessThanOrEqual(12);
        });
    });
    
    describe('isToday', () => {
        it('возвращает true для сегодняшнего дня', () => {
            const today = new Date();
            expect(isToday(today)).toBe(true);
        });
        
        it('возвращает true для строки с сегодняшней датой', () => {
            const today = new Date();
            const dateStr = today.toISOString().split('T')[0];
            expect(isToday(dateStr)).toBe(true);
        });
        
        it('возвращает false для вчерашнего дня', () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            expect(isToday(yesterday)).toBe(false);
        });
        
        it('возвращает false для завтрашнего дня', () => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            expect(isToday(tomorrow)).toBe(false);
        });
    });
    
    describe('isWeekend', () => {
        it('возвращает true для субботы', () => {
            // 2025-12-13 - суббота
            const saturday = new Date('2025-12-13');
            expect(isWeekend(saturday)).toBe(true);
        });
        
        it('возвращает true для воскресенья', () => {
            // 2025-12-14 - воскресенье
            const sunday = new Date('2025-12-14');
            expect(isWeekend(sunday)).toBe(true);
        });
        
        it('возвращает false для понедельника', () => {
            // 2025-12-15 - понедельник
            const monday = new Date('2025-12-15');
            expect(isWeekend(monday)).toBe(false);
        });
        
        it('возвращает false для пятницы', () => {
            // 2025-12-19 - пятница
            const friday = new Date('2025-12-19');
            expect(isWeekend(friday)).toBe(false);
        });
        
        it('работает со строкой даты', () => {
            const saturday = '2025-12-13';
            expect(isWeekend(saturday)).toBe(true);
        });
    });
    
    describe('isHoliday', () => {
        it('возвращает true для праздника', () => {
            const holidays = ['2025-12-25', '2025-12-31'];
            const date = new Date('2025-12-25');
            expect(isHoliday(date, holidays)).toBe(true);
        });
        
        it('возвращает false для не праздника', () => {
            const holidays = ['2025-12-25', '2025-12-31'];
            const date = new Date('2025-12-24');
            expect(isHoliday(date, holidays)).toBe(false);
        });
        
        it('работает со строкой даты', () => {
            const holidays = ['2025-12-25'];
            const date = '2025-12-25';
            expect(isHoliday(date, holidays)).toBe(true);
        });
        
        it('возвращает false если holidays не массив', () => {
            const date = new Date('2025-12-25');
            expect(isHoliday(date, null)).toBe(false);
            expect(isHoliday(date, undefined)).toBe(false);
            expect(isHoliday(date, {})).toBe(false);
        });
    });
    
    describe('getDaysInMonth', () => {
        it('возвращает правильное количество дней для февраля (не високосный)', () => {
            expect(getDaysInMonth(2025, 2)).toBe(28);
        });
        
        it('возвращает правильное количество дней для февраля (високосный)', () => {
            expect(getDaysInMonth(2024, 2)).toBe(29);
        });
        
        it('возвращает 31 день для января', () => {
            expect(getDaysInMonth(2025, 1)).toBe(31);
        });
        
        it('возвращает 30 дней для апреля', () => {
            expect(getDaysInMonth(2025, 4)).toBe(30);
        });
        
        it('возвращает 31 день для декабря', () => {
            expect(getDaysInMonth(2025, 12)).toBe(31);
        });
    });
    
    describe('getCurrentWeek', () => {
        it('возвращает объект с полями monday и sunday', () => {
            const week = getCurrentWeek();
            expect(week).toHaveProperty('monday');
            expect(week).toHaveProperty('sunday');
        });
        
        it('monday и sunday являются объектами Date', () => {
            const week = getCurrentWeek();
            expect(week.monday).toBeInstanceOf(Date);
            expect(week.sunday).toBeInstanceOf(Date);
        });
        
        it('monday раньше sunday', () => {
            const week = getCurrentWeek();
            expect(week.monday.getTime()).toBeLessThan(week.sunday.getTime());
        });
        
        it('разница между monday и sunday составляет 6 дней', () => {
            const week = getCurrentWeek();
            const diff = week.sunday.getDate() - week.monday.getDate();
            expect(diff).toBe(6);
        });
    });
    
    describe('formatDate', () => {
        it('форматирует дату в формате DD.MM.YYYY по умолчанию', () => {
            const date = new Date('2025-12-15');
            expect(formatDate(date)).toBe('15.12.2025');
        });
        
        it('форматирует дату в кастомном формате', () => {
            const date = new Date('2025-12-15');
            expect(formatDate(date, 'YYYY-MM-DD')).toBe('2025-12-15');
        });
        
        it('работает со строкой даты', () => {
            const date = '2025-12-15';
            expect(formatDate(date)).toBe('15.12.2025');
        });
        
        it('возвращает пустую строку для невалидной даты', () => {
            const invalidDate = new Date('invalid');
            expect(formatDate(invalidDate)).toBe('');
        });
        
        it('правильно форматирует однозначные числа', () => {
            const date = new Date('2025-01-05');
            expect(formatDate(date)).toBe('05.01.2025');
        });
    });
    
    describe('formatDateForComparison', () => {
        it('форматирует дату в формате YYYY-MM-DD', () => {
            const date = new Date('2025-12-15');
            expect(formatDateForComparison(date)).toBe('2025-12-15');
        });
        
        it('работает со строкой даты', () => {
            const date = '2025-12-15';
            expect(formatDateForComparison(date)).toBe('2025-12-15');
        });
        
        it('правильно форматирует однозначные числа', () => {
            const date = new Date('2025-01-05');
            expect(formatDateForComparison(date)).toBe('2025-01-05');
        });
    });
});

