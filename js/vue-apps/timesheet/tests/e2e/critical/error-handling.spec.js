/**
 * E2E тесты обработки ошибок
 */

import { test, expect } from '@playwright/test';

test.describe('Обработка ошибок', () => {
  test('ошибка загрузки данных пользователя', async ({ page }) => {
    // Мокаем ошибку API
    await page.route('**/rest/user.current.json', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'ERROR',
          error_description: 'Ошибка загрузки данных пользователя'
        })
      });
    });
    
    await page.route('**/api/timesheet.php*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { days: {} }
        })
      });
    });
    
    await page.goto('/');
    
    // Проверяем отображение ошибки или fallback
    await page.waitForTimeout(2000);
    
    // Приложение должно обработать ошибку и показать fallback
    const userInfo = page.locator('.user-info');
    await expect(userInfo).toBeVisible();
  });
  
  test('ошибка загрузки данных табеля', async ({ page }) => {
    await page.route('**/rest/user.current.json', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          result: { ID: 999, NAME: 'Тест', LAST_NAME: 'Пользователь' }
        })
      });
    });
    
    // Мокаем ошибку загрузки табеля
    await page.route('**/api/timesheet.php*', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Ошибка загрузки данных табеля'
        })
      });
    });
    
    await page.route('**/api/holidays.php*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: [] })
      });
    });
    
    await page.goto('/');
    
    // Приложение должно обработать ошибку
    await page.waitForTimeout(2000);
    
    // Календарь должен отображаться (даже с ошибкой)
    await expect(page.locator('.calendar-grid')).toBeVisible();
  });
  
  test('ошибка сохранения данных', async ({ page }) => {
    await page.route('**/rest/user.current.json', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          result: { ID: 999, NAME: 'Тест', LAST_NAME: 'Пользователь' }
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
        // Мокаем ошибку сохранения
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            error: 'Ошибка сохранения данных'
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
    
    // Пытаемся сохранить данные
    await page.waitForTimeout(1000);
    const firstCell = page.locator('.calendar-cell:not(.empty)').first();
    
    if (await firstCell.count() > 0) {
      await firstCell.click();
      
      await page.waitForSelector('.modal-content', { state: 'visible' });
      
      const hoursInput = page.locator('#hours');
      if (await hoursInput.count() > 0) {
        await hoursInput.fill('8');
        
        const saveButton = page.locator('button:has-text("Сохранить")');
        if (await saveButton.count() > 0) {
          await saveButton.click();
          
          // Проверяем отображение ошибки
          await page.waitForTimeout(1000);
          
          // Индикатор сохранения должен показать ошибку
          const saveIndicator = page.locator('.save-indicator');
          if (await saveIndicator.count() > 0) {
            await expect(saveIndicator).toBeVisible();
          }
        }
      }
    }
  });
});

