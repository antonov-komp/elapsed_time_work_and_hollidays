/**
 * Утилиты для работы с датами
 */

/**
 * Получение текущей даты
 * 
 * @returns {Date} Текущая дата
 */
export function getCurrentDate() {
    return new Date();
}

/**
 * Получение текущего года
 * 
 * @returns {number} Текущий год
 */
export function getCurrentYear() {
    return new Date().getFullYear();
}

/**
 * Получение текущего месяца (1-12)
 * 
 * @returns {number} Текущий месяц (1-12)
 */
export function getCurrentMonth() {
    return new Date().getMonth() + 1;
}

/**
 * Проверка, является ли дата сегодняшним днём
 * 
 * @param {Date|string} date Дата для проверки
 * @returns {boolean} true, если дата является сегодняшним днём
 */
export function isToday(date) {
    const today = new Date();
    const checkDate = date instanceof Date ? date : new Date(date);
    
    return today.getFullYear() === checkDate.getFullYear() &&
           today.getMonth() === checkDate.getMonth() &&
           today.getDate() === checkDate.getDate();
}

/**
 * Проверка, является ли дата выходным (суббота, воскресенье)
 * 
 * @param {Date|string} date Дата для проверки
 * @returns {boolean} true, если дата является выходным
 */
export function isWeekend(date) {
    const checkDate = date instanceof Date ? date : new Date(date);
    const dayOfWeek = checkDate.getDay();
    
    // 0 = воскресенье, 6 = суббота
    return dayOfWeek === 0 || dayOfWeek === 6;
}

/**
 * Проверка, является ли дата праздником
 * 
 * @param {Date|string} date Дата для проверки
 * @param {Array<string>} holidays Массив праздников в формате YYYY-MM-DD
 * @returns {boolean} true, если дата является праздником
 */
export function isHoliday(date, holidays) {
    if (!holidays || !Array.isArray(holidays)) {
        return false;
    }
    
    const dateStr = formatDateForComparison(date);
    return holidays.includes(dateStr);
}

/**
 * Получение количества дней в месяце
 * 
 * @param {number} year Год
 * @param {number} month Месяц (1-12)
 * @returns {number} Количество дней в месяце
 */
export function getDaysInMonth(year, month) {
    // new Date(year, month, 0) возвращает последний день предыдущего месяца
    // month передаётся как 1-12, но в Date используется 0-11, поэтому month без -1
    return new Date(year, month, 0).getDate();
}

/**
 * Получение текущей недели (понедельник-воскресенье)
 * 
 * @returns {Object} Объект с полями monday и sunday (Date)
 */
export function getCurrentWeek() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = воскресенье, 1 = понедельник, ..., 6 = суббота
    
    // Вычисляем разницу до понедельника
    // Если сегодня воскресенье (0), то diff = today.getDate() - 0 + 1 = today.getDate() + 1
    // Если сегодня понедельник (1), то diff = today.getDate() - 1 + 1 = today.getDate()
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    
    const monday = new Date(today);
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0);
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    
    return {
        monday: monday,
        sunday: sunday
    };
}

/**
 * Форматирование даты для отображения
 * 
 * @param {Date|string} date Дата для форматирования
 * @param {string} format Формат (по умолчанию 'DD.MM.YYYY')
 * @returns {string} Отформатированная дата
 */
export function formatDate(date, format = 'DD.MM.YYYY') {
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) {
        return '';
    }
    
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    
    return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day);
}

/**
 * Форматирование даты для сравнения (YYYY-MM-DD)
 * 
 * @param {Date|string} date Дата для форматирования
 * @returns {string} Дата в формате YYYY-MM-DD
 */
export function formatDateForComparison(date) {
    const d = date instanceof Date ? date : new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

