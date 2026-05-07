import { http, HttpResponse } from 'msw';
import { Notification } from '@entities/notification/types/notification.types';
import { CONSTANTS } from '@shared/config/constants';
import { getNotificationsForUser } from '@shared/api/mock/data/notifications';

const cache = new Map<string, Notification[]>();

function getOrInit(userId: string): Notification[] {
  if (!cache.has(userId)) cache.set(userId, getNotificationsForUser(userId));
  return cache.get(userId)!;
}

export const notificationHandlers = [
  http.get('/api/notifications', ({ cookies }) => {
    const userId = cookies[CONSTANTS.COOKIE_KEYS.MOCK_USER_ID];
    if (!userId) return HttpResponse.json([], { status: 401 });

    const notifications = getOrInit(userId);
    const sorted = [...notifications].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    return HttpResponse.json(sorted);
  }),

  http.patch('/api/notifications/:id/read', ({ params, cookies }) => {
    const userId = cookies[CONSTANTS.COOKIE_KEYS.MOCK_USER_ID];
    if (!userId) return new HttpResponse(null, { status: 401 });

    const notifications = getOrInit(userId);
    const { id } = params;
    const target = notifications.find((n) => n.id === id);

    if (target) {
      const index = notifications.indexOf(target);
      notifications[index] = { ...target, isWatched: true };
      return HttpResponse.json({ success: true });
    }

    return new HttpResponse(null, { status: 404 });
  }),
];
