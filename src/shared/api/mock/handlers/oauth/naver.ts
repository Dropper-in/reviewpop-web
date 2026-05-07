/**
 * 네이버 OAuth MSW Mock 핸들러
 */

import { http, HttpResponse } from 'msw';
import { CONSTANTS } from '@shared/config/constants';
import type { NaverTokenResponse } from '@shared/types/auth.types';
import { findNaverUserByToken } from '../../data/oauth';

export const naverOAuthHandlers = [
  /**
   * 네이버 토큰 발급
   * GET https://nid.naver.com/oauth2.0/token
   */
  http.get(CONSTANTS.OAUTH.NAVER.TOKEN_URL, ({ request }) => {
    const url = new URL(request.url);
    const grantType = url.searchParams.get('grant_type');
    const code = url.searchParams.get('code');

    if (grantType !== 'authorization_code') {
      return HttpResponse.json(
        { error: 'invalid_grant', error_description: 'grant_type이 잘못되었습니다.' },
        { status: 400 },
      );
    }

    if (!code) {
      return HttpResponse.json(
        { error: 'invalid_request', error_description: 'code가 필요합니다.' },
        { status: 400 },
      );
    }

    const tokenResponse: NaverTokenResponse = {
      access_token: `mock-naver-access-token-${Date.now()}`,
      refresh_token: `mock-naver-refresh-token-${Date.now()}`,
      token_type: 'bearer',
      expires_in: 3600,
    };

    return HttpResponse.json(tokenResponse);
  }),

  /**
   * 네이버 사용자 정보 조회
   * GET https://openapi.naver.com/v1/nid/me
   */
  http.get(CONSTANTS.OAUTH.NAVER.USER_INFO_URL, ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ resultcode: '024', message: 'Unauthorized' }, { status: 401 });
    }

    const accessToken = authHeader.replace('Bearer ', '');
    const userInfo = findNaverUserByToken(accessToken);

    return HttpResponse.json(userInfo);
  }),
];
