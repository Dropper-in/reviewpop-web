/**
 * App Providers
 *
 * 앱 전체에서 사용하는 Provider들을 모아둔 컴포넌트입니다.
 * - React Query
 * - MSW (Mock Service Worker)
 * - PopUiProvider (Mantine Theme, Toast Notifications)
 * - 테마 초기화
 * - 사용자 정보 복원
 */

'use client';

import { ReactNode, useEffect, useState } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { MantineProvider, createTheme, Loader } from '@mantine/core';

import { PopUiProvider } from '@pop-ui/core';
import { env } from '@shared/config/env';

interface ProvidersProps {
  children: ReactNode;
}

const theme = createTheme({
  components: {
    Loader: Loader.extend({
      defaultProps: {
        color: 'var(--primary-500)',
      },
    }),
  },
});

/**
 * React Query Client 생성
 *
 * 전역 설정을 여기서 관리합니다.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 데이터가 신선한 상태로 유지되는 시간 (5분)
      staleTime: 1000 * 60 * 5,
      // 캐시에 데이터를 유지하는 시간 (10분)
      gcTime: 1000 * 60 * 10,
      // 윈도우 포커스 시 자동 refetch (개발 중에는 귀찮을 수 있음)
      refetchOnWindowFocus: env.isProd,
      // 네트워크 재연결 시 자동 refetch
      refetchOnReconnect: true,
      // 에러 발생 시 재시도 횟수
      retry: 1,
    },
  },
});

export function Providers({ children }: ProvidersProps) {
  const [isMswReady, setIsMswReady] = useState(!env.useMock);

  /**
   * MSW 초기화
   * Mock API를 사용하는 경우에만 실행됩니다.
   */
  useEffect(() => {
    if (env.useMock) {
      async function initMocks() {
        try {
          const { worker } = await import('@shared/api/mock/browser');
          await worker.start({
            onUnhandledRequest: 'bypass',
            quiet: true,
          });
          console.log('🎭 MSW (Mock Service Worker) 활성화됨');
          setIsMswReady(true);
        } catch (error) {
          console.error('MSW 초기화 실패:', error);
          // MSW 실패해도 앱은 계속 실행
          setIsMswReady(true);
        }
      }

      initMocks();
    }
  }, []);

  // MSW가 준비되지 않았으면 로딩 표시
  if (!isMswReady) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <p>준비 중...</p>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <PopUiProvider notificationPosition="bottom-center">
          {children}
          {/* React Query Devtools - 개발 환경에서만 표시 */}
          {env.isDev && (
            <ReactQueryDevtools
              initialIsOpen={false}
              buttonPosition="bottom-right"
              position="bottom"
            />
          )}
        </PopUiProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}
