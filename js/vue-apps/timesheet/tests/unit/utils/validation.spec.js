/**
 * Unit-тесты для утилит валидации
 * 
 * Тестируются все функции из utils/validation.js
 */

import { describe, it, expect } from 'vitest';
import {
    validateHours,
    validateStatus,
    validateDayEntry,
    validateYear,
    validateMonth
} from '@/utils/validation.js';

describe('validation', () => {
    describe('validateHours', () => {
        it('возвращает ошибку для null', () => {
            const errors = validateHours(null);
            expect(errors).toHaveLength(1);
            expect(errors[0]).toContain('обязательны');
        });
        
        it('возвращает ошибку для undefined', () => {
            const errors = validateHours(undefined);
            expect(errors).toHaveLength(1);
            expect(errors[0]).toContain('обязательны');
        });
        
        it('возвращает ошибку для не числа', () => {
            const errors = validateHours('8');
            expect(errors).toHaveLength(1);
            expect(errors[0]).toContain('числом');
        });
        
        it('возвращает ошибку для отрицательных часов', () => {
            const errors = validateHours(-1);
            expect(errors).toHaveLength(1);
            expect(errors[0]).toContain('отрицательными');
        });
        
        it('возвращает ошибку для часов больше 24', () => {
            const errors = validateHours(25);
            expect(errors).toHaveLength(1);
            expect(errors[0]).toContain('больше 24');
        });
        
        it('возвращает ошибку для часов не кратных 0.5', () => {
            const errors = validateHours(1.3);
            expect(errors).toHaveLength(1);
            expect(errors[0]).toContain('кратны 0.5');
        });
        
        it('не возвращает ошибок для валидных часов', () => {
            expect(validateHours(0)).toHaveLength(0);
            expect(validateHours(0.5)).toHaveLength(0);
            expect(validateHours(8)).toHaveLength(0);
            expect(validateHours(8.5)).toHaveLength(0);
            expect(validateHours(24)).toHaveLength(0);
        });
        
        it('принимает несколько ошибок одновременно', () => {
            const errors = validateHours(-1.3);
            expect(errors.length).toBeGreaterThan(1);
        });
    });
    
    describe('validateStatus', () => {
        it('не возвращает ошибок для пустого статуса', () => {
            const errors = validateStatus(null);
            expect(errors).toHaveLength(0);
        });
        
        it('не возвращает ошибок для undefined', () => {
            const errors = validateStatus(undefined);
            expect(errors).toHaveLength(0);
        });
        
        it('возвращает ошибку для не строки', () => {
            const errors = validateStatus(123);
            expect(errors).toHaveLength(1);
            expect(errors[0]).toContain('строкой');
        });
        
        it('возвращает ошибку для невалидного статуса', () => {
            const errors = validateStatus('Невалидный статус');
            expect(errors).toHaveLength(1);
            expect(errors[0]).toContain('одним из');
        });
        
        it('не возвращает ошибок для валидных статусов', () => {
            expect(validateStatus('Больничный')).toHaveLength(0);
            expect(validateStatus('Командировка')).toHaveLength(0);
            expect(validateStatus('Отпуск календарный')).toHaveLength(0);
            expect(validateStatus('Отпуск за свой счёт')).toHaveLength(0);
        });
    });
    
    describe('validateDayEntry', () => {
        it('возвращает ошибку для не объекта', () => {
            const errors = validateDayEntry(null);
            expect(errors).toHaveLength(1);
            expect(errors[0]).toContain('объектом');
        });
        
        it('возвращает ошибку для строки', () => {
            const errors = validateDayEntry('invalid');
            expect(errors).toHaveLength(1);
            expect(errors[0]).toContain('объектом');
        });
        
        it('возвращает ошибку если часы и статус заполнены одновременно', () => {
            const errors = validateDayEntry({
                hours: 8,
                status: 'Больничный'
            });
            expect(errors.length).toBeGreaterThan(0);
            expect(errors.some(e => e.includes('одновременно'))).toBe(true);
        });
        
        it('не возвращает ошибок для пустого дня', () => {
            const errors = validateDayEntry({
                hours: null,
                status: null
            });
            expect(errors).toHaveLength(0);
        });
        
        it('валидирует часы если они указаны', () => {
            const errors = validateDayEntry({
                hours: -1,
                status: null
            });
            expect(errors.length).toBeGreaterThan(0);
        });
        
        it('валидирует статус если он указан', () => {
            const errors = validateDayEntry({
                hours: null,
                status: 'Невалидный статус'
            });
            expect(errors.length).toBeGreaterThan(0);
        });
        
        it('не возвращает ошибок для валидного дня с часами', () => {
            const errors = validateDayEntry({
                hours: 8,
                status: null
            });
            expect(errors).toHaveLength(0);
        });
        
        it('не возвращает ошибок для валидного дня со статусом', () => {
            const errors = validateDayEntry({
                hours: null,
                status: 'Больничный'
            });
            expect(errors).toHaveLength(0);
        });
    });
    
    describe('validateYear', () => {
        it('возвращает ошибку для null', () => {
            const errors = validateYear(null);
            expect(errors).toHaveLength(1);
            expect(errors[0]).toContain('обязателен');
        });
        
        it('возвращает ошибку для undefined', () => {
            const errors = validateYear(undefined);
            expect(errors).toHaveLength(1);
        });
        
        it('возвращает ошибку для не числа', () => {
            const errors = validateYear('2025');
            expect(errors).toHaveLength(1);
            expect(errors[0]).toContain('числом');
        });
        
        it('возвращает ошибку для года меньше 2025', () => {
            const errors = validateYear(2024);
            expect(errors).toHaveLength(1);
            expect(errors[0]).toContain('меньше 2025');
        });
        
        it('возвращает ошибку для года больше 2035', () => {
            const errors = validateYear(2036);
            expect(errors).toHaveLength(1);
            expect(errors[0]).toContain('больше 2035');
        });
        
        it('возвращает ошибку для не целого числа', () => {
            const errors = validateYear(2025.5);
            expect(errors).toHaveLength(1);
            expect(errors[0]).toContain('целым числом');
        });
        
        it('не возвращает ошибок для валидных годов', () => {
            expect(validateYear(2025)).toHaveLength(0);
            expect(validateYear(2030)).toHaveLength(0);
            expect(validateYear(2035)).toHaveLength(0);
        });
    });
    
    describe('validateMonth', () => {
        it('возвращает ошибку для null', () => {
            const errors = validateMonth(null);
            expect(errors).toHaveLength(1);
            expect(errors[0]).toContain('обязателен');
        });
        
        it('возвращает ошибку для undefined', () => {
            const errors = validateMonth(undefined);
            expect(errors).toHaveLength(1);
        });
        
        it('возвращает ошибку для не числа', () => {
            const errors = validateMonth('12');
            expect(errors).toHaveLength(1);
            expect(errors[0]).toContain('числом');
        });
        
        it('возвращает ошибку для месяца меньше 1', () => {
            const errors = validateMonth(0);
            expect(errors).toHaveLength(1);
            expect(errors[0]).toContain('меньше 1');
        });
        
        it('возвращает ошибку для месяца больше 12', () => {
            const errors = validateMonth(13);
            expect(errors).toHaveLength(1);
            expect(errors[0]).toContain('больше 12');
        });
        
        it('возвращает ошибку для не целого числа', () => {
            const errors = validateMonth(1.5);
            expect(errors).toHaveLength(1);
            expect(errors[0]).toContain('целым числом');
        });
        
        it('не возвращает ошибок для валидных месяцев', () => {
            for (let month = 1; month <= 12; month++) {
                expect(validateMonth(month)).toHaveLength(0);
            }
        });
    });
});

