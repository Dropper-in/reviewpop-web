/**
 * 네이버 OAuth 콜백 API Route
 *
 * 네이버 인증 후 리다이렉트되는 엔드포인트
 */

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { CONSTANTS } from '@shared/config/constants';
import { ROUTES } from '@shared/config/routes';
import { setAuthCookie, verifyOAuthStateCookie } from '@shared/lib/cookies.server';
import type { NaverTokenResponse, AuthResponse } from '@shared/types/auth.types';

/**
 * GET /api/auth/callback/naver
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

    if (error) {
      return NextResponse.redirect(new URL(ROUTES.LOGIN + '?error=oauth_failed', request.url));
    }

    if (!code) {
      return NextResponse.redirect(new URL(ROUTES.LOGIN + '?error=invalid_code', request.url));
    }

    const redirectUrl = state ? await verifyOAuthStateCookie(state) : null;
    if (state && !redirectUrl) {
      return NextResponse.redirect(new URL(ROUTES.LOGIN + '?error=invalid_state', request.url));
    }

    let access_token: string;

    if (process.env.NODE_ENV === 'development') {
      access_token = `mock-naver-access-token-${Date.now()}`;
    } else {
      const tokenResponse = await axios.get<NaverTokenResponse>(
        CONSTANTS.OAUTH.NAVER.TOKEN_URL,
        {
          params: {
            grant_type: 'authorization_code',
            client_id: process.env.NAVER_CLIENT_ID || '',
            client_secret: process.env.NAVER_CLIENT_SECRET || '',
            redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}${ROUTES.AUTH_CALLBACK.NAVER}`,
            code,
            state,
          },
        },
      );

      access_token = tokenResponse.data.access_token;
    }

    let token: string;
    let mockUserId: string | undefined;

    if (process.env.NODE_ENV === 'development') {
      const { generateJWT } = await import('@shared/lib/jwt');

      const mockNaverUser = {
        id: 2001,
        email: 'han.sora@naver.com',
        name: '한소라',
      };

      mockUserId = `naver-${mockNaverUser.id}`;
      token = generateJWT({
        userId: mockUserId,
        email: mockNaverUser.email,
        name: mockNaverUser.name,
        provider: 'naver',
      });
    } else {
      const backendResponse = await axios.post<AuthResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}${ROUTES.API.SOCIAL_LOGIN.NAVER}`,
        { access_token },
      );

      if (!backendResponse.data.success) {
        return NextResponse.redirect(new URL(ROUTES.LOGIN + '?error=auth_failed', request.url));
      }

      token = backendResponse.data.data.token;
    }

    await setAuthCookie(token);

    const finalRedirectUrl = redirectUrl || ROUTES.HOME;
    const response = NextResponse.redirect(new URL(finalRedirectUrl, request.url));

    response.cookies.set(CONSTANTS.COOKIE_KEYS.AUTH_TOKEN, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    if (process.env.NODE_ENV === 'development') {
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
