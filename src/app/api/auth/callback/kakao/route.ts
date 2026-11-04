/**
 * 카카오 OAuth 콜백 API Route
 *
 * 카카오 인증 후 리다이렉트되는 엔드포인트
 */

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { CONSTANTS } from '@shared/config/constants';
import { ROUTES } from '@shared/config/routes';
import { verifyOAuthStateCookie } from '@shared/lib/cookies.server';
import { env } from '@shared/config/env';
import type { KakaoTokenResponse, AuthResponse } from '@shared/types/auth.types';

/**
 * GET /api/auth/callback/kakao
 *
 * @param request - Next.js Request
 * @returns 리다이렉트 응답
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // 에러 처리 (사용자가 권한 거부 등)
    if (error) {
      return NextResponse.redirect(new URL(ROUTES.LOGIN + '?error=oauth_failed', request.url));
    }

    // code 확인
    if (!code) {
      return NextResponse.redirect(new URL(ROUTES.LOGIN + '?error=invalid_code', request.url));
    }

    // State 검증 (CSRF 방지)
    const redirectUrl = state ? await verifyOAuthStateCookie(state) : null;
    if (state && !redirectUrl) {
      return NextResponse.redirect(new URL(ROUTES.LOGIN + '?error=invalid_state', request.url));
    }

    let token: string;
    let mockUserId: string | undefined;

    if (env.useMock) {
      const { generateJWT } = await import('@shared/lib/jwt');

      const mockKakaoUser = {
        id: 1001,
        email: 'park.minsoo@kakao.com',
        name: '김철수',
      };

      mockUserId = `kakao-${mockKakaoUser.id}`;
      token = generateJWT({
        userId: mockUserId,
        email: mockKakaoUser.email,
        name: mockKakaoUser.name,
        provider: 'kakao',
      });
    } else {
      const tokenResponse = await axios.post<KakaoTokenResponse>(
        CONSTANTS.OAUTH.KAKAO.TOKEN_URL,
        new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: process.env.KAKAO_CLIENT_ID || '',
          redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}${ROUTES.AUTH_CALLBACK.KAKAO}`,
          code,
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );

      const access_token = tokenResponse.data.access_token;

      const backendResponse = await axios.post<AuthResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}${ROUTES.API.SOCIAL_LOGIN.KAKAO}`,
        { access_token },
      );

      if (!backendResponse.data.success) {
        return NextResponse.redirect(new URL(ROUTES.LOGIN + '?error=auth_failed', request.url));
      }

      token = backendResponse.data.data.token;
    }

    // 리다이렉트
    const finalRedirectUrl = redirectUrl || ROUTES.HOME;
    const response = NextResponse.redirect(new URL(finalRedirectUrl, request.url));

    response.cookies.set(CONSTANTS.COOKIE_KEYS.AUTH_TOKEN, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    if (env.useMock) {
      response.cookies.set(CONSTANTS.COOKIE_KEYS.MOCK_USER_ID, mockUserId!, {
        httpOnly: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return response;
  } catch (error) {
    return NextResponse.redirect(new URL(ROUTES.LOGIN + '?error=server_error', request.url));
  }
}
