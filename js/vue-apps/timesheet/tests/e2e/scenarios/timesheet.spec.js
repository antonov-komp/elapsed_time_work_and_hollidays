/**
 * E2E тесты основных сценариев использования табеля присутствия
 */

import { test, expect } from '@playwright/test';

test.describe('Табель присутствия - Основные сценарии', () => {
  test.beforeEach(async ({ page }) => {
    // Мокаем Bitrix24 API для тестов
    await page.route('**/rest/user.current.json', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          result: {
            ID: 999,
            NAME: 'Тест',
            LAST_NAME: 'Пользователь',
            WORK_POSITION: 'Тестировщик'
          }
        })
      });
    });
    
    // Мокаем API табеля
    await page.route('**/api/timesheet.php*', async route => {
      const url = new URL(route.request().url());
      const method = route.request().method();
      
      if (method === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              created_at: null,
              updated_at: null,
              days: {}
            }
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
    
    // Мокаем API праздников
    await page.route('**/api/holidays.php*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: ['2025-01-01', '2025-01-07']
        })
      });
    });
  });
  
  test('загрузка табеля', async ({ page }) => {
    await page.goto('/');
    
    // Ждем загрузки приложения
    await page.waitForSelector('#vue-timesheet-app', { state: 'attached' });
    
    // Проверка загрузки данных пользователя
    await expect(page.locator('.user-info')).toBeVisible({ timeout: 10000 });
    
    // Проверка загрузки календаря
    await expect(page.locator('.calendar-grid')).toBeVisible({ timeout: 10000 });
    
    // Проверка отображения компонентов
    await expect(page.locator('.period-selector')).toBeVisible();
    await expect(page.locator('.statistics-bar')).toBeVisible();
  });
  
  test('отображение информации о пользователе', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForSelector('.user-info', { state: 'visible' });
    
    // Проверяем, что информация о пользователе отображается
    const userInfo = page.locator('.user-info');
    await expect(userInfo).toBeVisible();
    
    // Проверяем наличие текста (может быть имя или "Пользователь")
    const text = await userInfo.textContent();
    expect(text).toBeTruthy();
  });
  
  test('отображение календарной сетки', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForSelector('.calendar-grid', { state: 'visible' });
    
    // Проверяем наличие ячеек календаря
    const cells = page.locator('.calendar-cell:not(.empty)');
    const count = await cells.count();
    expect(count).toBeGreaterThan(0);
  });
  
  test('отображение селекторов периода', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForSelector('.period-selector', { state: 'visible' });
    
    // Проверяем наличие селекторов месяца и года
    await expect(page.locator('#month-select')).toBeVisible();
    await expect(page.locator('#year-select')).toBeVisible();
  });
  
  test('отображение статистики', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForSelector('.statistics-bar', { state: 'visible' });
    
    // Проверяем наличие элементов статистики
    const stats = page.locator('.statistics-bar');
    await expect(stats).toBeVisible();
    
    // Проверяем наличие текста статистики
    const text = await stats.textContent();
    expect(text).toContain('Часов всего');
  });
});

