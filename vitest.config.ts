import swc from 'unplugin-swc';
import tsConfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    root: './',
    exclude: ['dist', 'node_modules'],
  },
  plugins: [
    tsConfigPaths(),
    swc.vite({
      module: {
        type: 'es6',
      },
    }),
  ],
});
