/**
 * Сервис для работы с табелем присутствия через API
 * 
 * Использует API endpoints:
 * - GET /api/timesheet.php?year={year}&month={month} - получение данных
 * - POST /api/timesheet.php?year={year}&month={month} - сохранение данных
 */
export class TimesheetApiService {
    /**
     * Получение данных табеля
     * 
     * @param {number} year Год (2025-2035)
     * @param {number} month Месяц (1-12)
     * @returns {Promise<Object|null>} Данные табеля или null
     */
    static async getTimesheet(year, month) {
        try {
            // Валидация параметров
            if (!year || !month) {
                throw new Error('Год и месяц обязательны для получения данных табеля');
            }
            
            if (year < 2025 || year > 2035) {
                throw new Error('Год должен быть в диапазоне 2025-2035');
            }
            
            if (month < 1 || month > 12) {
                throw new Error('Месяц должен быть в диапазоне 1-12');
            }
            
            // Получаем токен пользователя из placement (если доступен)
            const authId = window.PLACEMENT_AUTH_ID || null;
            
            let url = `/api/timesheet.php?year=${year}&month=${month}`;
            if (authId) {
                url += '&AUTH_ID=' + encodeURIComponent(authId);
            }
            
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
                throw new Error(data.error || 'Ошибка получения данных табеля');
            }
            
            return data.data || null;
        } catch (error) {
            console.error('TimesheetApiService.getTimesheet error:', error);
            throw error;
        }
    }
    
    /**
     * Сохранение данных табеля
     * 
     * @param {number} year Год (2025-2035)
     * @param {number} month Месяц (1-12)
     * @param {Object} days Данные дней (объект с ключами-датами)
     * @returns {Promise<Object>} Результат сохранения
     */
    static async saveTimesheet(year, month, days) {
        try {
            // Валидация параметров
            if (!year || !month) {
                throw new Error('Год и месяц обязательны для сохранения данных табеля');
            }
            
            if (year < 2025 || year > 2035) {
                throw new Error('Год должен быть в диапазоне 2025-2035');
            }
            
            if (month < 1 || month > 12) {
                throw new Error('Месяц должен быть в диапазоне 1-12');
            }
            
            if (!days || typeof days !== 'object') {
                throw new Error('Данные дней должны быть объектом');
            }
            
            // Получаем токен пользователя из placement (если доступен)
            const authId = window.PLACEMENT_AUTH_ID || null;
            
            let url = `/api/timesheet.php?year=${year}&month=${month}`;
            if (authId) {
                url += '&AUTH_ID=' + encodeURIComponent(authId);
            }
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ days })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Ошибка сохранения данных табеля');
            }
            
            return data.data;
        } catch (error) {
            console.error('TimesheetApiService.saveTimesheet error:', error);
            throw error;
        }
    }
}

