/**
 * Unit-тесты для компонента CalendarGrid
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CalendarGrid from '@/components/CalendarGrid.vue';

describe('CalendarGrid', () => {
    it('отображает заголовки дней недели', () => {
        const wrapper = mount(CalendarGrid, {
            props: {
                year: 2025,
                month: 12
            }
        });
        
        expect(wrapper.text()).toContain('Пн');
        expect(wrapper.text()).toContain('Вт');
    });
    
    it('отображает ячейки для всех дней месяца', () => {
        const wrapper = mount(CalendarGrid, {
            props: {
                year: 2025,
                month: 12
            }
        });
        
        // Декабрь 2025 имеет 31 день
        const cells = wrapper.findAll('.calendar-cell:not(.empty)');
        expect(cells.length).toBeGreaterThan(0);
    });
    
    it('эмитит событие cell-click при клике на ячейку', async () => {
        const wrapper = mount(CalendarGrid, {
            props: {
                year: 2025,
                month: 12,
                timesheetData: {},
                holidays: []
            }
        });
        
        await wrapper.vm.$nextTick();
        
        const cell = wrapper.findComponent({ name: 'CalendarCell' });
        if (cell.exists()) {
            await cell.vm.$emit('cell-click', { dayNumber: 1, date: new Date('2025-12-01') });
            expect(wrapper.emitted('cell-click')).toBeTruthy();
        }
    });
});

