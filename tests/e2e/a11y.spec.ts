import AxeBuilder from '@axe-core/playwright';
import { STATES, expect, test } from './helpers';

test.use({ reducedMotion: 'reduce' });

/**
 * Pasangan warna kontras rendah yang sudah diketahui dan menunggu keputusan desain
 * (warna merek teal #0E9F8E hanya 3,29:1 di atas putih; lihat docs/AUDIT.md).
 * Pelanggaran kontras DI LUAR daftar ini membuat tes gagal.
 */
const KNOWN_LOW_CONTRAST = (fg?: string, bg?: string) =>
  fg === '#0e9f8e' || bg === '#0e9f8e' || fg === '#16a34a' || (fg === '#718199' && bg === '#fdfefe');

for (const width of [360, 1280]) {
  for (const state of STATES) {
    test(`${state.name} @${width}px: tanpa pelanggaran WCAG 2 A/AA`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await state.open(page);
      const res = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();

      const unexpected = res.violations
        .map((v) => ({
          ...v,
          nodes: v.nodes.filter((n) => {
            if (v.id !== 'color-contrast') return true;
            const d = (n.any[0]?.data ?? {}) as { fgColor?: string; bgColor?: string };
            return !KNOWN_LOW_CONTRAST(d.fgColor, d.bgColor);
          }),
        }))
        .filter((v) => v.nodes.length > 0)
        .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`);

      expect(unexpected).toEqual([]);
    });
  }
}

test('fokus keyboard terlihat pada tautan lewati dan kontrol pertama', async ({ page }) => {
  await page.goto('/#/customer_space');
  await page.getByRole('main').waitFor();
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: /lewati|langsung ke konten/i });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();

  // Tab berikutnya: elemen fokus harus punya indikator (outline atau ring) yang terlihat.
  await page.keyboard.press('Tab');
  const outline = await page.evaluate(() => {
    const el = document.activeElement as HTMLElement;
    const cs = getComputedStyle(el);
    return { style: cs.outlineStyle, width: parseFloat(cs.outlineWidth), shadow: cs.boxShadow };
  });
  expect(outline.style !== 'none' && outline.width > 0 || outline.shadow !== 'none').toBe(true);
});

test('dialog: fokus terkurung dan Escape menutup lalu mengembalikan fokus', async ({ page }) => {
  await page.goto('/#/vendor_dashboard');
  const opener = page.getByRole('button', { name: /Buat Proyek Baru/ });
  await opener.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  for (let i = 0; i < 14; i++) {
    await page.keyboard.press('Tab');
    expect(await dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});

test('prefers-reduced-motion mematikan animasi CSS dan transisi', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('main').waitFor();
  const d = await page.evaluate(() => {
    const el = document.querySelector('.animate-float, .animate-pulse-soft, .animate-gradient');
    const cs = el ? getComputedStyle(el) : null;
    const dur = cs ? parseFloat(cs.animationDuration) : 0;
    return { found: !!el, name: cs?.animationName, dur };
  });
  // Elemen beranimasi, jika ada, tidak boleh punya animasi berjalan (animation: none atau ~0 dtk).
  if (d.found) expect(d.name === 'none' || d.dur <= 0.001).toBe(true);
});
