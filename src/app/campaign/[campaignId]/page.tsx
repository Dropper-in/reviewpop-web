import { cookies } from 'next/headers';

import { CONSTANTS } from '@shared/config/constants';
import { verifyJWT } from '@shared/lib/jwt';

import CampaignDetailClient from './CampaignDetailClient';

interface PageProps {
  params: Promise<{ campaignId: string }>;
}

export default async function CampaignDetailPage({ params }: PageProps) {
  const { campaignId } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get(CONSTANTS.COOKIE_KEYS.AUTH_TOKEN)?.value;
  const isAuthenticated = !!verifyJWT(token ?? '');

  return <CampaignDetailClient campaignId={campaignId} isAuthenticated={isAuthenticated} />;
}
