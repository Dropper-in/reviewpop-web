/**
 * 인증 관련 MSW 핸들러
 *
 * 인증/사용자 API 엔드포인트를 Mock으로 구현합니다.
 */

import { http, HttpResponse } from 'msw';
import { ROUTES } from '@shared/config/routes';
import { CONSTANTS } from '@shared/config/constants';
import { generateJWT } from '@shared/lib/jwt';
import { toISO } from '@shared/lib/date';
import { mockUsers } from '../data/users';
import { findKakaoUserByToken, findNaverUserByToken } from '../data/oauth';
import { getUserCampaigns } from '../data/userCampaigns';

export const authHandlers = [
  /**
   * 카카오 소셜 로그인 (백엔드 API Mock)
   * POST /api/auth/social/kakao
   */
  http.post(ROUTES.API.SOCIAL_LOGIN.KAKAO, async ({ request }) => {
    try {
      const body = (await request.json()) as { access_token: string };
      const { access_token } = body;

      if (!access_token) {
        return HttpResponse.json(
          { success: false, error: { code: 'INVALID_TOKEN', message: 'Access Token이 필요합니다.' } },
          { status: 400 },
        );
      }

      const kakaoUser = findKakaoUserByToken(access_token);
      const userId = `kakao-${kakaoUser.id}`;
      const token = generateJWT({
        userId,
        email: kakaoUser.kakao_account.email,
        name: kakaoUser.properties.nickname,
        provider: 'kakao',
      });

      const user = {
        id: userId,
        email: kakaoUser.kakao_account.email,
        name: kakaoUser.properties.nickname,
        profileImage: kakaoUser.properties.profile_image || null,
        provider: 'kakao' as const,
        createdAt: toISO(),
      };

      return HttpResponse.json({ success: true, data: { token, user } });
    } catch {
      return HttpResponse.json(
        { success: false, error: { code: 'INTERNAL_ERROR', message: '서버 오류가 발생했습니다.' } },
        { status: 500 },
      );
    }
  }),

  /**
   * 네이버 소셜 로그인 (백엔드 API Mock)
   * POST /api/auth/social/naver
   */
  http.post(ROUTES.API.SOCIAL_LOGIN.NAVER, async ({ request }) => {
    try {
      const body = (await request.json()) as { access_token: string };
      const { access_token } = body;

      if (!access_token) {
        return HttpResponse.json(
          { success: false, error: { code: 'INVALID_TOKEN', message: 'Access Token이 필요합니다.' } },
          { status: 400 },
        );
      }

      const naverUser = findNaverUserByToken(access_token);
      const userId = `naver-${naverUser.response.id}`;
      const token = generateJWT({
        userId,
        email: naverUser.response.email,
        name: naverUser.response.name,
        provider: 'naver',
      });

      const user = {
        id: userId,
        email: naverUser.response.email,
        name: naverUser.response.name,
        profileImage: naverUser.response.profile_image || null,
        provider: 'naver' as const,
        createdAt: toISO(),
      };

      return HttpResponse.json({ success: true, data: { token, user } });
    } catch {
      return HttpResponse.json(
        { success: false, error: { code: 'INTERNAL_ERROR', message: '서버 오류가 발생했습니다.' } },
        { status: 500 },
      );
    }
  }),

  /**
   * 현재 사용자 정보 조회
   * GET /api/auth/me
   */
  http.get(ROUTES.API.ME, ({ cookies }) => {
    const userId = cookies[CONSTANTS.COOKIE_KEYS.MOCK_USER_ID];
    if (!userId) {
      return HttpResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: '인증이 필요합니다.' } },
        { status: 401 },
      );
    }

    const user = mockUsers.find((u) => u.id === userId);
    if (!user) {
      return HttpResponse.json(
        { success: false, error: { code: 'USER_NOT_FOUND', message: '사용자를 찾을 수 없습니다.' } },
        { status: 404 },
      );
    }

    return HttpResponse.json({ success: true, data: user });
  }),

  http.patch(ROUTES.API.ME, async ({ request, cookies }) => {
    const userId = cookies[CONSTANTS.COOKIE_KEYS.MOCK_USER_ID];
    if (!userId) {
      return HttpResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: '인증이 필요합니다.' } },
        { status: 401 },
      );
    }

    const body = (await request.json()) as {
      name?: string;
      phoneNumber?: string;
      blogAddress?: string;
    };

    const user = mockUsers.find((u) => u.id === userId);
    if (!user) {
      return HttpResponse.json(
        { success: false, error: { code: 'USER_NOT_FOUND', message: '사용자를 찾을 수 없습니다.' } },
        { status: 404 },
      );
    }

    if (body.name !== undefined) user.name = body.name;
    if (body.phoneNumber !== undefined) user.phoneNumber = body.phoneNumber;
    if (body.blogAddress !== undefined) user.blogAddress = body.blogAddress;

    return HttpResponse.json({ success: true, data: user });
  }),

  http.get(ROUTES.API.PROFILE, ({ cookies }) => {
    const userId = cookies[CONSTANTS.COOKIE_KEYS.MOCK_USER_ID];
    if (!userId) {
      return HttpResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: '인증이 필요합니다.' } },
        { status: 401 },
      );
    }

    const userCampaign = getUserCampaigns(userId);
    return HttpResponse.json({ success: true, data: userCampaign });
  }),
];
