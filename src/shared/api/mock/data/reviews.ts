import { BlogReview } from '@entities/review/types/review.types';
import { INITIAL_CAMPAIGNS } from '@shared/api/mock/data/campaigns';
import { getRandomDate, getRandomElement, getRandomImage } from '@shared/api/mock/utils/random';

const REVIEW_TITLES = [
  '[솔직후기] 강남역 데이트 코스로 완벽했던 그 토성, 재방문 의사 200%!',
  '내돈내산은 아니지만 찐으로 감동받은 후기 ✨ (feat. 친절한 사장님)',
  '주말 나들이 장소 추천! 가족들과 함께 다녀온 화성 떡갈비 솔직 리뷰 👨‍👩‍👧‍👦',
  '서울 핫플 인정! 웨이팅 있어도 꼭 가봐야 할 목성 솜사탕 다녀왔어요 💖',
  '가성비와 분위기 모두 잡은 수성, 나만 알고 싶은 곳 등극! 🤫',
  '특별한 날, 특별한 사람과 함께하기 좋은 금성 방문기 (메뉴 추천 포함)',
  '입맛 까다로운 제가 직접 검증하고 왔습니다! 천왕성 리얼 후기 📝',
  '사진 맛집 해왕성! 인생샷 건지고 맛있는 음식까지 힐링 그 자체 📸',
];

const REVIEW_ARTICLES = [
  '안녕하세요! 오늘은 지난 주말에 다녀온 핫한 장소를 소개해드리려고 해요. 입구부터 감성 넘치는 인테리어에 반해버렸답니다. 직원분들도 너무 친절하게 맞이해주셔서 기분 좋게 시작할 수 있었어요. 특히 시그니처 메뉴는 꼭 드셔보셔야 해요! 입안에서 살살 녹는 그 맛을 아직도 잊을 수가 없네요. 주차 공간도 넉넉해서 차 가져가시는 분들도 걱정 없으실 거예요. 데이트 코스로 강력 추천합니다! 💕',
  '오랜만에 친구들과 모임을 가졌는데, 장소 선택 정말 잘했다고 칭찬받았어요! 👏 분위기가 너무 시끄럽지도 않고 적당히 활기차서 대화 나누기 딱 좋더라고요. 음식 퀄리티는 말할 것도 없고, 플레이팅이 너무 예뻐서 사진을 안 찍을 수가 없었어요. 가격대가 조금 있는 편이지만, 그만큼의 가치를 하는 곳이라고 생각합니다. 특별한 날 기분 내고 싶을 때 방문해보세요!',
  '솔직히 기대 반 걱정 반으로 방문했는데, 결과는 대만족이었습니다! 👍 일단 재료가 정말 신선하다는 게 느껴졌고, 사장님의 정성이 들어간 게 보였어요. 양도 푸짐해서 배 터지게 먹고 왔네요. 다만 웨이팅이 좀 있을 수 있으니 오픈런 하시거나 예약하고 가시는 걸 추천드려요. 저는 평일 저녁에 갔는데도 사람이 꽤 많더라고요. 그래도 기다린 보람이 있는 맛집이었습니다!',
  '요즘 SNS에서 핫하다는 그곳, 저도 드디어 다녀왔습니다! 🏃‍♀️ 실제로 가보니 사진보다 훨씬 더 예쁘고 분위기 깡패였어요. 조명도 은은해서 셀카도 잘 나오고, 곳곳이 포토존이라 인생샷 건지기 딱 좋아요. 음식 맛은 호불호가 갈릴 수 있겠지만, 제 입맛에는 딱 맞았어요. 특히 디저트가 정말 환상적이었습니다. 달달한 거 좋아하시는 분들은 무조건 좋아하실 거예요! 🍰',
  '부모님 모시고 갈만한 곳 찾다가 발견한 보석 같은 곳이에요. 💎 어르신들 입맛에도 잘 맞을까 걱정했는데, 너무 맛있게 잘 드셔서 뿌듯했습니다. 매장도 청결하고 직원분들이 세심하게 챙겨주시는 모습에 감동받았어요. 가족 외식 장소로 이만한 곳이 없을 것 같아요. 다음에는 다른 메뉴도 먹어보러 재방문할 예정입니다. 강추해요! ⭐⭐⭐⭐⭐',
  '가성비 최고! 이 가격에 이런 퀄리티라니 믿기지가 않아요. 😲 학생분들이나 사회 초년생분들도 부담 없이 즐길 수 있는 곳입니다. 그렇다고 맛이 저렴하냐? 절대 아니에요! 웬만한 고급 레스토랑 못지않은 맛과 비주얼을 자랑합니다. 친구랑 둘이서 메뉴 3개 시켜서 싹싹 긁어먹고 왔어요. ㅋㅋ 가볍게 한잔하기도 좋은 분위기라 저녁에 가는 것도 추천드려요! 🍻',
  '비 오는 날 방문했는데 운치 있고 너무 좋았어요. ☔ 창가 자리에 앉아서 빗소리 들으며 맛있는 음식 먹으니 힐링이 따로 없더라고요. 메뉴 하나하나에 정성이 가득 들어간 느낌이었고, 설명도 친절하게 해주셔서 좋았습니다. 혼자 방문해서 조용히 즐기기에도 부담 없는 분위기였어요. 혼밥, 혼술 장소 찾으시는 분들에게도 추천하고 싶은 곳입니다. 🍷',
  '서비스가 정말 인상 깊었던 곳입니다. 바쁜 와중에도 미소를 잃지 않고 응대해주시는 모습에 감동받았어요. 🥰 음식 나오는 속도도 적당했고, 중간중간 필요한 건 없는지 체크해주시는 센스까지! 맛도 맛이지만 이런 서비스 때문에라도 다시 찾고 싶어지는 곳이에요. 기분 좋은 식사 하고 싶으신 분들은 꼭 한번 방문해보세요. 후회 안 하실 겁니다!',
];

const createRandomBlogReview = (
  index: number,
  targetCampaign?: (typeof INITIAL_CAMPAIGNS)[0],
): BlogReview => {
  const campaign = targetCampaign || getRandomElement(INITIAL_CAMPAIGNS);

  const campaignEndDate = new Date(campaign.schedule.review.end);
  const reviewDate = getRandomDate(
    campaignEndDate,
    new Date(campaignEndDate.getTime() + 7 * 24 * 60 * 60 * 1000),
  );

  return {
    id: `review_${index}`,
    campaignId: campaign.id,
    thumbnail: getRandomImage(400, 300),
    title: getRandomElement(REVIEW_TITLES).replace('OOO', campaign.title),
    article: getRandomElement(REVIEW_ARTICLES),
    url: 'https://blog.naver.com/blogpeople/150083273446',
    date: reviewDate.split('T')[0],
  };
};

export const INITIAL_REVIEWS: BlogReview[] = (() => {
  const reviews: BlogReview[] = [];
  let reviewIndex = 0;

  const completedCampaigns = INITIAL_CAMPAIGNS.filter((c) => c.status === 'completed');
  completedCampaigns.forEach((campaign) => {
    const reviewCount = 5 + Math.floor(Math.random() * 4);
    for (let i = 0; i < reviewCount; i++) {
      reviews.push(createRandomBlogReview(reviewIndex++, campaign));
    }
  });

  const otherCampaigns = INITIAL_CAMPAIGNS.filter((c) => c.status !== 'completed');
  otherCampaigns.forEach((campaign) => {
    if (Math.random() > 0.7) {
      reviews.push(createRandomBlogReview(reviewIndex++, campaign));
    }
  });

  return reviews;
})();
