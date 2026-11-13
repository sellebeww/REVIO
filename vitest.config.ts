import { defineConfig } from 'vitest/config';

// Tes unit untuk logika murni di src/lib. Zona waktu dikunci ke UTC agar hasil
// tidak bergantung pada mesin (lihat juga skrip "test" di package.json).
export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
    env: { TZ: 'UTC' },
  },
});
