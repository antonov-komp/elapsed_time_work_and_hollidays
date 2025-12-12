/**
 * Unit-тесты для компонента SaveIndicator
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import SaveIndicator from '@/components/SaveIndicator.vue';
import { useTimesheetStore } from '@/stores/timesheetStore.js';

describe('SaveIndicator', () => {
    let pinia;
    
    beforeEach(() => {
        pinia = createPinia();
        setActivePinia(pinia);
    });
    
    it('отображается когда идет сохранение', () => {
        const store = useTimesheetStore();
        store.timesheet.saving = true;
        
        const wrapper = mount(SaveIndicator, {
            global: {
                plugins: [pinia]
            }
        });
        
        expect(wrapper.text()).toContain('Сохранение...');
    });
    
    it('отображает ошибку когда есть ошибка', () => {
        const store = useTimesheetStore();
        store.timesheet.error = 'Ошибка сохранения';
        
        const wrapper = mount(SaveIndicator, {
            global: {
                plugins: [pinia]
            }
        });
        
        expect(wrapper.text()).toContain('Ошибка сохранения');
    });
});

