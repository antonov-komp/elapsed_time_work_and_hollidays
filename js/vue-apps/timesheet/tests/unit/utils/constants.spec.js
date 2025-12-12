/**
 * Unit-тесты для констант
 * 
 * Тестируются все константы из utils/constants.js
 */

import { describe, it, expect } from 'vitest';
import {
    STATUSES,
    STATUSES_ARRAY,
    COLORS,
    CONFIG,
    MONTHS,
    MONTHS_SHORT,
    WEEKDAYS,
    WEEKDAYS_SHORT
} from '@/utils/constants.js';

describe('constants', () => {
    describe('STATUSES', () => {
        it('содержит все необходимые статусы', () => {
            expect(STATUSES).toHaveProperty('SICK');
            expect(STATUSES).toHaveProperty('BUSINESS_TRIP');
            expect(STATUSES).toHaveProperty('VACATION');
            expect(STATUSES).toHaveProperty('UNPAID_VACATION');
        });
        
        it('значения статусов являются строками', () => {
            expect(typeof STATUSES.SICK).toBe('string');
            expect(typeof STATUSES.BUSINESS_TRIP).toBe('string');
            expect(typeof STATUSES.VACATION).toBe('string');
            expect(typeof STATUSES.UNPAID_VACATION).toBe('string');
        });
        
        it('значения статусов корректны', () => {
            expect(STATUSES.SICK).toBe('Больничный');
            expect(STATUSES.BUSINESS_TRIP).toBe('Командировка');
            expect(STATUSES.VACATION).toBe('Отпуск календарный');
            expect(STATUSES.UNPAID_VACATION).toBe('Отпуск за свой счёт');
        });
    });
    
    describe('STATUSES_ARRAY', () => {
        it('является массивом', () => {
            expect(Array.isArray(STATUSES_ARRAY)).toBe(true);
        });
        
        it('содержит 4 статуса', () => {
            expect(STATUSES_ARRAY).toHaveLength(4);
        });
        
        it('содержит все статусы из STATUSES', () => {
            expect(STATUSES_ARRAY).toContain(STATUSES.SICK);
            expect(STATUSES_ARRAY).toContain(STATUSES.BUSINESS_TRIP);
            expect(STATUSES_ARRAY).toContain(STATUSES.VACATION);
            expect(STATUSES_ARRAY).toContain(STATUSES.UNPAID_VACATION);
        });
    });
    
    describe('COLORS', () => {
        it('содержит все необходимые цвета', () => {
            expect(COLORS).toHaveProperty('WORKDAY');
            expect(COLORS).toHaveProperty('WEEKEND');
            expect(COLORS).toHaveProperty('HOLIDAY');
            expect(COLORS).toHaveProperty('TODAY');
            expect(COLORS).toHaveProperty('FILLED');
            expect(COLORS).toHaveProperty('INCOMPLETE');
            expect(COLORS).toHaveProperty('STATUS');
        });
        
        it('значения цветов являются строками', () => {
            Object.values(COLORS).forEach(color => {
                expect(typeof color).toBe('string');
            });
        });
        
        it('значения цветов являются валидными hex-цветами', () => {
            Object.values(COLORS).forEach(color => {
                expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
            });
        });
    });
    
    describe('CONFIG', () => {
        it('содержит все необходимые конфигурационные параметры', () => {
            expect(CONFIG).toHaveProperty('MIN_YEAR');
            expect(CONFIG).toHaveProperty('MAX_YEAR');
            expect(CONFIG).toHaveProperty('HOUR_STEP');
            expect(CONFIG).toHaveProperty('MIN_HOURS');
            expect(CONFIG).toHaveProperty('MAX_HOURS');
            expect(CONFIG).toHaveProperty('STANDARD_HOURS');
            expect(CONFIG).toHaveProperty('MIN_MONTH');
            expect(CONFIG).toHaveProperty('MAX_MONTH');
        });
        
        it('значения конфигурации являются числами', () => {
            Object.values(CONFIG).forEach(value => {
                expect(typeof value).toBe('number');
            });
        });
        
        it('значения конфигурации корректны', () => {
            expect(CONFIG.MIN_YEAR).toBe(2025);
            expect(CONFIG.MAX_YEAR).toBe(2035);
            expect(CONFIG.HOUR_STEP).toBe(0.5);
            expect(CONFIG.MIN_HOURS).toBe(0);
            expect(CONFIG.MAX_HOURS).toBe(24);
            expect(CONFIG.STANDARD_HOURS).toBe(8);
            expect(CONFIG.MIN_MONTH).toBe(1);
            expect(CONFIG.MAX_MONTH).toBe(12);
        });
    });
    
    describe('MONTHS', () => {
        it('является массивом', () => {
            expect(Array.isArray(MONTHS)).toBe(true);
        });
        
        it('содержит 12 месяцев', () => {
            expect(MONTHS).toHaveLength(12);
        });
        
        it('содержит правильные названия месяцев', () => {
            expect(MONTHS[0]).toBe('Январь');
            expect(MONTHS[11]).toBe('Декабрь');
        });
    });
    
    describe('MONTHS_SHORT', () => {
        it('является массивом', () => {
            expect(Array.isArray(MONTHS_SHORT)).toBe(true);
        });
        
        it('содержит 12 месяцев', () => {
            expect(MONTHS_SHORT).toHaveLength(12);
        });
        
        it('содержит короткие названия месяцев', () => {
            expect(MONTHS_SHORT[0]).toBe('Янв');
            expect(MONTHS_SHORT[11]).toBe('Дек');
        });
    });
    
    describe('WEEKDAYS', () => {
        it('является массивом', () => {
            expect(Array.isArray(WEEKDAYS)).toBe(true);
        });
        
        it('содержит 7 дней недели', () => {
            expect(WEEKDAYS).toHaveLength(7);
        });
        
        it('начинается с понедельника', () => {
            expect(WEEKDAYS[0]).toBe('Понедельник');
        });
        
        it('заканчивается воскресеньем', () => {
            expect(WEEKDAYS[6]).toBe('Воскресенье');
        });
    });
    
    describe('WEEKDAYS_SHORT', () => {
        it('является массивом', () => {
            expect(Array.isArray(WEEKDAYS_SHORT)).toBe(true);
        });
        
        it('содержит 7 дней недели', () => {
            expect(WEEKDAYS_SHORT).toHaveLength(7);
        });
        
        it('содержит короткие названия дней', () => {
            expect(WEEKDAYS_SHORT[0]).toBe('Пн');
            expect(WEEKDAYS_SHORT[6]).toBe('Вс');
        });
    });
});

