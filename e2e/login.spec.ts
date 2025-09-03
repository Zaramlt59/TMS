import { test, expect } from '@playwright/test'

test('login shows dashboard', async ({ page }) => {
  await page.goto('/login')
  await page.getByPlaceholder('Username').fill('admin')
  await page.getByPlaceholder('Password').fill('admin123')
  await page.getByRole('button', { name: /sign in/i }).click()
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByText(/Dashboard/i)).toBeVisible()
})


