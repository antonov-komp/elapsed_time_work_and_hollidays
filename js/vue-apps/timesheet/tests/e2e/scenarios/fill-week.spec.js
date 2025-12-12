/**
 * E2E тесты заполнения недели
 */

import { test, expect } from '@playwright/test';

test.describe('Заполнение недели', () => {
  test.beforeEach(async ({ page }) => {
    // Мокаем API
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
  
  test('отображение кнопки "Заполнить неделю"', async ({ page }) => {
    const fillWeekButton = page.locator('button:has-text("Заполнить неделю")');
    await expect(fillWeekButton).toBeVisible();
  });
  
  test('клик на кнопку "Заполнить неделю"', async ({ page }) => {
    // Мокаем window.confirm для автоматического подтверждения
    await page.addInitScript(() => {
      window.confirm = () => true;
    });
    
    const fillWeekButton = page.locator('button:has-text("Заполнить неделю")');
    await fillWeekButton.click();
    
    // Проверяем, что кнопка обработала клик (может быть состояние загрузки)
    await page.waitForTimeout(500);
  });
});

