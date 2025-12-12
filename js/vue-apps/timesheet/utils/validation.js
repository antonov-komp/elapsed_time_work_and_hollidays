/**
 * Утилиты для валидации данных
 */

/**
 * Валидация часов (0-24, шаг 0.5)
 * 
 * @param {number} hours Количество часов
 * @returns {Array<string>} Массив ошибок валидации (пустой, если валидация прошла)
 */
export function validateHours(hours) {
    const errors = [];
    
    if (hours === null || hours === undefined) {
        errors.push('Часы обязательны для заполнения');
        return errors;
    }
    
    if (typeof hours !== 'number') {
        errors.push('Часы должны быть числом');
        return errors;
    }
    
    if (hours < 0) {
        errors.push('Часы не могут быть отрицательными');
    }
    
    if (hours > 24) {
        errors.push('Часы не могут быть больше 24');
    }
    
    // Проверка шага 0.5 (с учётом проблем с плавающей точкой)
    const remainder = Math.abs(hours % 0.5);
    // Проверяем, что остаток близок к 0 или к 0.5 (с погрешностью 0.0001)
    if (remainder > 0.0001 && Math.abs(remainder - 0.5) > 0.0001) {
        errors.push('Часы должны быть кратны 0.5 (например, 0, 0.5, 1, 1.5, ..., 24)');
    }
    
    return errors;
}

/**
 * Валидация статуса (допустимые значения)
 * 
 * @param {string} status Статус для проверки
 * @returns {Array<string>} Массив ошибок валидации (пустой, если валидация прошла)
 */
export function validateStatus(status) {
    const errors = [];
    
    // Импортируем константы статусов (динамический импорт для избежания циклических зависимостей)
    // В реальном использовании лучше импортировать в начале файла
    const validStatuses = [
        'Больничный',
        'Командировка',
        'Отпуск календарный',
        'Отпуск за свой счёт'
    ];
    
    if (!status) {
        // Статус не обязателен, если не указан - это нормально
        return errors;
    }
    
    if (typeof status !== 'string') {
        errors.push('Статус должен быть строкой');
        return errors;
    }
    
    if (!validStatuses.includes(status)) {
        errors.push(`Статус должен быть одним из: ${validStatuses.join(', ')}`);
    }
    
    return errors;
}

/**
 * Валидация записи дня (часы и статус не одновременно)
 * 
 * @param {Object} dayEntry Запись дня с полями hours и status
 * @returns {Array<string>} Массив ошибок валидации (пустой, если валидация прошла)
 */
export function validateDayEntry(dayEntry) {
    const errors = [];
    
    if (!dayEntry || typeof dayEntry !== 'object') {
        errors.push('Запись дня должна быть объектом');
        return errors;
    }
    
    const { hours, status } = dayEntry;
    
    // Проверка, что часы и статус не заполнены одновременно
    const hasHours = hours !== null && hours !== undefined && hours !== '';
    const hasStatus = status !== null && status !== undefined && status !== '';
    
    if (hasHours && hasStatus) {
        errors.push('Нельзя одновременно указывать часы и статус');
    }
    
    // Валидация часов, если они указаны
    if (hasHours) {
        const hoursErrors = validateHours(hours);
        errors.push(...hoursErrors);
    }
    
    // Валидация статуса, если он указан
    if (hasStatus) {
        const statusErrors = validateStatus(status);
        errors.push(...statusErrors);
    }
    
    // Проверка, что хотя бы одно поле заполнено
    if (!hasHours && !hasStatus) {
        // Это не ошибка, день может быть пустым
    }
    
    return errors;
}

/**
 * Валидация года (2025-2035)
 * 
 * @param {number} year Год для проверки
 * @returns {Array<string>} Массив ошибок валидации (пустой, если валидация прошла)
 */
export function validateYear(year) {
    const errors = [];
    
    if (year === null || year === undefined) {
        errors.push('Год обязателен для заполнения');
        return errors;
    }
    
    if (typeof year !== 'number') {
        errors.push('Год должен быть числом');
        return errors;
    }
    
    if (year < 2025) {
        errors.push('Год не может быть меньше 2025');
    }
    
    if (year > 2035) {
        errors.push('Год не может быть больше 2035');
    }
    
    if (!Number.isInteger(year)) {
        errors.push('Год должен быть целым числом');
    }
    
    return errors;
}

/**
 * Валидация месяца (1-12)
 * 
 * @param {number} month Месяц для проверки
 * @returns {Array<string>} Массив ошибок валидации (пустой, если валидация прошла)
 */
export function validateMonth(month) {
    const errors = [];
    
    if (month === null || month === undefined) {
        errors.push('Месяц обязателен для заполнения');
        return errors;
    }
    
    if (typeof month !== 'number') {
        errors.push('Месяц должен быть числом');
        return errors;
    }
    
    if (month < 1) {
        errors.push('Месяц не может быть меньше 1');
    }
    
    if (month > 12) {
        errors.push('Месяц не может быть больше 12');
    }
    
    if (!Number.isInteger(month)) {
        errors.push('Месяц должен быть целым числом');
    }
    
    return errors;
}

