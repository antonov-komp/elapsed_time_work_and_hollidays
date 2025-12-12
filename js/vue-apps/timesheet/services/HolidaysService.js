/**
 * Сервис для работы с праздниками
 * 
 * Использует API endpoint:
 * - GET /api/holidays.php?year={year} - получение праздников
 */
export class HolidaysService {
    /**
     * Кэш праздников в памяти
     * Структура: { [year]: [массив дат в формате YYYY-MM-DD] }
     */
    static holidaysCache = {};
    
    /**
     * Получение праздников для года
     * 
     * @param {number} year Год (2025-2035)
     * @returns {Promise<Array<string>>} Массив дат праздников в формате YYYY-MM-DD
     */
    static async getHolidays(year) {
        try {
            // Проверка кэша
            if (this.holidaysCache[year]) {
                return this.holidaysCache[year];
            }
            
            // Валидация параметров
            if (!year) {
                throw new Error('Год обязателен для получения праздников');
            }
            
            if (year < 2025 || year > 2035) {
                throw new Error('Год должен быть в диапазоне 2025-2035');
            }
            
            const url = `/api/holidays.php?year=${year}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Ошибка получения праздников');
            }
            
            // Сохранение в кэш
            const holidays = data.data || [];
            this.holidaysCache[year] = holidays;
            
            return holidays;
        } catch (error) {
            console.error('HolidaysService.getHolidays error:', error);
            throw error;
        }
    }
    
    /**
     * Проверка, является ли дата праздником
     * 
     * @param {Date|string} date Дата для проверки
     * @param {Array<string>|null} holidays Массив праздников (если null, будет загружен для года даты)
     * @returns {Promise<boolean>} true, если дата является праздником
     */
    static async isHoliday(date, holidays = null) {
        try {
            // Преобразование даты в формат YYYY-MM-DD
            const dateObj = date instanceof Date ? date : new Date(date);
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;
            
            // Получение праздников, если не переданы
            if (holidays === null) {
                holidays = await this.getHolidays(year);
            }
            
            // Проверка наличия даты в массиве праздников
            return Array.isArray(holidays) && holidays.includes(dateStr);
        } catch (error) {
            console.error('HolidaysService.isHoliday error:', error);
            return false; // В случае ошибки возвращаем false
        }
    }
    
    /**
     * Очистка кэша праздников
     * 
     * @param {number|null} year Год для очистки (если null, очищается весь кэш)
     */
    static clearCache(year = null) {
        if (year !== null) {
            delete this.holidaysCache[year];
        } else {
            this.holidaysCache = {};
        }
    }
}

