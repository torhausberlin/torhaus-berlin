import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('can load homepage', async ({ page }) => {
    await page.goto('http://localhost:4000')
    await expect(page).toHaveTitle(/Torhaus Berlin e.V./)
    const heading = page.locator('h1').first()
    await expect(heading).toHaveText('Torhaus Berlin e.V.')
  })
})
