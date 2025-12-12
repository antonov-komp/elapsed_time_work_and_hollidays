/**
 * Unit-тесты для компонента PeriodSelector
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import PeriodSelector from '@/components/PeriodSelector.vue';

describe('PeriodSelector', () => {
    it('отображает селекты для месяца и года', () => {
        const wrapper = mount(PeriodSelector);
        
        expect(wrapper.find('#month-select').exists()).toBe(true);
        expect(wrapper.find('#year-select').exists()).toBe(true);
    });
    
    it('эмитит событие period-change при изменении месяца', async () => {
        const wrapper = mount(PeriodSelector);
        
        const monthSelect = wrapper.find('#month-select');
        await monthSelect.setValue(6);
        
        expect(wrapper.emitted('period-change')).toBeTruthy();
        expect(wrapper.emitted('period-change')[0][0]).toEqual({
            year: expect.any(Number),
            month: 6
        });
    });
    
    it('эмитит событие period-change при изменении года', async () => {
        const wrapper = mount(PeriodSelector);
        
        const yearSelect = wrapper.find('#year-select');
        await yearSelect.setValue(2026);
        
        expect(wrapper.emitted('period-change')).toBeTruthy();
        expect(wrapper.emitted('period-change')[0][0]).toEqual({
            year: 2026,
            month: expect.any(Number)
        });
    });
    
    it('использует props для начальных значений', () => {
        const wrapper = mount(PeriodSelector, {
            props: {
                year: 2026,
                month: 6
            }
        });
        
        expect(wrapper.find('#year-select').element.value).toBe('2026');
        expect(wrapper.find('#month-select').element.value).toBe('6');
    });
    
    it('использует текущий год и месяц по умолчанию', () => {
        const wrapper = mount(PeriodSelector);
        
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        
        expect(wrapper.find('#year-select').element.value).toBe(String(currentYear));
        expect(wrapper.find('#month-select').element.value).toBe(String(currentMonth));
    });
});

