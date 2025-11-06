import type { Meta, StoryObj } from '@storybook/react';
import { SnackbarProvider } from 'notistack';
import App from '../../App';

// App을 감싸는 Provider
const AppWrapper = ({ children }: { children: React.ReactNode }) => (
  <SnackbarProvider
    maxSnack={3}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
  >
    {children}
  </SnackbarProvider>
);

const meta: Meta<typeof App> = {
  title: 'Application/App',
  component: App,
  decorators: [
    (Story) => (
      <AppWrapper>
        <div
          style={{
            width: '100vw',
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Story />
        </div>
      </AppWrapper>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'desktop',
    },
    chromatic: {
      viewports: [1200, 1440, 1920],
      delay: 2000, // 앱 로딩 대기
      disableSnapshot: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof App>;

// 1. 기본 앱 상태 (월별 뷰)
export const Default: Story = {
  name: '기본 상태 - 월별 뷰',
  parameters: {
    chromatic: {
      delay: 3000, // 데이터 로딩 대기
    },
  },
};
