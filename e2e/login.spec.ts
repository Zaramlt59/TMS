import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('admin login shows dashboard', async ({ page }) => {
    await page.goto('/login')
    await page.getByPlaceholder('Username').fill('admin')
    await page.getByPlaceholder('Password').fill('admin123')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page).toHaveURL(/\/$/)
    await expect(page.getByText(/Dashboard/i)).toBeVisible()
  })

  test('teacher OTP login flow', async ({ page }) => {
    await page.goto('/otp-login')
    await expect(page.getByText(/TMS - Teacher Management System/i)).toBeVisible()
    await page.getByPlaceholder('Phone Number').fill('9876543210')
    await page.getByRole('button', { name: /send otp/i }).click()
    await expect(page.getByText(/OTP sent successfully/i)).toBeVisible()
  })

  test('invalid credentials show error', async ({ page }) => {
    await page.goto('/login')
    await page.getByPlaceholder('Username').fill('invalid')
    await page.getByPlaceholder('Password').fill('wrong')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page.getByText(/Invalid credentials/i)).toBeVisible()
  })

  test('logout clears session', async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.getByPlaceholder('Username').fill('admin')
    await page.getByPlaceholder('Password').fill('admin123')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page).toHaveURL(/\/$/)
    
    // Logout
    await page.getByRole('button', { name: /logout/i }).click()
    await expect(page).toHaveURL(/\/login/)
  })
})

test.describe('Navigation & Role-Based Access', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin before each test
    await page.goto('/login')
    await page.getByPlaceholder('Username').fill('admin')
    await page.getByPlaceholder('Password').fill('admin123')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page).toHaveURL(/\/$/)
  })

  test('admin can access all navigation items', async ({ page }) => {
    await expect(page.getByText(/Schools/i)).toBeVisible()
    await expect(page.getByText(/Teachers/i)).toBeVisible()
    await expect(page.getByText(/Medical Records/i)).toBeVisible()
    await expect(page.getByText(/User Management/i)).toBeVisible()
  })

  test('navigation to schools page works', async ({ page }) => {
    await page.getByText(/Schools/i).click()
    await expect(page).toHaveURL(/\/schools/)
    await expect(page.getByText(/All Schools/i)).toBeVisible()
  })

  test('navigation to teachers page works', async ({ page }) => {
    await page.getByText(/Teachers/i).click()
    await expect(page).toHaveURL(/\/teachers/)
    await expect(page.getByText(/All Teachers/i)).toBeVisible()
  })

  test('navigation to medical records works', async ({ page }) => {
    await page.getByText(/Medical Records/i).click()
    await expect(page).toHaveURL(/\/medical-records/)
    await expect(page.getByText(/Medical Records/i)).toBeVisible()
  })
})

test.describe('CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin before each test
    await page.goto('/login')
    await page.getByPlaceholder('Username').fill('admin')
    await page.getByPlaceholder('Password').fill('admin123')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page).toHaveURL(/\/$/)
  })

  test('can view schools list', async ({ page }) => {
    await page.getByText(/Schools/i).click()
    await expect(page.getByText(/All Schools/i)).toBeVisible()
    // Should show table or list of schools
    await expect(page.locator('table, .school-card')).toBeVisible()
  })

  test('can view teachers list', async ({ page }) => {
    await page.getByText(/Teachers/i).click()
    await expect(page.getByText(/All Teachers/i)).toBeVisible()
    // Should show table or list of teachers
    await expect(page.locator('table, .teacher-card')).toBeVisible()
  })

  test('can view medical records', async ({ page }) => {
    await page.getByText(/Medical Records/i).click()
    await expect(page.getByText(/Medical Records/i)).toBeVisible()
    // Should show medical records table
    await expect(page.locator('table')).toBeVisible()
  })
})

test.describe('UI Components', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin before each test
    await page.goto('/login')
    await page.getByPlaceholder('Username').fill('admin')
    await page.getByPlaceholder('Password').fill('admin123')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page).toHaveURL(/\/$/)
  })

  test('dashboard shows recent activity', async ({ page }) => {
    await expect(page.getByText(/Recent Activity/i)).toBeVisible()
  })

  test('responsive design works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByRole('button', { name: /menu/i })).toBeVisible()
  })

  test('dark mode toggle works', async ({ page }) => {
    const darkModeToggle = page.locator('[data-testid="dark-mode-toggle"]')
    if (await darkModeToggle.isVisible()) {
      await darkModeToggle.click()
      await expect(page.locator('html')).toHaveClass(/dark/)
    }
  })
})
