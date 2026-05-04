import { Notification } from '@entities/notification/types/notification.types';
import { mockApplications } from '@shared/api/mock/data/applications';


function daysOffset(base: string, days: number): string {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export function getNotificationsForUser(userId: string): Notification[] {
  const now = new Date().toISOString();
  const myApps = mockApplications.filter((app) => app.userId === userId);

  const { selected, schedule, edit } = myApps.reduce<{
    selected: Notification[];
    schedule: Notification[];
    edit: Notification[];
  }>(
    (acc, app) => {
      if (app.status === 'selected') {
        const i = acc.selected.length;
        acc.selected.push({
          id: `noti_selected_${app.campaign.id}`,
          campaignId: app.campaign.id,
          title: '캠페인 선정 안내',
          content: `[${app.campaign.title}] 캠페인에 선정되셨습니다! 지금 바로 확인해보세요.`,
          type: 'default',
          createdAt: daysOffset(now, -(i * 3 + 3)),
          isWatched: false,
        });
      } else if (app.status === 'reviewed') {
        if (app.reviewStatus === 'requiredForEditing') {
          acc.edit.push({
            id: `noti_edit_${app.campaign.id}`,
            campaignId: app.campaign.id,
            title: '리뷰 수정 요청',
            content: `[${app.campaign.title}] 작성하신 리뷰에 대한 수정 요청이 있습니다. 확인 후 수정 부탁드립니다.`,
            type: 'edit',
            createdAt: daysOffset(now, -1),
            isWatched: false,
          });
        } else if (app.reviewStatus === 'notReviewed' || app.reviewStatus === 'visited') {
          acc.schedule.push({
            id: `noti_schedule_${app.campaign.id}`,
            campaignId: app.campaign.id,
            title: '리뷰 작성 기간 안내',
            content: `[${app.campaign.title}] 리뷰 작성 마감일이 다가오고 있습니다. 늦지 않게 작성해주세요.`,
            type: 'schedule',
            createdAt: daysOffset(app.campaign.schedule.review.end, -7),
            isWatched: false,
          });
        }
      }
      return acc;
    },
    { selected: [], schedule: [], edit: [] },
  );

  return [...edit, ...selected, ...schedule];
}
