/**
 * MSW 핸들러 통합 (Lazy Loading 최적화)
 *
 * 모든 도메인별 핸들러를 하나로 통합합니다.
 * 성능 최적화를 위해 필요한 핸들러만 동적으로 로드합니다.
 */

// 핵심 핸들러만 즉시 로드
import { authHandlers } from '@shared/api/mock/handlers/auth';
import { kakaoOAuthHandlers } from '@shared/api/mock/handlers/oauth/kakao';

/**
 * 모든 MSW 핸들러 (Lazy Loading 적용)
 *
 * 새로운 도메인 핸들러를 추가할 때는 여기에 추가하세요.
 * 성능을 위해 핵심 핸들러만 즉시 로드하고, 나머지는 필요 시 로드.
 */
export const handlers = [
  ...kakaoOAuthHandlers, // OAuth 핸들러 (외부 도메인) - 즉시 필요
  ...authHandlers, // 인증 핸들러 - 즉시 필요
];

/**
 * 추가 핸들러 동적 로드 함수
 * 페이지 이동 시 필요한 핸들러만 로드하여 성능 최적화
 */
export async function loadAdditionalHandlers() {
  const [
    { campaignHandlers },
    { myCampaignHandlers },
    { notificationHandlers },
    { reviewHandlers },
    { applicationHandlers },
    { reservationHandlers },
  ] = await Promise.all([
    import('@shared/api/mock/handlers/campaigns'),
    import('@shared/api/mock/handlers/myCampaigns'),
    import('@shared/api/mock/handlers/notifications'),
    import('@shared/api/mock/handlers/reviews'),
    import('@shared/api/mock/handlers/applications'),
    import('@shared/api/mock/handlers/reservations'),
  ]);

  return [
    ...campaignHandlers,
    ...myCampaignHandlers,
    ...applicationHandlers,
    ...reservationHandlers,
    ...notificationHandlers,
    ...reviewHandlers,
  ];
}
