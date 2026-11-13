import { expect, test } from './helpers';

test.use({ reducedMotion: 'reduce' });

// Galat yang tidak boleh muncul di konsol pada pemuatan normal.
test.beforeEach(({ page }) => {
  page.on('pageerror', (e) => {
    throw new Error(`pageerror: ${e.message}`);
  });
});

test('beranda memuat judul utama', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Hak Revisi Jelas');
  await expect(page).toHaveTitle(/Revio/i);
});

test('setiap halaman demo menampilkan judul dan tidak melempar galat', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  for (const hash of ['customer_space', 'vendor_dashboard', 'workshop_live', 'formula_explorer', 'analytics', 'vendor_public_profile']) {
    await page.goto(`/#/${hash}`);
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('heading').first()).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test('hash routing: tautan langsung dan tombol Kembali', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    location.hash = '#/analytics';
  });
  await expect(page.getByRole('heading', { name: /Analitik Efisiensi/ })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Hak Revisi Jelas');
});

test('kunci keputusan lewat keyboard (tahan 1 detik, jam dikendalikan)', async ({ page }) => {
  await page.clock.install();
  await page.goto('/#/customer_space');
  const hold = page.getByRole('button', { name: /Tahan untuk Kunci/ }).first();
  await hold.focus();

  // Dilepas sebelum 1 detik: tidak terkunci.
  await page.keyboard.down('Enter');
  await page.clock.runFor(600);
  await page.keyboard.up('Enter');
  await page.clock.runFor(100);
  await expect(page.getByText('Terkunci di Produksi')).toHaveCount(0);

  // Ditahan penuh: terkunci.
  await page.keyboard.down('Enter');
  await page.clock.runFor(1100);
  await page.keyboard.up('Enter');
  await expect(page.getByText('Terkunci di Produksi').first()).toBeVisible();
});

test('change order: biaya tampil dalam format Rupiah id-ID dan bisa dibatalkan', async ({ page }) => {
  await page.goto('/#/customer_space');
  await page.getByRole('button', { name: /Ajukan Perubahan/ }).first().click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText(/Rp\s?[\d.]+/);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('kalkulator rumus: total berubah saat jam kerja diubah', async ({ page }) => {
  await page.goto('/#/formula_explorer');
  const hours = page.getByLabel('Jam kerja terdampak');
  const before = await page.getByText(/Rp\s?[\d.]+/).first().textContent();
  await hours.fill('30');
  const after = await page.getByText(/Rp\s?[\d.]+/).first().textContent();
  expect(after).not.toBe(before);
});
