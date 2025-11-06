import type { Preview } from '@storybook/react-vite';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },

    // 뷰포트 설정
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1440px', height: '900px' },
        },
        large: {
          name: 'Large Desktop',
          styles: { width: '1920px', height: '1080px' },
        },
      },
      defaultViewport: 'desktop',
    },

    // 레이아웃 옵션
    layout: 'fullscreen',

    // Chromatic 글로벌 설정
    chromatic: {
      viewports: [768, 1024, 1440, 1920],
      delay: 1000,
    },
  },
};

export default preview;
