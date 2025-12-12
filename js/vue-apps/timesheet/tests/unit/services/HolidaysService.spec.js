/**
 * Unit-тесты для HolidaysService
 * 
 * Тестируется сервис для работы с праздниками
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HolidaysService } from '@/services/HolidaysService.js';

describe('HolidaysService', () => {
    beforeEach(() => {
        global.fetch = vi.fn();
        // Очистка кэша перед каждым тестом
        HolidaysService.clearCache();
    });
    
    describe('getHolidays', () => {
        it('получает праздники успешно', async () => {
            const holidays = ['2025-01-01', '2025-01-07', '2025-02-23'];
            
            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({
                    success: true,
                    data: holidays
                })
            });
            
            const result = await HolidaysService.getHolidays(2025);
            
            expect(global.fetch).toHaveBeenCalledWith(
                '/api/holidays.php?year=2025',
                expect.objectContaining({
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            );
            expect(result).toEqual(holidays);
        });
        
        it('кэширует праздники', async () => {
            const holidays = ['2025-01-01', '2025-01-07'];
            
            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({
                    success: true,
                    data: holidays
                })
            });
            
            // Первый вызов
            const result1 = await HolidaysService.getHolidays(2025);
            expect(global.fetch).toHaveBeenCalledTimes(1);
            
            // Второй вызов - должен использовать кэш
            const result2 = await HolidaysService.getHolidays(2025);
            expect(global.fetch).toHaveBeenCalledTimes(1); // Не должен вызываться снова
            expect(result2).toEqual(holidays);
        });
        
        it('выбрасывает ошибку если год не указан', async () => {
            await expect(HolidaysService.getHolidays(null)).rejects.toThrow('обязателен');
        });
        
        it('выбрасывает ошибку если год меньше 2025', async () => {
            await expect(HolidaysService.getHolidays(2024)).rejects.toThrow('диапазоне 2025-2035');
        });
        
        it('выбрасывает ошибку если год больше 2035', async () => {
            await expect(HolidaysService.getHolidays(2036)).rejects.toThrow('диапазоне 2025-2035');
        });
        
        it('обрабатывает HTTP ошибку', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: false,
                status: 500
            });
            
            await expect(HolidaysService.getHolidays(2025)).rejects.toThrow('HTTP error! status: 500');
        });
        
        it('обрабатывает ошибку в ответе API', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({
                    success: false,
                    error: 'Ошибка получения праздников'
                })
            });
            
            await expect(HolidaysService.getHolidays(2025)).rejects.toThrow('Ошибка получения праздников');
        });
        
        it('обрабатывает ошибку сети', async () => {
            global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
            
            await expect(HolidaysService.getHolidays(2025)).rejects.toThrow('Network error');
        });
        
        it('возвращает пустой массив если данных нет', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({
                    success: true,
                    data: null
                })
            });
            
            const result = await HolidaysService.getHolidays(2025);
            expect(result).toEqual([]);
        });
    });
    
    describe('isHoliday', () => {
        it('возвращает true для праздника', async () => {
            const holidays = ['2025-01-01', '2025-01-07'];
            const date = new Date('2025-01-01');
            
            const result = await HolidaysService.isHoliday(date, holidays);
            
            expect(result).toBe(true);
        });
        
        it('возвращает false для не праздника', async () => {
            const holidays = ['2025-01-01', '2025-01-07'];
            const date = new Date('2025-01-02');
            
            const result = await HolidaysService.isHoliday(date, holidays);
            
            expect(result).toBe(false);
        });
        
        it('работает со строкой даты', async () => {
            const holidays = ['2025-01-01'];
            const date = '2025-01-01';
            
            const result = await HolidaysService.isHoliday(date, holidays);
            
            expect(result).toBe(true);
        });
        
        it('загружает праздники если не переданы', async () => {
            const holidays = ['2025-01-01'];
            const date = new Date('2025-01-01');
            
            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({
                    success: true,
                    data: holidays
                })
            });
            
            const result = await HolidaysService.isHoliday(date, null);
            
            expect(result).toBe(true);
            expect(global.fetch).toHaveBeenCalled();
        });
        
        it('возвращает false при ошибке', async () => {
            const date = new Date('2025-01-01');
            
            global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
            
            const result = await HolidaysService.isHoliday(date, null);
            
            expect(result).toBe(false);
        });
        
        it('работает с не массивом праздников', async () => {
            const date = new Date('2025-01-01');
            
            const result = await HolidaysService.isHoliday(date, {});
            
            expect(result).toBe(false);
        });
    });
    
    describe('clearCache', () => {
        it('очищает весь кэш', async () => {
            const holidays2025 = ['2025-01-01'];
            const holidays2026 = ['2026-01-01'];
            
            global.fetch = vi.fn()
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => ({ success: true, data: holidays2025 })
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => ({ success: true, data: holidays2026 })
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => ({ success: true, data: holidays2025 })
                });
            
            await HolidaysService.getHolidays(2025);
            await HolidaysService.getHolidays(2026);
            
            expect(global.fetch).toHaveBeenCalledTimes(2);
            
            HolidaysService.clearCache();
            
            // После очистки кэша должен быть новый запрос
            await HolidaysService.getHolidays(2025);
            expect(global.fetch).toHaveBeenCalledTimes(3);
        });
        
        it('очищает кэш для конкретного года', async () => {
            const holidays2025 = ['2025-01-01'];
            const holidays2026 = ['2026-01-01'];
            
            global.fetch = vi.fn()
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => ({ success: true, data: holidays2025 })
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => ({ success: true, data: holidays2026 })
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => ({ success: true, data: holidays2025 })
                });
            
            await HolidaysService.getHolidays(2025);
            await HolidaysService.getHolidays(2026);
            
            expect(global.fetch).toHaveBeenCalledTimes(2);
            
            HolidaysService.clearCache(2025);
            
            // После очистки кэша для 2025 должен быть новый запрос
            await HolidaysService.getHolidays(2025);
            expect(global.fetch).toHaveBeenCalledTimes(3);
            
            // Кэш для 2026 должен остаться
            await HolidaysService.getHolidays(2026);
            expect(global.fetch).toHaveBeenCalledTimes(3);
        });
    });
});

