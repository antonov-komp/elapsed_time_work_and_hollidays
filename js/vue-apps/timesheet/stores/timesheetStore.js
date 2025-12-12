import { defineStore } from 'pinia';
import { Bitrix24ApiService } from '../services/Bitrix24ApiService.js';
import { TimesheetApiService } from '../services/TimesheetApiService.js';
import { HolidaysService } from '../services/HolidaysService.js';
import { getCurrentYear, getCurrentMonth } from '../utils/dateHelpers.js';
import { debounce } from '../utils/debounce.js';
import { CONFIG } from '../utils/constants.js';

/**
 * Store для управления состоянием табеля присутствия
 * 
 * Централизованное управление состоянием всего приложения:
 * - Состояние пользователя (ID, ФИО, Должность)
 * - Состояние табеля (год, месяц, дни, загрузка, сохранение)
 * - Состояние праздников (год, даты)
 * - Состояние UI (прелоадер, модальное окно)
 */
export const useTimesheetStore = defineStore('timesheet', {
  state: () => ({
    // Состояние пользователя
    user: {
      id: null,
      name: null,
      position: null,
      loading: false,
      error: null
    },
    
    // Состояние табеля
    timesheet: {
      year: getCurrentYear(),
      month: getCurrentMonth(),
      days: {},
      loading: false,
      error: null,
      saving: false,
      lastSaved: null // Дата последнего успешного сохранения
    },
    
    // Состояние праздников
    holidays: {
      year: getCurrentYear(),
      dates: [],
      loading: false,
      error: null
    },
    
    // Состояние UI
    ui: {
      preloader: true,
      editModal: {
        open: false,
        day: null,
        year: null,
        month: null
      }
    }
  }),
  
  getters: {
    /**
     * Получение данных пользователя
     * 
     * @returns {Object} Данные пользователя
     */
    getUser: (state) => state.user,
    
    /**
     * Получение ID пользователя
     * 
     * @returns {number|null} ID пользователя
     */
    getUserId: (state) => state.user.id,
    
    /**
     * Получение имени пользователя
     * 
     * @returns {string|null} Имя пользователя
     */
    getUserName: (state) => state.user.name,
    
    /**
     * Получение должности пользователя
     * 
     * @returns {string|null} Должность пользователя
     */
    getUserPosition: (state) => state.user.position,
    
    /**
     * Получение данных табеля
     * 
     * @returns {Object} Данные табеля
     */
    getTimesheet: (state) => state.timesheet,
    
    /**
     * Получение года табеля
     * 
     * @returns {number} Год табеля
     */
    getTimesheetYear: (state) => state.timesheet.year,
    
    /**
     * Получение месяца табеля
     * 
     * @returns {number} Месяц табеля (1-12)
     */
    getTimesheetMonth: (state) => state.timesheet.month,
    
    /**
     * Получение дней табеля
     * 
     * @returns {Object} Объект с данными дней
     */
    getTimesheetDays: (state) => state.timesheet.days,
    
    /**
     * Получение праздников
     * 
     * @returns {Array<string>} Массив дат праздников в формате YYYY-MM-DD
     */
    getHolidays: (state) => state.holidays.dates,
    
    /**
     * Получение состояния модального окна
     * 
     * @returns {Object} Состояние модального окна
     */
    getEditModal: (state) => state.ui.editModal,
    
    /**
     * Проверка, открыто ли модальное окно
     * 
     * @returns {boolean} true, если модальное окно открыто
     */
    isEditModalOpen: (state) => state.ui.editModal.open,
    
    /**
     * Проверка, показывается ли прелоадер
     * 
     * @returns {boolean} true, если прелоадер видим
     */
    isPreloaderVisible: (state) => state.ui.preloader,
    
    /**
     * Получение времени последнего сохранения
     * 
     * @returns {Date|null} Дата последнего сохранения
     */
    getLastSaved: (state) => state.timesheet.lastSaved,
    
    /**
     * Сумма часов всего
     * 
     * Суммирует все часы из всех дней табеля
     * 
     * @returns {number} Сумма часов (с точностью до 0.1)
     */
    totalHours: (state) => {
      let total = 0;
      for (const day in state.timesheet.days) {
        const dayData = state.timesheet.days[day];
        if (dayData && typeof dayData.hours === 'number' && dayData.hours > 0) {
          total += dayData.hours;
        }
      }
      return Math.round(total * 10) / 10; // Округление до 0.1
    },
    
    /**
     * Количество рабочих дней (дни с часами > 0)
     * 
     * Подсчитывает дни, где указаны рабочие часы (независимо от количества)
     * 
     * @returns {number} Количество рабочих дней
     */
    workingDays: (state) => {
      let count = 0;
      for (const day in state.timesheet.days) {
        const dayData = state.timesheet.days[day];
        if (dayData && typeof dayData.hours === 'number' && dayData.hours > 0) {
          count++;
        }
      }
      return count;
    },
    
    /**
     * Количество неполных дней (дни с часами > 0 и < 8)
     * 
     * Подсчитывает дни, где часы больше 0, но меньше стандартного рабочего дня (8 часов)
     * 
     * @returns {number} Количество неполных дней
     */
    incompleteDays: (state) => {
      let count = 0;
      for (const day in state.timesheet.days) {
        const dayData = state.timesheet.days[day];
        if (dayData && 
            typeof dayData.hours === 'number' && 
            dayData.hours > 0 && 
            dayData.hours < CONFIG.STANDARD_HOURS &&
            (!dayData.status || dayData.status === null || dayData.status === '')) {
          // Не считаем дни со статусами
          count++;
        }
      }
      return count;
    },
    
    /**
     * Количество дней со статусами
     * 
     * Подсчитывает дни, где указан особый статус (Больничный, Командировка, Отпуск и т.д.)
     * 
     * @returns {number} Количество дней со статусами
     */
    statusDays: (state) => {
      let count = 0;
      for (const day in state.timesheet.days) {
        const dayData = state.timesheet.days[day];
        if (dayData && 
            dayData.status !== null && 
            dayData.status !== undefined && 
            dayData.status !== '') {
          count++;
        }
      }
      return count;
    }
  },
  
  actions: {
    /**
     * Загрузка данных пользователя
     * 
     * Использует Bitrix24ApiService.getCurrentUser()
     * 
     * @returns {Promise<void>}
     */
    async loadUser() {
      this.user.loading = true;
      this.user.error = null;
      
      try {
        const user = await Bitrix24ApiService.getCurrentUser();
        
        this.user.id = user.ID;
        
        // Формирование полного имени из частей
        const nameParts = [
          user.LAST_NAME,
          user.NAME,
          user.SECOND_NAME
        ].filter(Boolean);
        
        this.user.name = nameParts.length > 0 
          ? nameParts.join(' ') 
          : `Пользователь #${user.ID}`;
        
        this.user.position = user.WORK_POSITION || '';
      } catch (error) {
        console.error('Store loadUser error:', error);
        this.user.error = error.message || 'Ошибка загрузки данных пользователя';
      } finally {
        this.user.loading = false;
      }
    },
    
    /**
     * Загрузка данных табеля
     * 
     * Использует TimesheetApiService.getTimesheet(year, month)
     * 
     * @param {number} year Год (2025-2035)
     * @param {number} month Месяц (1-12)
     * @returns {Promise<void>}
     */
    async loadTimesheet(year, month) {
      this.timesheet.loading = true;
      this.timesheet.error = null;
      
      try {
        const data = await TimesheetApiService.getTimesheet(year, month);
        
        this.timesheet.year = year;
        this.timesheet.month = month;
        this.timesheet.days = data?.days || {};
      } catch (error) {
        console.error('Store loadTimesheet error:', error);
        this.timesheet.error = error.message || 'Ошибка загрузки данных табеля';
      } finally {
        this.timesheet.loading = false;
      }
    },
    
    /**
     * Сохранение данных табеля
     * 
     * Использует TimesheetApiService.saveTimesheet(year, month, days)
     * 
     * @param {number} year Год (2025-2035)
     * @param {number} month Месяц (1-12)
     * @param {Object} days Объект с данными дней
     * @returns {Promise<void>}
     */
    async saveTimesheet(year, month, days) {
      this.timesheet.saving = true;
      this.timesheet.error = null;
      
      try {
        await TimesheetApiService.saveTimesheet(year, month, days);
        
        // Обновление локального состояния после успешного сохранения
        this.timesheet.days = {
          ...this.timesheet.days,
          ...days
        };
        
        // Обновление времени последнего сохранения
        this.timesheet.lastSaved = new Date();
      } catch (error) {
        console.error('Store saveTimesheet error:', error);
        this.timesheet.error = error.message || 'Ошибка сохранения данных табеля';
        throw error;
      } finally {
        this.timesheet.saving = false;
      }
    },
    
    /**
     * Внутренний метод автосохранения с retry
     * 
     * Выполняет сохранение с повторными попытками при ошибках
     * 
     * @param {number} year Год (2025-2035)
     * @param {number} month Месяц (1-12)
     * @param {Object} days Объект с данными дней
     * @returns {Promise<void>}
     */
    async _autoSaveInternal(year, month, days) {
      let attempts = 0;
      const maxAttempts = 3;
      const retryDelay = 1000; // 1 секунда между попытками
      
      // Логирование для отладки
      console.log('Store _autoSaveInternal: начало сохранения', {
        year: year,
        month: month,
        daysCount: Object.keys(days).length,
        days: days
      });
      
      while (attempts < maxAttempts) {
        try {
          const result = await TimesheetApiService.saveTimesheet(year, month, days);
          
          console.log('Store _autoSaveInternal: сохранение успешно', result);
          
          // Успешное сохранение
          this.timesheet.lastSaved = new Date();
          this.timesheet.error = null;
          return;
        } catch (error) {
          attempts++;
          
          console.error('Store _autoSaveInternal: ошибка сохранения (попытка', attempts, 'из', maxAttempts, '):', error);
          
          if (attempts >= maxAttempts) {
            // Все попытки исчерпаны
            console.error('Auto-save failed after', maxAttempts, 'attempts:', error);
            this.timesheet.error = error.message || 'Ошибка автосохранения';
            throw error;
          }
          
          // Задержка перед следующей попыткой
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    },
    
    /**
     * Автосохранение с debounce
     * 
     * Автоматически сохраняет данные табеля с задержкой 1.5 секунды
     * Использует debounce для отмены предыдущих вызовов
     * 
     * @param {number} year Год (2025-2035)
     * @param {number} month Месяц (1-12)
     * @param {Object} days Объект с данными дней
     */
    autoSave(year, month, days) {
      // Создаём debounced функцию при первом вызове
      if (!this._autoSaveDebounced) {
        this._autoSaveDebounced = debounce(async (y, m, d) => {
          this.timesheet.saving = true;
          this.timesheet.error = null;
          
          try {
            await this._autoSaveInternal(y, m, d);
          } catch (error) {
            // Ошибка уже обработана в _autoSaveInternal
            console.error('Auto-save error:', error);
          } finally {
            this.timesheet.saving = false;
          }
        }, 1500); // 1.5 секунды
      }
      
      // Вызываем debounced функцию
      this._autoSaveDebounced(year, month, days);
    },
    
    /**
     * Обновление одного дня в табеле с автосохранением
     * 
     * Обновляет локальное состояние и автоматически сохраняет через 1.5 секунды
     * 
     * @param {number} day Номер дня (1-31)
     * @param {Object} dayData Данные дня {hours, status}
     */
    updateDay(day, dayData) {
      if (!day || day < 1 || day > 31) {
        console.error('Store updateDay: неверный номер дня', day);
        return;
      }
      
      // Логирование для отладки
      console.log('Store updateDay:', {
        day: day,
        dayData: dayData,
        year: this.timesheet.year,
        month: this.timesheet.month,
        currentDaysCount: Object.keys(this.timesheet.days).length
      });
      
      // Обновление локального состояния - обновляем только один день
      this.timesheet.days = {
        ...this.timesheet.days,
        [day]: dayData
      };
      
      // Автосохранение с debounce
      // Передаём только изменённый день, бэкенд объединит с существующими данными
      this.autoSave(
        this.timesheet.year,
        this.timesheet.month,
        { [day]: dayData } // Передаём только изменённый день
      );
    },
    
    /**
     * Обновление нескольких дней в табеле с автосохранением
     * 
     * @param {Object} days Объект с данными дней {day: {hours, status}}
     */
    updateDays(days) {
      // Обновление локального состояния
      this.timesheet.days = {
        ...this.timesheet.days,
        ...days
      };
      
      // Автосохранение с debounce
      this.autoSave(
        this.timesheet.year,
        this.timesheet.month,
        this.timesheet.days
      );
    },
    
    /**
     * Загрузка праздников
     * 
     * Использует HolidaysService.getHolidays(year)
     * 
     * @param {number} year Год (2025-2035)
     * @returns {Promise<void>}
     */
    async loadHolidays(year) {
      this.holidays.loading = true;
      this.holidays.error = null;
      
      try {
        const dates = await HolidaysService.getHolidays(year);
        
        this.holidays.year = year;
        this.holidays.dates = dates || [];
      } catch (error) {
        console.error('Store loadHolidays error:', error);
        this.holidays.error = error.message || 'Ошибка загрузки праздников';
      } finally {
        this.holidays.loading = false;
      }
    },
    
    /**
     * Открытие модального окна редактирования дня
     * 
     * @param {number} day Номер дня (1-31)
     * @param {number} year Год (опционально, по умолчанию текущий год табеля)
     * @param {number} month Месяц (опционально, по умолчанию текущий месяц табеля)
     */
    openEditModal(day, year = null, month = null) {
      this.ui.editModal = {
        open: true,
        day,
        year: year || this.timesheet.year,
        month: month || this.timesheet.month
      };
    },
    
    /**
     * Закрытие модального окна редактирования
     */
    closeEditModal() {
      this.ui.editModal = {
        open: false,
        day: null,
        year: null,
        month: null
      };
    },
    
    /**
     * Управление прелоадером
     * 
     * @param {boolean} visible Видимость прелоадера
     */
    setPreloader(visible) {
      this.ui.preloader = visible;
    },
    
    /**
     * Сброс состояния табеля
     * 
     * Очищает данные дней, но сохраняет год и месяц
     */
    resetTimesheet() {
      this.timesheet.days = {};
      this.timesheet.error = null;
    },
    
    /**
     * Сброс всех ошибок
     */
    clearErrors() {
      this.user.error = null;
      this.timesheet.error = null;
      this.holidays.error = null;
    }
  }
});

