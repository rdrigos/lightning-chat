import util from 'node:util';
import swc from 'unplugin-swc';
import tsConfigPaths from 'vite-tsconfig-paths';
import { defineConfig, ViteUserConfig } from 'vitest/config';

const profiles: Record<string, ViteUserConfig> = {
  test: {
    test: {
      include: ['src/**/*.spec.ts'],
    },
  },
  e2e: {
    test: {
      include: ['src/**/*.e2e.ts'],
    },
  },
};

function getTestProfile(mode: string): ViteUserConfig {
  const profile = profiles[mode];

  if (!profile) {
    const available = Object.keys(profiles).join(', ');
    throw new Error(util.format("Unknown test mode '%s'. Valid profiles are: %s", mode, available));
  }

  return profile;
}

export default defineConfig(({ mode }) => {
  const profile = getTestProfile(mode);

  return {
    test: {
      root: './',
      globals: true,
      exclude: ['dist', 'node_modules'],
      ...profile.test,
    },
    plugins: [
      tsConfigPaths(),
      swc.vite({
        module: {
          type: 'es6',
        },
      }),
    ],
  };
});
