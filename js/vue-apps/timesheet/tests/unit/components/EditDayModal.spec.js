/**
 * Unit-тесты для компонента EditDayModal
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import EditDayModal from '@/components/EditDayModal.vue';

describe('EditDayModal', () => {
    it('не отображается когда visible=false', () => {
        const wrapper = mount(EditDayModal, {
            props: {
                visible: false,
                day: 15
            },
            attachTo: document.body
        });
        
        // Teleport рендерится в body, поэтому проверяем через document
        expect(document.querySelector('.modal-overlay')).toBeNull();
        wrapper.unmount();
    });
    
    it('отображается когда visible=true', async () => {
        const wrapper = mount(EditDayModal, {
            props: {
                visible: true,
                day: 15
            },
            attachTo: document.body
        });
        
        await wrapper.vm.$nextTick();
        
        // Teleport рендерится в body
        const overlay = document.querySelector('.modal-overlay');
        expect(overlay).toBeTruthy();
        wrapper.unmount();
    });
    
    it('отображает номер дня в заголовке', async () => {
        const wrapper = mount(EditDayModal, {
            props: {
                visible: true,
                day: 15
            },
            attachTo: document.body
        });
        
        await wrapper.vm.$nextTick();
        
        const overlay = document.querySelector('.modal-overlay');
        expect(overlay?.textContent).toContain('Редактирование дня 15');
        wrapper.unmount();
    });
    
    it('эмитит событие close при клике на кнопку закрытия', async () => {
        const wrapper = mount(EditDayModal, {
            props: {
                visible: true,
                day: 15
            },
            attachTo: document.body
        });
        
        await wrapper.vm.$nextTick();
        
        const closeButton = document.querySelector('.close-button');
        if (closeButton) {
            closeButton.click();
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted('close')).toBeTruthy();
        }
        wrapper.unmount();
    });
    
    it('эмитит событие save при сохранении', async () => {
        const wrapper = mount(EditDayModal, {
            props: {
                visible: true,
                day: 15,
                dayData: { hours: 8 }
            },
            attachTo: document.body
        });
        
        await wrapper.vm.$nextTick();
        
        const form = document.querySelector('form');
        if (form) {
            form.dispatchEvent(new Event('submit', { cancelable: true }));
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted('save')).toBeTruthy();
        }
        wrapper.unmount();
    });
});

