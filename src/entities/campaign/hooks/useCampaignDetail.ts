import { useQuery } from '@tanstack/react-query';

import { getCampaignDetail } from '../api/campaignApi';

export function useCampaignDetail(campaignId: string, enabled = true) {
  return useQuery({
    queryKey: ['campaign', campaignId, 'detail'],
    queryFn: () => getCampaignDetail(campaignId),
    enabled: enabled && !!campaignId,
  });
}
