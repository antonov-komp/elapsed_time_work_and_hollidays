/**
 * Unit-тесты для компонента FillWeekButton
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import FillWeekButton from '@/components/FillWeekButton.vue';

describe('FillWeekButton', () => {
    it('отображает кнопку', () => {
        const wrapper = mount(FillWeekButton, {
            props: {
                year: 2025,
                month: 12
            }
        });
        
        expect(wrapper.find('button').exists()).toBe(true);
        expect(wrapper.text()).toContain('Заполнить неделю');
    });
    
    it('эмитит событие fill-week при клике', async () => {
        const wrapper = mount(FillWeekButton, {
            props: {
                year: 2025,
                month: 12,
                holidays: []
            }
        });
        
        const button = wrapper.find('button');
        await button.trigger('click');
        
        expect(wrapper.emitted('fill-week')).toBeTruthy();
    });
    
    it('отображает состояние загрузки', async () => {
        const wrapper = mount(FillWeekButton, {
            props: {
                year: 2025,
                month: 12
            }
        });
        
        await wrapper.setData({ loading: true });
        
        expect(wrapper.text()).toContain('Заполнение...');
    });
});

