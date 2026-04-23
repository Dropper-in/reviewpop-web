import { http, HttpResponse } from 'msw';
import { ApiResponse } from '@shared/api/types/common.types';
import { INITIAL_REVIEWS } from '@shared/api/mock/data/reviews';
import { createEditRequest } from '@shared/api/mock/data/reviewEditData';
import { BlogReviews, BlogReview, PostReview } from '@entities/review/types/review.types';
import { mockApplications } from '@shared/api/mock/data/applications';

const reviews = [...INITIAL_REVIEWS];

export const reviewHandlers = [
  http.get('/api/reviews', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || '1');
    const size = Number(url.searchParams.get('size') || '10');
    const campaignId = url.searchParams.get('campaignId');

    let filteredReviews = [...reviews];
    if (campaignId) {
      filteredReviews = filteredReviews.filter((r) => r.campaignId === campaignId);
    }

    filteredReviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const totalCount = filteredReviews.length;
    const totalPages = Math.ceil(totalCount / size);
    const start = (page - 1) * size;
    const content = filteredReviews.slice(start, start + size);

    return HttpResponse.json<ApiResponse<BlogReviews>>({
      success: true,
      data: {
        reviews: content,
        pageSize: size,
        hasNext: page < totalPages,
      },
    });
  }),

  http.get('/api/reviews/:id/edit-request', () => {
    return HttpResponse.json({ data: createEditRequest(), success: true });
  }),

  http.post('/api/reviews', async ({ request }) => {
    const body = (await request.json()) as PostReview;

    const newReview: BlogReview = {
      id: `review_${Date.now()}`,
      campaignId: body.campaignId,
      thumbnail: 'https://picsum.photos/400/300',
      title: '새로운 리뷰',
      article: '리뷰 내용입니다.',
      url: body.reviewUrl,
      date: new Date().toISOString().split('T')[0],
    };

    reviews.unshift(newReview);

    const application = mockApplications.find(
      (app) => app.campaign.id === body.campaignId && app.userId === body.userId,
    );
    if (application) {
      application.status = 'reviewed';
      application.reviewStatus = 'reviewPending';
      application.reviewId = newReview.id;
    }

    return HttpResponse.json<ApiResponse<PostReview>>({ success: true, data: body });
  }),

  http.patch('/api/reviews/:id', async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as Partial<PostReview>;
    const reviewIndex = reviews.findIndex((r) => r.id === id);

    if (reviewIndex > -1) {
      const updatedReview = { ...reviews[reviewIndex], ...body };
      if (body.reviewUrl) updatedReview.url = body.reviewUrl;
      reviews[reviewIndex] = updatedReview;

      const application = mockApplications.find(
        (app) => app.campaign.id === updatedReview.campaignId,
      );
      if (application) {
        application.status = 'reviewed';
        application.reviewStatus = 'reviewPending';
      }

      return HttpResponse.json<ApiResponse<PostReview>>({
        success: true,
        data: {
          campaignId: updatedReview.campaignId,
          userId: 'kakao-1001',
          reviewUrl: updatedReview.url,
        },
      });
    }

    return HttpResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
  }),
];
