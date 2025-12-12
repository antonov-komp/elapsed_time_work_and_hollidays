/**
 * Unit-тесты для Bitrix24ApiService
 * 
 * Тестируется сервис для работы с Bitrix24 REST API
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Bitrix24ApiService } from '@/services/Bitrix24ApiService.js';

describe('Bitrix24ApiService', () => {
    beforeEach(() => {
        // Очистка моков перед каждым тестом
        vi.clearAllMocks();
        global.fetch = vi.fn();
    });
    
    describe('getCurrentUser', () => {
        it('использует BX.ajax если доступен', async () => {
            const userData = {
                ID: 123,
                NAME: 'Иван',
                LAST_NAME: 'Иванов',
                WORK_POSITION: 'Менеджер'
            };
            
            global.BX = {
                ajax: vi.fn((options) => {
                    options.onsuccess({ result: userData });
                })
            };
            
            const result = await Bitrix24ApiService.getCurrentUser();
            
            expect(global.BX.ajax).toHaveBeenCalled();
            expect(result).toEqual(userData);
        });
        
        it('обрабатывает ошибку от BX.ajax', async () => {
            global.BX = {
                ajax: vi.fn((options) => {
                    options.onfailure('Network error');
                })
            };
            
            await expect(Bitrix24ApiService.getCurrentUser()).rejects.toThrow('Ошибка запроса к Bitrix24 API');
        });
        
        it('обрабатывает ошибку в ответе BX.ajax', async () => {
            global.BX = {
                ajax: vi.fn((options) => {
                    options.onsuccess({ error: 'ERROR', error_description: 'Ошибка доступа' });
                })
            };
            
            await expect(Bitrix24ApiService.getCurrentUser()).rejects.toThrow('Ошибка доступа');
        });
        
        it('обрабатывает ошибку парсинга в BX.ajax', async () => {
            global.BX = {
                ajax: vi.fn((options) => {
                    options.onsuccess('invalid json');
                })
            };
            
            await expect(Bitrix24ApiService.getCurrentUser()).rejects.toThrow('Ошибка парсинга ответа от Bitrix24 API');
        });
        
        it('использует fetch если BX.ajax недоступен', async () => {
            delete global.BX;
            
            const userData = {
                result: {
                    ID: 123,
                    NAME: 'Иван',
                    LAST_NAME: 'Иванов'
                }
            };
            
            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: async () => userData
            });
            
            const result = await Bitrix24ApiService.getCurrentUser();
            
            expect(global.fetch).toHaveBeenCalledWith('/rest/user.current.json');
            expect(result).toEqual(userData.result);
        });
        
        it('обрабатывает HTTP ошибку в fetch', async () => {
            delete global.BX;
            
            global.fetch = vi.fn().mockResolvedValue({
                ok: false,
                status: 500
            });
            
            await expect(Bitrix24ApiService.getCurrentUser()).rejects.toThrow('HTTP error! status: 500');
        });
        
        it('обрабатывает ошибку в ответе fetch', async () => {
            delete global.BX;
            
            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({ error: 'ERROR', error_description: 'Ошибка доступа' })
            });
            
            await expect(Bitrix24ApiService.getCurrentUser()).rejects.toThrow('Ошибка доступа');
        });
        
        it('обрабатывает ошибку сети в fetch', async () => {
            delete global.BX;
            
            global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
            
            await expect(Bitrix24ApiService.getCurrentUser()).rejects.toThrow('Network error');
        });
        
        it('обрабатывает строковый ответ в BX.ajax', async () => {
            const userData = {
                ID: 123,
                NAME: 'Иван'
            };
            
            global.BX = {
                ajax: vi.fn((options) => {
                    options.onsuccess(JSON.stringify({ result: userData }));
                })
            };
            
            const result = await Bitrix24ApiService.getCurrentUser();
            
            expect(result).toEqual(userData);
        });
    });
});

