import { http, HttpResponse } from 'msw';
import { INITIAL_NOTIFICATIONS } from '@shared/api/mock/data/notifications';

const notifications = [...INITIAL_NOTIFICATIONS];

export const notificationHandlers = [
  http.get('/api/notifications', () => {
    const sortedNotifications = [...notifications].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    return HttpResponse.json(sortedNotifications);
  }),

  http.patch('/api/notifications/:id/read', ({ params }) => {
    const { id } = params;
    const targetNotification = notifications.find((n) => n.id === id);

    if (targetNotification) {
      const targetDate = new Date(targetNotification.createdAt);
      notifications.forEach((n, index) => {
        if (new Date(n.createdAt) >= targetDate) {
          notifications[index] = { ...n, isWatched: true };
        }
      });
      return HttpResponse.json({ success: true });
    }

    return new HttpResponse(null, { status: 404 });
  }),
];
