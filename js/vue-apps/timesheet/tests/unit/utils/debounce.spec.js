/**
 * Unit-тесты для утилиты debounce
 * 
 * Тестируется функция debounce из utils/debounce.js
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { debounce } from '@/utils/debounce.js';

describe('debounce', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    
    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });
    
    it('возвращает функцию', () => {
        const func = vi.fn();
        const debounced = debounce(func, 100);
        expect(typeof debounced).toBe('function');
    });
    
    it('не вызывает функцию сразу', () => {
        const func = vi.fn();
        const debounced = debounce(func, 100);
        
        debounced();
        
        expect(func).not.toHaveBeenCalled();
    });
    
    it('вызывает функцию после задержки', () => {
        const func = vi.fn();
        const debounced = debounce(func, 100);
        
        debounced();
        vi.advanceTimersByTime(100);
        
        expect(func).toHaveBeenCalledTimes(1);
    });
    
    it('отменяет предыдущий вызов при новом вызове', () => {
        const func = vi.fn();
        const debounced = debounce(func, 100);
        
        debounced();
        vi.advanceTimersByTime(50);
        debounced();
        vi.advanceTimersByTime(100);
        
        expect(func).toHaveBeenCalledTimes(1);
    });
    
    it('передает аргументы в функцию', () => {
        const func = vi.fn();
        const debounced = debounce(func, 100);
        
        debounced('arg1', 'arg2');
        vi.advanceTimersByTime(100);
        
        expect(func).toHaveBeenCalledWith('arg1', 'arg2');
    });
    
    it('работает с разными задержками', () => {
        const func1 = vi.fn();
        const func2 = vi.fn();
        const debounced1 = debounce(func1, 50);
        const debounced2 = debounce(func2, 200);
        
        debounced1();
        debounced2();
        
        vi.advanceTimersByTime(50);
        expect(func1).toHaveBeenCalledTimes(1);
        expect(func2).not.toHaveBeenCalled();
        
        vi.advanceTimersByTime(150);
        expect(func2).toHaveBeenCalledTimes(1);
    });
    
    it('работает с множественными вызовами', () => {
        const func = vi.fn();
        const debounced = debounce(func, 100);
        
        debounced();
        vi.advanceTimersByTime(50);
        debounced();
        vi.advanceTimersByTime(50);
        debounced();
        vi.advanceTimersByTime(100);
        
        expect(func).toHaveBeenCalledTimes(1);
    });
});

