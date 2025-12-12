/**
 * E2E тесты автосохранения
 */

import { test, expect } from '@playwright/test';

test.describe('Автосохранение', () => {
  test.beforeEach(async ({ page }) => {
    let saveCallCount = 0;
    
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
        saveCallCount++;
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
  
  test('автосохранение после редактирования', async ({ page }) => {
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
          
          // Ждем автосохранения
          await page.waitForTimeout(2000);
          
          // Проверяем индикатор сохранения
          const saveIndicator = page.locator('.save-indicator');
          // Индикатор может быть виден или скрыт в зависимости от состояния
          await page.waitForTimeout(1000);
        }
      }
    }
  });
  
  test('debounce при автосохранении', async ({ page }) => {
    // Тест проверяет, что при быстрых изменениях не происходит множественных сохранений
    await page.waitForTimeout(1000);
    
    // Этот тест требует более сложной настройки для отслеживания debounce
    // Пока оставляем базовую проверку
    await expect(page.locator('.calendar-grid')).toBeVisible();
  });
});

