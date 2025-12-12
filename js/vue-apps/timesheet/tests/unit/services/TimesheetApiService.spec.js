/**
 * Unit-тесты для TimesheetApiService
 * 
 * Тестируется сервис для работы с табелем присутствия через API
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TimesheetApiService } from '@/services/TimesheetApiService.js';

describe('TimesheetApiService', () => {
    beforeEach(() => {
        global.fetch = vi.fn();
    });
    
    describe('getTimesheet', () => {
        it('получает данные табеля успешно', async () => {
            const timesheetData = {
                '1': { hours: 8 },
                '2': { hours: 8 },
                '3': { status: 'Больничный' }
            };
            
            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({
                    success: true,
                    data: timesheetData
                })
            });
            
            const result = await TimesheetApiService.getTimesheet(2025, 12);
            
            expect(global.fetch).toHaveBeenCalledWith(
                '/api/timesheet.php?year=2025&month=12',
                expect.objectContaining({
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            );
            expect(result).toEqual(timesheetData);
        });
        
        it('возвращает null если данных нет', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({
                    success: true,
                    data: null
                })
            });
            
            const result = await TimesheetApiService.getTimesheet(2025, 12);
            
            expect(result).toBeNull();
        });
        
        it('выбрасывает ошибку если год не указан', async () => {
            await expect(TimesheetApiService.getTimesheet(null, 12)).rejects.toThrow('обязательны');
        });
        
        it('выбрасывает ошибку если месяц не указан', async () => {
            await expect(TimesheetApiService.getTimesheet(2025, null)).rejects.toThrow('обязательны');
        });
        
        it('выбрасывает ошибку если год меньше 2025', async () => {
            await expect(TimesheetApiService.getTimesheet(2024, 12)).rejects.toThrow('диапазоне 2025-2035');
        });
        
        it('выбрасывает ошибку если год больше 2035', async () => {
            await expect(TimesheetApiService.getTimesheet(2036, 12)).rejects.toThrow('диапазоне 2025-2035');
        });
        
        it('выбрасывает ошибку если месяц меньше 1', async () => {
            await expect(TimesheetApiService.getTimesheet(2025, 0)).rejects.toThrow('диапазоне 1-12');
        });
        
        it('выбрасывает ошибку если месяц больше 12', async () => {
            await expect(TimesheetApiService.getTimesheet(2025, 13)).rejects.toThrow('диапазоне 1-12');
        });
        
        it('обрабатывает HTTP ошибку', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: false,
                status: 500
            });
            
            await expect(TimesheetApiService.getTimesheet(2025, 12)).rejects.toThrow('HTTP error! status: 500');
        });
        
        it('обрабатывает ошибку в ответе API', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({
                    success: false,
                    error: 'Ошибка получения данных'
                })
            });
            
            await expect(TimesheetApiService.getTimesheet(2025, 12)).rejects.toThrow('Ошибка получения данных');
        });
        
        it('обрабатывает ошибку сети', async () => {
            global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
            
            await expect(TimesheetApiService.getTimesheet(2025, 12)).rejects.toThrow('Network error');
        });
    });
    
    describe('saveTimesheet', () => {
        it('сохраняет данные табеля успешно', async () => {
            const days = {
                '1': { hours: 8 },
                '2': { hours: 8 },
                '3': { status: 'Больничный' }
            };
            
            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({
                    success: true,
                    data: { saved: true }
                })
            });
            
            const result = await TimesheetApiService.saveTimesheet(2025, 12, days);
            
            expect(global.fetch).toHaveBeenCalledWith(
                '/api/timesheet.php?year=2025&month=12',
                expect.objectContaining({
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ days })
                })
            );
            expect(result).toEqual({ saved: true });
        });
        
        it('выбрасывает ошибку если год не указан', async () => {
            await expect(TimesheetApiService.saveTimesheet(null, 12, {})).rejects.toThrow('обязательны');
        });
        
        it('выбрасывает ошибку если месяц не указан', async () => {
            await expect(TimesheetApiService.saveTimesheet(2025, null, {})).rejects.toThrow('обязательны');
        });
        
        it('выбрасывает ошибку если days не объект', async () => {
            await expect(TimesheetApiService.saveTimesheet(2025, 12, null)).rejects.toThrow('объектом');
        });
        
        it('выбрасывает ошибку если год вне диапазона', async () => {
            await expect(TimesheetApiService.saveTimesheet(2024, 12, {})).rejects.toThrow('диапазоне 2025-2035');
            await expect(TimesheetApiService.saveTimesheet(2036, 12, {})).rejects.toThrow('диапазоне 2025-2035');
        });
        
        it('выбрасывает ошибку если месяц вне диапазона', async () => {
            await expect(TimesheetApiService.saveTimesheet(2025, 0, {})).rejects.toThrow('диапазоне 1-12');
            await expect(TimesheetApiService.saveTimesheet(2025, 13, {})).rejects.toThrow('диапазоне 1-12');
        });
        
        it('обрабатывает HTTP ошибку', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: false,
                status: 500
            });
            
            await expect(TimesheetApiService.saveTimesheet(2025, 12, {})).rejects.toThrow('HTTP error! status: 500');
        });
        
        it('обрабатывает ошибку в ответе API', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({
                    success: false,
                    error: 'Ошибка сохранения'
                })
            });
            
            await expect(TimesheetApiService.saveTimesheet(2025, 12, {})).rejects.toThrow('Ошибка сохранения');
        });
        
        it('обрабатывает ошибку сети', async () => {
            global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
            
            await expect(TimesheetApiService.saveTimesheet(2025, 12, {})).rejects.toThrow('Network error');
        });
    });
});

