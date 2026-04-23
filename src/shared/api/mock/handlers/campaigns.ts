import { http, HttpResponse } from 'msw';
import { INITIAL_CAMPAIGNS } from '@shared/api/mock/data/campaigns';
import { CampaignCategory, CampaignStatus } from '@entities/campaign/types/campaign.types';

export const campaignHandlers = [
  http.get('/api/campaigns', ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get('category') as CampaignCategory | null;
    const status = url.searchParams.get('status') as CampaignStatus | null;
    const location = url.searchParams.get('location');
    const page = Number(url.searchParams.get('page') || '1');
    const size = Number(url.searchParams.get('size') || '10');

    let filteredCampaigns = [...INITIAL_CAMPAIGNS];

    if (category) {
      filteredCampaigns = filteredCampaigns.filter((c) => c.category === category);
    }
    if (status) {
      filteredCampaigns = filteredCampaigns.filter((c) => c.status === status);
    }
    if (location) {
      filteredCampaigns = filteredCampaigns.filter((c) => c.location.sido === location);
    }

    filteredCampaigns.sort((a, b) => {
      switch (status) {
        case 'recruiting':
          return (
            new Date(a.schedule.application.end).getTime() -
            new Date(b.schedule.application.end).getTime()
          );
        case 'beforeRecruiting':
          return (
            new Date(a.schedule.application.start).getTime() -
            new Date(b.schedule.application.start).getTime()
          );
        case 'completed':
          return (
            new Date(b.schedule.winnerAnnouncement.end).getTime() -
            new Date(a.schedule.winnerAnnouncement.end).getTime()
          );
        default:
          return b.id.localeCompare(a.id, undefined, { numeric: true });
      }
    });

    const totalCount = filteredCampaigns.length;
    const totalPages = Math.ceil(totalCount / size);
    const start = (page - 1) * size;
    const content = filteredCampaigns.slice(start, start + size).map((campaign) => {
      const {
        estimatedValue,
        keywords,
        visitReservation,
        reviewMission,
        reviewMissionNotice,
        requirements,
        precautions,
        ...summary
      } = campaign;
      return summary;
    });

    return HttpResponse.json({
      success: true,
      data: {
        content,
        meta: {
          page,
          size,
          totalCount,
          totalPages,
          hasNextPage: page < totalPages,
        },
      },
    });
  }),

  http.get('/api/campaigns/:id', ({ params }) => {
    const { id } = params;
    const campaign = INITIAL_CAMPAIGNS.find((c) => c.id === id);

    if (campaign) {
      return HttpResponse.json({ success: true, data: campaign });
    }

    return HttpResponse.json({ success: false, error: 'Campaign not found' }, { status: 404 });
  }),
];
