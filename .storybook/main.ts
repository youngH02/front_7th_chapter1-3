import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(config) {
    // Storybook에서도 API 프록시 설정을 적용
    if (config.server) {
      config.server.proxy = {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
      };
    }
    return config;
  },
};
export default config;
