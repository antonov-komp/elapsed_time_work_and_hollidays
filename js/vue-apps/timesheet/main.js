import { createApp } from 'vue';
import { createPinia } from 'pinia';
import TimesheetCalendar from './TimesheetCalendar.vue';

const app = createApp(TimesheetCalendar);
const pinia = createPinia();
app.use(pinia);
app.mount('#vue-timesheet-app');

