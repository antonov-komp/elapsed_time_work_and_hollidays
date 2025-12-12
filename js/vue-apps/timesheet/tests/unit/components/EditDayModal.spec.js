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
            }
        });
        
        expect(wrapper.find('.modal-overlay').exists()).toBe(false);
    });
    
    it('отображается когда visible=true', () => {
        const wrapper = mount(EditDayModal, {
            props: {
                visible: true,
                day: 15
            }
        });
        
        expect(wrapper.find('.modal-overlay').exists()).toBe(true);
    });
    
    it('отображает номер дня в заголовке', () => {
        const wrapper = mount(EditDayModal, {
            props: {
                visible: true,
                day: 15
            }
        });
        
        expect(wrapper.text()).toContain('Редактирование дня 15');
    });
    
    it('эмитит событие close при клике на кнопку закрытия', async () => {
        const wrapper = mount(EditDayModal, {
            props: {
                visible: true,
                day: 15
            }
        });
        
        const closeButton = wrapper.find('.close-button');
        await closeButton.trigger('click');
        
        expect(wrapper.emitted('close')).toBeTruthy();
    });
    
    it('эмитит событие save при сохранении', async () => {
        const wrapper = mount(EditDayModal, {
            props: {
                visible: true,
                day: 15,
                dayData: { hours: 8 }
            }
        });
        
        const form = wrapper.find('form');
        await form.trigger('submit');
        
        expect(wrapper.emitted('save')).toBeTruthy();
    });
});

