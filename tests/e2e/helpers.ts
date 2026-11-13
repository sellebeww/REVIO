import { expect, test as base, type Page } from '@playwright/test';

/**
 * test dengan jaringan tertutup: font Google, WhatsApp, dll. dijawab kosong supaya hasil
 * tidak bergantung pada koneksi (font cadangan selalu dipakai) dan konsol bersih.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route(
      (url) => !['127.0.0.1', 'localhost'].includes(url.hostname),
      (route) => route.fulfill({ status: 204, body: '' }),
    );
    await use(page);
  },
});
export { expect };

/** Dialog masuk dengan pemudaran; tunggu penuh agar pembacaan warna stabil. */
const dialogReady = async (page: Page) => {
  const dialog = page.getByRole('dialog');
  await dialog.waitFor();
  await expect(dialog).toHaveCSS('opacity', '1');
};

export const ROUTES = [
  { path: '/', name: 'Beranda' },
  { path: '/#/customer_space', name: 'Ruang Pelanggan' },
  { path: '/#/vendor_dashboard', name: 'Dasbor Vendor' },
  { path: '/#/workshop_live', name: 'Papan Bengkel Live' },
  { path: '/#/formula_explorer', name: 'Kalkulator Rumus' },
  { path: '/#/analytics', name: 'Validasi Dampak' },
  { path: '/#/vendor_public_profile', name: 'Profil Bengkel' },
] as const;

/** Halaman + keadaan interaktif (dialog) yang ikut diperiksa. */
export const STATES: { name: string; open: (page: Page) => Promise<void> }[] = [
  ...ROUTES.map((r) => ({
    name: r.name,
    open: async (page: Page) => {
      await page.goto(r.path);
      await page.getByRole('main').waitFor();
    },
  })),
  {
    name: 'Dialog Buat Proyek Baru',
    open: async (page) => {
      await page.goto('/#/vendor_dashboard');
      await page.getByRole('button', { name: /Buat Proyek Baru/ }).click();
      await dialogReady(page);
    },
  },
  {
    name: 'Dialog Catat Jam/Bahan',
    open: async (page) => {
      await page.goto('/#/vendor_dashboard');
      await page.getByRole('button', { name: /Catat Jam\/Bahan/ }).first().click();
      await dialogReady(page);
    },
  },
  {
    name: 'Dialog Change Order',
    open: async (page) => {
      await page.goto('/#/customer_space');
      await page.getByRole('button', { name: /Ajukan Perubahan/ }).first().click();
      await dialogReady(page);
    },
  },
];
