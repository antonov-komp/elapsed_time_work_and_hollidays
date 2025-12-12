/**
 * Утилита debounce для отложенного выполнения функций
 * 
 * Используется для автосохранения данных с задержкой
 * 
 * @param {Function} func Функция для выполнения
 * @param {number} wait Задержка в миллисекундах
 * @returns {Function} Функция с debounce
 */
export function debounce(func, wait) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}


