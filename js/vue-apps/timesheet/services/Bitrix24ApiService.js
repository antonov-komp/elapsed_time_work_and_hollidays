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
            // Использование BX.ajax (если доступен в Bitrix24)
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
                            // Fallback на PHP endpoint при ошибке BX.ajax
                            this.getCurrentUserViaApi().then(resolve).catch(reject);
                        }
                    });
                });
            }
            
            // Fallback: использование PHP endpoint через fetch
            return await this.getCurrentUserViaApi();
        } catch (error) {
            console.error('Bitrix24ApiService.getCurrentUser error:', error);
            throw error;
        }
    }
    
    /**
     * Получение данных пользователя через PHP API endpoint
     * 
     * Передаёт токен пользователя из placement (AUTH_ID) если доступен
     * 
     * @returns {Promise<Object>} Данные пользователя
     * @private
     */
    static async getCurrentUserViaApi() {
        // Получаем токен пользователя из placement (если доступен)
        const authId = window.PLACEMENT_AUTH_ID || null;
        
        // Формируем URL с токеном пользователя
        let url = '/api/user.php';
        if (authId) {
            url += '?AUTH_ID=' + encodeURIComponent(authId);
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
        
        if (!data.success || data.error) {
            throw new Error(data.error_description || data.error || 'Ошибка получения данных пользователя');
        }
        
        return data.result;
    }
}

