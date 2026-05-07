import { http, HttpResponse } from 'msw';

import { CONSTANTS } from '@shared/config/constants';
import { mockReservations } from '@shared/api/mock/data/reservations';
import { mockApplications } from '@shared/api/mock/data/applications';

export const myCampaignHandlers = [
  http.get('/api/my-campaigns', ({ cookies }) => {
    const userId = cookies[CONSTANTS.COOKIE_KEYS.MOCK_USER_ID];
    if (!userId) {
      return HttpResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 });
    }
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
    return HttpResponse.json({ data: null, success: true });
  }),
];
