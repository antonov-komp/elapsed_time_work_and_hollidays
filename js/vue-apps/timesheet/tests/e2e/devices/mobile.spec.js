/**
 * E2E тесты для Mobile устройств (< 768px)
 */

import { test, expect } from '@playwright/test';

test.describe('Табель присутствия - Mobile', () => {
  test.use({
    viewport: { width: 375, height: 667 }
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
  
  test('отображение всех компонентов на Mobile', async ({ page }) => {
    await expect(page.locator('.user-info')).toBeVisible();
    await expect(page.locator('.period-selector')).toBeVisible();
    await expect(page.locator('.statistics-bar')).toBeVisible();
    await expect(page.locator('.calendar-grid')).toBeVisible();
  });
  
  test('адаптивность на Mobile', async ({ page }) => {
    // На Mobile компоненты должны быть в колонку
    const periodSelector = page.locator('.period-selector');
    await expect(periodSelector).toBeVisible();
    
    // Проверяем, что календарь отображается и прокручивается
    await expect(page.locator('.calendar-grid')).toBeVisible();
  });
  
  test('touch-оптимизация на Mobile', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    const cells = page.locator('.calendar-cell:not(.empty)');
    const count = await cells.count();
    
    if (count > 0) {
      // Симулируем touch-событие
      await cells.first().tap();
      
      // Проверяем открытие модального окна
      await expect(page.locator('.modal-overlay')).toBeVisible({ timeout: 5000 });
    }
  });
  
  test('прокрутка календаря на Mobile', async ({ page }) => {
    const calendarGrid = page.locator('.calendar-grid');
    await expect(calendarGrid).toBeVisible();
    
    // Проверяем возможность прокрутки
    const scrollable = await calendarGrid.evaluate(el => {
      return el.scrollHeight > el.clientHeight;
    });
    
    // Календарь должен быть прокручиваемым на мобильных устройствах
    expect(scrollable).toBeTruthy();
  });
});

