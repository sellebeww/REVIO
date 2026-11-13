import { STATES, expect, test } from './helpers';

// Lebar ponsel kecil. Gerak dimatikan agar posisi elemen stabil.
test.use({ viewport: { width: 360, height: 740 }, reducedMotion: 'reduce' });

for (const state of STATES) {
  test.describe(state.name, () => {
    test('tidak ada gulir horizontal pada halaman', async ({ page }) => {
      await state.open(page);
      const m = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        root: document.documentElement.scrollWidth,
        body: document.body.scrollWidth,
      }));
      expect(m.viewport).toBe(360);
      expect(m.root).toBeLessThanOrEqual(m.viewport);
      expect(m.body).toBeLessThanOrEqual(m.viewport);
    });

    // Pagar terhadap klip yang menyembunyikan kontrol: setiap kontrol interaktif harus
    // berada di dalam viewport, atau di dalam kontainer yang memang bisa digulir horizontal.
    test('tidak ada kontrol yang terpotong di luar viewport', async ({ page }) => {
      await state.open(page);
      const hidden = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const bad: string[] = [];
        const sel = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
        document.querySelectorAll<HTMLElement>(sel).forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) return;
          if (r.left >= -1 && r.right <= vw + 1) return;
          for (let p = el.parentElement; p; p = p.parentElement) {
            const ox = getComputedStyle(p).overflowX;
            if ((ox === 'auto' || ox === 'scroll') && p.scrollWidth > p.clientWidth) return;
          }
          bad.push(`${el.tagName.toLowerCase()} "${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 40)}" [${Math.round(r.left)}..${Math.round(r.right)}]`);
        });
        return bad;
      });
      expect(hidden).toEqual([]);
    });
  });
}
