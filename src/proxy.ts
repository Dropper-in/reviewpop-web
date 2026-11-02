import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { CONSTANTS } from '@shared/config/constants';
import { ROUTES } from '@shared/config/routes';

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get(CONSTANTS.COOKIE_KEYS.AUTH_TOKEN);

  // 보호된 경로에 접근하면서 인증 토큰이 없는 경우 로그인 페이지로 이동
  if (!authToken) {
    const currentUrl = request.nextUrl.pathname + request.nextUrl.search;
    const loginUrl = new URL(ROUTES.LOGIN, request.url);
    loginUrl.searchParams.set('redirect', currentUrl);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// 미들웨어가 실행될 경로 설정
export const config = {
  matcher: [
    /*
     * 보호된 경로 패턴:
     * 1. /my/:path* (나의 체험 및 하위 경로)
     * 2. /reviews/create (후기 작성)
     * 3. /settings/:path* (설정 및 하위 경로)
     * 4. /campaign/:id/reserve (체험 예약)
     * 5. /notifications (알림)
     * 6. /profile (마이 페이지)
     */
    '/my/:path*',
    '/campaign/:path*/review/write/:path*',
    '/settings/:path*',
    '/campaign/:path*/reserve/:path*',
    '/notifications',
    '/profile',
  ],
};
