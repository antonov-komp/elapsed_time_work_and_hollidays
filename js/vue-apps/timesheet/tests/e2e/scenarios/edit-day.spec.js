/**
 * E2E тесты редактирования дня
 */

import { test, expect } from '@playwright/test';

test.describe('Редактирование дня', () => {
  test.beforeEach(async ({ page }) => {
    // Мокаем API
    await page.route('**/rest/user.current.json', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          result: {
            ID: 999,
            NAME: 'Тест',
            LAST_NAME: 'Пользователь'
          }
        })
      });
    });
    
    await page.route('**/api/timesheet.php*', async route => {
      const method = route.request().method();
      if (method === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: { days: {} }
          })
        });
      } else if (method === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          })
        });
      }
    });
    
    await page.route('**/api/holidays.php*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: [] })
      });
    });
    
    await page.goto('/');
    await page.waitForSelector('.calendar-grid', { state: 'visible' });
  });
  
  test('открытие модального окна при клике на ячейку', async ({ page }) => {
    // Ждем загрузки календаря
    await page.waitForTimeout(1000);
    
    // Находим первую непустую ячейку
    const firstCell = page.locator('.calendar-cell:not(.empty)').first();
    
    if (await firstCell.count() > 0) {
      await firstCell.click();
      
      // Проверяем открытие модального окна
      await expect(page.locator('.modal-overlay')).toBeVisible({ timeout: 5000 });
      await expect(page.locator('.modal-content')).toBeVisible();
    }
  });
  
  test('ввод часов в модальном окне', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    const firstCell = page.locator('.calendar-cell:not(.empty)').first();
    
    if (await firstCell.count() > 0) {
      await firstCell.click();
      
      // Ждем открытия модального окна
      await page.waitForSelector('.modal-content', { state: 'visible' });
      
      // Находим поле ввода часов
      const hoursInput = page.locator('#hours');
      if (await hoursInput.count() > 0) {
        await hoursInput.fill('8');
        await expect(hoursInput).toHaveValue('8');
      }
    }
  });
  
  test('сохранение данных дня', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    const firstCell = page.locator('.calendar-cell:not(.empty)').first();
    
    if (await firstCell.count() > 0) {
      await firstCell.click();
      
      await page.waitForSelector('.modal-content', { state: 'visible' });
      
      // Заполняем форму
      const hoursInput = page.locator('#hours');
      if (await hoursInput.count() > 0) {
        await hoursInput.fill('8');
        
        // Нажимаем кнопку сохранения
        const saveButton = page.locator('button:has-text("Сохранить")');
        if (await saveButton.count() > 0) {
          await saveButton.click();
          
          // Проверяем, что модальное окно закрылось
          await expect(page.locator('.modal-overlay')).not.toBeVisible({ timeout: 5000 });
        }
      }
    }
  });
});

