/**
 * Unit-тесты для компонента CalendarCell
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CalendarCell from '@/components/CalendarCell.vue';

describe('CalendarCell', () => {
    it('отображает номер дня', () => {
        const wrapper = mount(CalendarCell, {
            props: {
                dayNumber: 15,
                date: new Date('2025-12-15')
            }
        });
        
        expect(wrapper.text()).toContain('15');
    });
    
    it('отображает часы если они указаны', () => {
        const wrapper = mount(CalendarCell, {
            props: {
                dayNumber: 15,
                date: new Date('2025-12-15'),
                dayData: { hours: 8 }
            }
        });
        
        expect(wrapper.text()).toContain('8ч');
    });
    
    it('отображает статус если он указан', () => {
        const wrapper = mount(CalendarCell, {
            props: {
                dayNumber: 15,
                date: new Date('2025-12-15'),
                dayData: { status: 'Больничный' }
            }
        });
        
        expect(wrapper.text()).toContain('Больничный');
    });
    
    it('эмитит событие cell-click при клике', async () => {
        const wrapper = mount(CalendarCell, {
            props: {
                dayNumber: 15,
                date: new Date('2025-12-15')
            }
        });
        
        await wrapper.trigger('click');
        
        expect(wrapper.emitted('cell-click')).toBeTruthy();
        // Проверяем, что событие эмитится с правильными данными
        const emittedData = wrapper.emitted('cell-click')[0][0];
        expect(emittedData).toHaveProperty('day');
        expect(emittedData.day).toBe(15);
        expect(emittedData).toHaveProperty('date');
        expect(emittedData).toHaveProperty('dayData');
    });
    
    it('применяет класс для выходного дня', () => {
        const wrapper = mount(CalendarCell, {
            props: {
                dayNumber: 13,
                date: new Date('2025-12-13'), // Суббота
                isWeekendDay: true
            }
        });
        
        expect(wrapper.classes()).toContain('weekend');
    });
});

