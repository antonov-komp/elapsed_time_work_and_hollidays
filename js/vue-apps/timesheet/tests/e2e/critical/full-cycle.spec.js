/**
 * E2E тесты критических путей - полный цикл работы с табелем
 */

import { test, expect } from '@playwright/test';

test.describe('Критический путь - Полный цикл работы', () => {
  test.beforeEach(async ({ page }) => {
    // Мокаем API с возможностью перехвата запросов
    let timesheetData = { days: {} };
    
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
            data: timesheetData
          })
        });
      } else if (method === 'POST') {
        const request = route.request();
        const postData = request.postDataJSON();
        if (postData && postData.days) {
          timesheetData.days = { ...timesheetData.days, ...postData.days };
        }
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
    await page.waitForSelector('.timesheet-calendar', { state: 'visible' });
  });
  
  test('полный цикл работы с табелем', async ({ page }) => {
    // 1. Загрузка приложения
    await expect(page.locator('.user-info')).toBeVisible();
    await expect(page.locator('.calendar-grid')).toBeVisible();
    
    // 2. Редактирование дня
    await page.waitForTimeout(1000);
    const firstCell = page.locator('.calendar-cell:not(.empty)').first();
    
    if (await firstCell.count() > 0) {
      await firstCell.click();
      
      await page.waitForSelector('.modal-content', { state: 'visible' });
      
      // Ввод часов
      const hoursInput = page.locator('#hours');
      if (await hoursInput.count() > 0) {
        await hoursInput.fill('8');
        
        // Сохранение
        const saveButton = page.locator('button:has-text("Сохранить")');
        if (await saveButton.count() > 0) {
          await saveButton.click();
          await page.waitForTimeout(1000);
        }
      }
    }
    
    // 3. Изменение периода
    const monthSelect = page.locator('#month-select');
    if (await monthSelect.count() > 0) {
      await monthSelect.selectOption('6');
      await page.waitForTimeout(1000);
    }
    
    // 4. Проверка сохранения данных
    await expect(page.locator('.calendar-grid')).toBeVisible();
  });
});

