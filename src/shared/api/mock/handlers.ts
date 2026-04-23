/**
 * MSW 핸들러 통합
 *
 * 모든 도메인별 핸들러를 하나로 통합합니다.
 */

import { authHandlers } from '@shared/api/mock/handlers/auth';
import { kakaoOAuthHandlers } from '@shared/api/mock/handlers/oauth/kakao';
import { campaignHandlers } from '@shared/api/mock/handlers/campaigns';
import { myCampaignHandlers } from '@shared/api/mock/handlers/myCampaigns';
import { notificationHandlers } from '@shared/api/mock/handlers/notifications';
import { reviewHandlers } from '@shared/api/mock/handlers/reviews';
import { applicationHandlers } from '@shared/api/mock/handlers/applications';
import { reservationHandlers } from '@shared/api/mock/handlers/reservations';

/**
 * 모든 MSW 핸들러
 *
 * 새로운 도메인 핸들러를 추가할 때는 여기에 추가하세요.
 */
export const handlers = [
  ...kakaoOAuthHandlers,
  ...authHandlers,
  ...campaignHandlers,
  ...myCampaignHandlers,
  ...applicationHandlers,
  ...reservationHandlers,
  ...notificationHandlers,
  ...reviewHandlers,
];
