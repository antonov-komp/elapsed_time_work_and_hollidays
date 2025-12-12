import { defineStore } from 'pinia';

/**
 * Store для состояния табеля присутствия
 * 
 * Логика будет добавлена в TASK-004
 */
export const useTimesheetStore = defineStore('timesheet', {
  state: () => ({
    user: {
      id: null,
      name: null,
      position: null,
      loading: false,
      error: null
    },
    timesheet: {
      year: 2025,
      month: 12,
      days: {},
      loading: false,
      error: null,
      saving: false
    },
    holidays: {
      year: 2025,
      dates: [],
      loading: false,
      error: null
    },
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
    // Геттеры будут добавлены в TASK-004
  },
  actions: {
    // Действия будут добавлены в TASK-004
  }
});

