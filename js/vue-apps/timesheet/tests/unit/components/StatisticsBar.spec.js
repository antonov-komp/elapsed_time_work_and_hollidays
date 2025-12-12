/**
 * Unit-тесты для компонента StatisticsBar
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import StatisticsBar from '@/components/StatisticsBar.vue';
import { useTimesheetStore } from '@/stores/timesheetStore.js';

describe('StatisticsBar', () => {
    let pinia;
    
    beforeEach(() => {
        pinia = createPinia();
        setActivePinia(pinia);
    });
    
    it('отображает статистику', () => {
        const store = useTimesheetStore();
        // Устанавливаем значения через прямое изменение state
        store.timesheet.days = {
            '1': { hours: 8 },
            '2': { hours: 8 },
            '3': { hours: 4 }
        };
        
        const wrapper = mount(StatisticsBar, {
            global: {
                plugins: [pinia]
            }
        });
        
        expect(wrapper.text()).toContain('Часов всего:');
        expect(wrapper.text()).toContain('Рабочих дней:');
    });
    
    it('форматирует часы с одним знаком после запятой', () => {
        const store = useTimesheetStore();
        store.timesheet.days = {
            '1': { hours: 8.5 }
        };
        
        const wrapper = mount(StatisticsBar, {
            global: {
                plugins: [pinia]
            }
        });
        
        // Проверяем, что часы отображаются с одним знаком после запятой
        const text = wrapper.text();
        expect(text).toMatch(/\d+\.\d/);
    });
    
    it('отображает дни со статусами если они есть', () => {
        const store = useTimesheetStore();
        store.timesheet.days = {
            '1': { status: 'Больничный' }
        };
        
        const wrapper = mount(StatisticsBar, {
            global: {
                plugins: [pinia]
            }
        });
        
        expect(wrapper.text()).toContain('Дней со статусами:');
    });
});

