/**
 * E2E тесты для Desktop устройств (> 1024px)
 */

import { test, expect } from '@playwright/test';

test.describe('Табель присутствия - Desktop', () => {
  test.use({
    viewport: { width: 1920, height: 1080 }
  });
  
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
    await page.waitForSelector('.timesheet-calendar', { state: 'visible' });
  });
  
  test('отображение всех компонентов на Desktop', async ({ page }) => {
    // Проверяем наличие всех основных компонентов
    await expect(page.locator('.user-info')).toBeVisible();
    await expect(page.locator('.period-selector')).toBeVisible();
    await expect(page.locator('.statistics-bar')).toBeVisible();
    await expect(page.locator('.calendar-grid')).toBeVisible();
  });
  
  test('адаптивность на Desktop', async ({ page }) => {
    // Проверяем, что компоненты отображаются в ряд
    const periodSelector = page.locator('.period-selector');
    const computedStyle = await periodSelector.evaluate(el => {
      return window.getComputedStyle(el);
    });
    
    // На Desktop элементы должны быть в ряд
    expect(computedStyle.flexDirection).not.toBe('column');
  });
  
  test('взаимодействие с календарем на Desktop', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    const cells = page.locator('.calendar-cell:not(.empty)');
    const count = await cells.count();
    
    if (count > 0) {
      await cells.first().click();
      
      // Проверяем открытие модального окна
      await expect(page.locator('.modal-overlay')).toBeVisible({ timeout: 5000 });
    }
  });
});

