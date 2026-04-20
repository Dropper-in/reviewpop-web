import { http, HttpResponse } from 'msw';

import { mockReservations } from '@shared/api/mock/data/reservations';
import { mockApplications } from '@shared/api/mock/data/applications';

export const myCampaignHandlers = [
  /**
   * [myCampaignHandlers] 내 체험 목록/신청 취소 mock API
   * - 실제 데이터 소스는 @shared/api/mock/data/applications.ts의 mockApplications 단일 소스만 사용
   * - 예약 상태 동기화 및 사용자별 신청 내역 반환
   */
  http.get('/api/my-campaigns', () => {
    const userId = 'kakao-1001'; // 테스트용 사용자
    const myApplications = mockApplications
      .filter((app) => app.userId === userId)
      .map((app) => {
        if (app.reservationId && !mockReservations.some((r) => r.id === app.reservationId)) {
          return {
            ...app,
            isReservated: false,
            reservationId: undefined,
            reservationDate: undefined,
            status: 'selected' as const,
          };
        }
        return app;
      });
    return HttpResponse.json({
      data: { applications: myApplications },
      success: true,
    });
  }),
  http.delete('/api/campaigns/:campaignId', ({ params }) => {
    const { campaignId } = params;
    const index = mockApplications.findIndex((app) => app.campaign.id === campaignId);
    if (index === -1) {
      return HttpResponse.json(
        { success: false, error: '신청 내역을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }
    mockApplications.splice(index, 1);
    return HttpResponse.json({
      data: null,
      success: true,
    });
  }),
];
