/**
 * Сервис для работы с Bitrix24 REST API
 * 
 * Используется метод Bitrix24 REST API: user.current
 * Документация: https://context7.com/bitrix24/rest/user.current
 */
export class Bitrix24ApiService {
    /**
     * Получение данных текущего пользователя
     * 
     * @returns {Promise<Object>} Данные пользователя
     */
    static async getCurrentUser() {
        try {
            // Использование BX.ajax (если доступен)
            if (typeof BX !== 'undefined' && BX.ajax) {
                return new Promise((resolve, reject) => {
                    BX.ajax({
                        url: '/rest/user.current.json',
                        method: 'GET',
                        dataType: 'json',
                        onsuccess: (response) => {
                            try {
                                const data = typeof response === 'string' ? JSON.parse(response) : response;
                                
                                if (data.error) {
                                    reject(new Error(data.error_description || data.error));
                                } else {
                                    resolve(data.result);
                                }
                            } catch (parseError) {
                                reject(new Error('Ошибка парсинга ответа от Bitrix24 API'));
                            }
                        },
                        onfailure: (error) => {
                            console.error('Bitrix24ApiService.getCurrentUser BX.ajax error:', error);
                            reject(new Error('Ошибка запроса к Bitrix24 API'));
                        }
                    });
                });
            }
            
            // Fallback: использование fetch
            const response = await fetch('/rest/user.current.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error_description || data.error);
            }
            
            return data.result;
        } catch (error) {
            console.error('Bitrix24ApiService.getCurrentUser error:', error);
            throw error;
        }
    }
}

