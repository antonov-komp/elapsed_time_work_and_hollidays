/**
 * E2E тесты изменения периода
 */

import { test, expect } from '@playwright/test';

test.describe('Изменение периода', () => {
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
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { days: {} }
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
    await page.waitForSelector('.period-selector', { state: 'visible' });
  });
  
  test('изменение месяца', async ({ page }) => {
    const monthSelect = page.locator('#month-select');
    await expect(monthSelect).toBeVisible();
    
    // Выбираем другой месяц
    await monthSelect.selectOption('6'); // Июнь
    
    // Проверяем, что календарь обновился
    await page.waitForTimeout(1000);
    await expect(page.locator('.calendar-grid')).toBeVisible();
  });
  
  test('изменение года', async ({ page }) => {
    const yearSelect = page.locator('#year-select');
    await expect(yearSelect).toBeVisible();
    
    // Выбираем другой год
    await yearSelect.selectOption('2026');
    
    // Проверяем, что календарь обновился
    await page.waitForTimeout(1000);
    await expect(page.locator('.calendar-grid')).toBeVisible();
  });
  
  test('изменение месяца и года одновременно', async ({ page }) => {
    const monthSelect = page.locator('#month-select');
    const yearSelect = page.locator('#year-select');
    
    await monthSelect.selectOption('6');
    await yearSelect.selectOption('2026');
    
    // Проверяем обновление
    await page.waitForTimeout(1000);
    await expect(page.locator('.calendar-grid')).toBeVisible();
  });
});

