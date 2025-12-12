/**
 * Unit-тесты для компонента Preloader
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Preloader from '@/components/Preloader.vue';

describe('Preloader', () => {
    it('отображается когда visible=true', () => {
        const wrapper = mount(Preloader, {
            props: {
                visible: true
            }
        });
        
        expect(wrapper.find('.preloader-overlay').exists()).toBe(true);
        expect(wrapper.find('.preloader-spinner').exists()).toBe(true);
    });
    
    it('не отображается когда visible=false', () => {
        const wrapper = mount(Preloader, {
            props: {
                visible: false
            }
        });
        
        // v-show скрывает элемент, но он всё ещё в DOM
        const overlay = wrapper.find('.preloader-overlay');
        expect(overlay.exists()).toBe(true);
        // Проверяем, что элемент скрыт через v-show
        expect(overlay.isVisible()).toBe(false);
    });
    
    it('имеет правильную структуру DOM', () => {
        const wrapper = mount(Preloader, {
            props: {
                visible: true
            }
        });
        
        expect(wrapper.find('.preloader-overlay').exists()).toBe(true);
        expect(wrapper.find('.preloader-spinner').exists()).toBe(true);
    });
    
    it('принимает visible по умолчанию как false', () => {
        const wrapper = mount(Preloader);
        
        const overlay = wrapper.find('.preloader-overlay');
        expect(overlay.exists()).toBe(true);
        expect(overlay.isVisible()).toBe(false);
    });
});

