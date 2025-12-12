/**
 * Unit-тесты для компонента SaveIndicator
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import SaveIndicator from '@/components/SaveIndicator.vue';
import { useTimesheetStore } from '@/stores/timesheetStore.js';

describe('SaveIndicator', () => {
    let pinia;
    let wrapper;
    
    beforeEach(() => {
        pinia = createPinia();
        setActivePinia(pinia);
    });
    
    afterEach(() => {
        if (wrapper) {
            wrapper.unmount();
        }
        // Очищаем body от Teleport элементов
        document.body.innerHTML = '';
    });
    
    it('отображается когда идет сохранение', async () => {
        const store = useTimesheetStore();
        store.timesheet.saving = true;
        
        wrapper = mount(SaveIndicator, {
            global: {
                plugins: [pinia]
            },
            attachTo: document.body
        });
        
        await wrapper.vm.$nextTick();
        
        // Teleport рендерится в body
        const indicator = document.querySelector('.save-indicator');
        expect(indicator).toBeTruthy();
        expect(indicator?.textContent).toContain('Сохранение...');
    });
    
    it('отображает ошибку когда есть ошибка', async () => {
        const store = useTimesheetStore();
        store.timesheet.error = 'Ошибка сохранения';
        
        wrapper = mount(SaveIndicator, {
            global: {
                plugins: [pinia]
            },
            attachTo: document.body
        });
        
        await wrapper.vm.$nextTick();
        
        // Teleport рендерится в body
        const indicator = document.querySelector('.save-indicator');
        expect(indicator).toBeTruthy();
        expect(indicator?.textContent).toContain('Ошибка сохранения');
    });
});

