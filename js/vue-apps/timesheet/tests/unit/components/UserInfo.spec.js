/**
 * Unit-тесты для компонента UserInfo
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import UserInfo from '@/components/UserInfo.vue';
import { useTimesheetStore } from '@/stores/timesheetStore.js';

describe('UserInfo', () => {
    let pinia;
    
    beforeEach(() => {
        pinia = createPinia();
        setActivePinia(pinia);
    });
    
    it('отображает состояние загрузки', () => {
        const store = useTimesheetStore();
        store.user.loading = true;
        
        const wrapper = mount(UserInfo, {
            global: {
                plugins: [pinia]
            }
        });
        
        expect(wrapper.text()).toContain('Загрузка...');
    });
    
    it('отображает ошибку', () => {
        const store = useTimesheetStore();
        store.user.error = 'Ошибка загрузки';
        store.user.loading = false;
        
        const wrapper = mount(UserInfo, {
            global: {
                plugins: [pinia]
            }
        });
        
        expect(wrapper.text()).toContain('Ошибка загрузки');
    });
    
    it('отображает имя пользователя', () => {
        const store = useTimesheetStore();
        store.user.name = 'Иван Иванов';
        store.user.loading = false;
        store.user.error = null;
        
        const wrapper = mount(UserInfo, {
            global: {
                plugins: [pinia]
            }
        });
        
        expect(wrapper.text()).toContain('Иван Иванов');
    });
    
    it('отображает имя и должность', () => {
        const store = useTimesheetStore();
        store.user.name = 'Иван Иванов';
        store.user.position = 'Менеджер';
        store.user.loading = false;
        store.user.error = null;
        
        const wrapper = mount(UserInfo, {
            global: {
                plugins: [pinia]
            }
        });
        
        expect(wrapper.text()).toContain('Иван Иванов');
        expect(wrapper.text()).toContain('Менеджер');
    });
    
    it('отображает "Пользователь #ID" если нет имени, но есть ID', () => {
        const store = useTimesheetStore();
        store.user.id = 123;
        store.user.name = null;
        store.user.loading = false;
        store.user.error = null;
        
        const wrapper = mount(UserInfo, {
            global: {
                plugins: [pinia]
            }
        });
        
        expect(wrapper.text()).toContain('Пользователь #123');
    });
    
    it('отображает "Пользователь" если нет ни имени, ни ID', () => {
        const store = useTimesheetStore();
        store.user.id = null;
        store.user.name = null;
        store.user.loading = false;
        store.user.error = null;
        
        const wrapper = mount(UserInfo, {
            global: {
                plugins: [pinia]
            }
        });
        
        expect(wrapper.text()).toContain('Пользователь');
    });
    
    it('не отображает разделитель если нет должности', () => {
        const store = useTimesheetStore();
        store.user.name = 'Иван Иванов';
        store.user.position = null;
        store.user.loading = false;
        store.user.error = null;
        
        const wrapper = mount(UserInfo, {
            global: {
                plugins: [pinia]
            }
        });
        
        expect(wrapper.find('.separator').exists()).toBe(false);
    });
});

